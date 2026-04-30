import json
from functools import partial
from collections import defaultdict
import numpy as np

import geopandas as gpd
from gerrychain import Graph, Partition, MarkovChain
from gerrychain.proposals import recom
from gerrychain.constraints import within_percent_of_ideal_population
from gerrychain.updaters import Tally

import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
import mpld3

import sys


# ============================================================
# CONFIG
# ============================================================
INPUT_FILE = sys.argv[1]

POP_COL = "POP_TOTAL"
ASSIGN_COL = "CONG_DIST"

DEM_COL = "DEMOCRATIC"
REP_COL = "REPUBLICAN"

GROUPS = {
    "Black": {
        "pop_col": "POP_BLACK",
        "reg_total_col": "REG_BLACK",
        "reg_dem_col": "REG_BLACK_DEM",
        "reg_rep_col": "REG_BLACK_REP",
    },
    "Hispanic": {
        "pop_col": "POP_HISPANIC",
        "reg_total_col": "REG_HISPANIC",
        "reg_dem_col": "REG_HISPANIC_DEM",
        "reg_rep_col": "REG_HISPANIC_REP",
    },
    "Asian": {
        "pop_col": "POP_ASIAN",
        "reg_total_col": "REG_ASIAN",
        "reg_dem_col": "REG_ASIAN_DEM",
        "reg_rep_col": "REG_ASIAN_REP",
    },
}

EFFECTIVENESS_THRESHOLD = 0.60

STEPS = 1000000
TARGET_PLANS = 100
POP_TOL = 0.08

OUTPUT_FILE = sys.argv[2]


# ============================================================
# LOAD GRAPH
# ============================================================
gdf = gpd.read_file(INPUT_FILE)
gdf["geometry"] = gdf["geometry"].buffer(0)

graph = Graph.from_geodataframe(gdf)


# ============================================================
# UPDATERS
# ============================================================
updaters = {
    "population": Tally(POP_COL, alias="population")
}


# ============================================================
# INITIAL PARTITION
# ============================================================
initial = Partition(
    graph,
    assignment=ASSIGN_COL,
    updaters=updaters
)


# ============================================================
# IDEAL POPULATION
# ============================================================
ideal_pop = sum(initial["population"].values()) / len(initial.parts)

pop_constraint = within_percent_of_ideal_population(initial, POP_TOL)


# ============================================================
# RECOM PROPOSAL
# ============================================================
proposal = partial(
    recom,
    pop_col=POP_COL,
    pop_target=ideal_pop,
    epsilon=POP_TOL,
    node_repeats=4
)


# ============================================================
# MARKOV CHAIN
# ============================================================
chain = MarkovChain(
    proposal=proposal,
    constraints=[pop_constraint],
    accept=lambda x: True,
    initial_state=initial,
    total_steps=STEPS
)


# ============================================================
# HELPERS
# ============================================================
def district_votes(partition):
    votes = defaultdict(lambda: {"DEM": 0, "REP": 0})

    for node in partition.graph.nodes:
        d = partition.assignment[node]
        attrs = partition.graph.nodes[node]

        votes[d]["DEM"] += attrs.get(DEM_COL, 0)
        votes[d]["REP"] += attrs.get(REP_COL, 0)

    return votes


def district_group_pop(partition, group_col):
    pop = defaultdict(lambda: {"group": 0, "total": 0})

    for node in partition.graph.nodes:
        d = partition.assignment[node]
        attrs = partition.graph.nodes[node]

        pop[d]["group"] += attrs.get(group_col, 0)
        pop[d]["total"] += attrs.get(POP_COL, 0)

    for d in pop:
        total = pop[d]["total"]
        pop[d]["share"] = pop[d]["group"] / total if total > 0 else 0

    return pop

def district_effectiveness_scores(partition, group_info):
    """
    Computes a 0 to 1 effectiveness score for each district.

    For one election, using DEM as the party of choice:

    score = sum(group_dem_support) / sum(group_total)

    Example for Black voters:

    score = sum(REG_BLACK_DEM) / sum(REG_BLACK)

    This gives a decimal like 0.82
    """
    reg_total_col = group_info["reg_total_col"]
    reg_dem_col = group_info["reg_dem_col"]

    district_totals = defaultdict(lambda: {
        "group_total": 0,
        "group_dem": 0,
        "dem_votes": 0,
        "rep_votes": 0
    })

    for node in partition.graph.nodes:
        d = partition.assignment[node]
        attrs = partition.graph.nodes[node]

        district_totals[d]["group_total"] += attrs.get(reg_total_col, 0)
        district_totals[d]["group_dem"] += attrs.get(reg_dem_col, 0)

        district_totals[d]["dem_votes"] += attrs.get(DEM_COL, 0)
        district_totals[d]["rep_votes"] += attrs.get(REP_COL, 0)

    # winner: 1 = DEM win, 0 = REP win
    scores_and_dist_winner = defaultdict(lambda: {"score": 0, "winner": 0})

    for d, vals in district_totals.items():
        group_total = vals["group_total"]
        group_dem = vals["group_dem"]
        dem_votes = vals["dem_votes"]
        rep_votes = vals["rep_votes"]

        if group_total == 0:
            scores_and_dist_winner[d]["score"] = 0
            scores_and_dist_winner[d]["winner"] = -1
        elif dem_votes > rep_votes:
            scores_and_dist_winner[d]["score"] = group_dem / group_total
            scores_and_dist_winner[d]["winner"] = 1
        else:
            scores_and_dist_winner[d]["score"] = group_dem / group_total
            scores_and_dist_winner[d]["winner"] = 0

    return scores_and_dist_winner

def effective_districts(partition, group_info, threshold=EFFECTIVENESS_THRESHOLD):
    scores_and_dist_winner = district_effectiveness_scores(partition, group_info)

    effective = []

    for d, vals in scores_and_dist_winner.items():
#        if vals["score"] >= threshold and vals["winner"] > 0:
        effective.append(d)

    return effective

def count_dem_seats(partition):
    votes = district_votes(partition)
    dem_seats = 0

    for d in votes:
        if votes[d]["DEM"] > votes[d]["REP"]:
            dem_seats += 1

    return dem_seats


# ============================================================
# BASELINE (INITIAL PLAN)
# ============================================================
baseline_counts = {}

for name, group_info in GROUPS.items():
    baseline_counts[name] = len(effective_districts(initial, group_info))

print(baseline_counts)


# ============================================================
# FAIRNESS CHECK
# ============================================================
def is_fair(partition):
    for name, group_info in GROUPS.items():
        eff = effective_districts(partition, group_info)
        eff_count = len(eff)

        if eff_count < baseline_counts[name]:
            return False


    return True

# ============================================================
# DATA COLLECTION (FOR PASSED PLANS ONLY)
# ============================================================

# 1. DEM/REP split per passed plan
passed_dem_seats = []

# 2. Effective district counts per group per passed plan
passed_effectiveness = {
    group: [] for group in GROUPS.keys()
}

# 3. Per-district minority % per plan
passed_district_shares = []

# 4. Store at most 5 interesting plans
interesting_plans = []
MAX_INTERESTING = 10

plans = []
# ============================================================
# RUN ENSEMBLE
# ============================================================

for step, partition in enumerate(chain):

    if is_fair(partition):
        # =========================
        # 1. BUILD PLAN (ASSIGNMENT)
        # =========================
        plan = {}
        for node in graph.nodes:
            geoid = graph.nodes[node]["ID"]
            district = partition.assignment[node]
            plan[geoid] = int(district)

        plans.append(plan)

        # =========================
        # 2. DEM / REP SPLIT
        # =========================
        dem_seats = count_dem_seats(partition)
        passed_dem_seats.append(dem_seats)

        # =========================
        # 3. EFFECTIVE DISTRICTS
        # =========================
        eff_counts = {}

        for group_name, group_info in GROUPS.items():
            eff = effective_districts(partition, group_info)
            count = len(eff)

            passed_effectiveness[group_name].append(count)
            eff_counts[group_name] = count

        # =========================
        # 4. PER-DISTRICT SHARES
        # =========================
        plan_shares = {}

        for group_name, group_info in GROUPS.items():
            pops = district_group_pop(partition, group_info["pop_col"])

            plan_shares[group_name] = {
                int(d): pops[d]["share"] for d in pops
            }

        passed_district_shares.append(plan_shares)

        # =========================
        # 5. EFFECTIVENESS SCORES
        # =========================
        plan_effectiveness_scores = {}

        for group_name, group_info in GROUPS.items():
            scores = district_effectiveness_scores(partition, group_info)

            plan_effectiveness_scores[group_name] = {
                int(d): (float(score["score"]) if score["winner"] > 0 else 0) for d, score in scores.items()
            }


        # =========================
        # 6. STORE "INTERESTING" PLANS
        # =========================
        # Requirements:
        # - extreme dem or rep seats
        # - high effectiveness

        total_districts = len(partition.parts)

        # how extreme is the split (distance from 50/50)
        extreme_score = abs(dem_seats - total_districts/2)

        # total effectiveness across groups
        total_effective = sum(eff_counts.values())

        candidate_plan = {
            "plan": plan,
            "dem_seats": dem_seats,
            "effectiveness": eff_counts,
            "shares": plan_shares,
            "effectiveness_scores": plan_effectiveness_scores,
            "extreme_score": extreme_score,
            "total_effective": total_effective
        }

        interesting_plans.append(candidate_plan)

        # keep only best ones
        interesting_plans.sort(
            key=lambda x: (x["extreme_score"], x["total_effective"]),
            reverse=True
        )

        interesting_plans = interesting_plans[:MAX_INTERESTING]

    if step % 100 == 0:
        print(f"Step {step}, collected {len(plans)} valid plans", flush=True)
    
    if len(plans) >= TARGET_PLANS:
        print("Reached target number of valid plans")
        break

# ============================================================
# Box and Whisker Data aggregation
# ============================================================
def box_stats(values):
    """
    Given a list of numbers, return the 5-number summary
    used for a box-and-whisker plot.

    min = lowest value
    q1 = 25th percentile
    median = 50th percentile
    q3 = 75th percentile
    max = highest value
    """

    if len(values) == 0:
        return {
            "min": None,
            "q1": None,
            "median": None,
            "q3": None,
            "max": None
        }

    values = np.array(values, dtype=float)

    return {
        "min": float(np.min(values)),
        "q1": float(np.percentile(values, 25)),
        "median": float(np.percentile(values, 50)),
        "q3": float(np.percentile(values, 75)),
        "max": float(np.max(values))
    }

def district_share_box_stats(passed_district_shares):
    """
    Builds box-and-whisker stats for each racial group.

    For each generated plan:
        1. Get each district's minority percentage.
        2. Sort those percentages from lowest to highest.
        3. Put them into buckets.

    Example:
        A plan has Black shares:
            District 1: 0.40
            District 2: 0.10
            District 3: 0.25

        Sorted:
            [0.10, 0.25, 0.40]

        Bucket 1 = 0.10
        Bucket 2 = 0.25
        Bucket 3 = 0.40

    Across many plans, each bucket gets its own box-and-whisker stats.
    """

    # group name -> bucket number -> list of percentages
    buckets = {
        group_name: defaultdict(list)
        for group_name in GROUPS.keys()
    }

    for plan_shares in passed_district_shares:
        for group_name in GROUPS.keys():

            # Example:
            # plan_shares["Black"] might be:
            # {1: 0.12, 2: 0.35, 3: 0.20, ...}
            district_share_dict = plan_shares[group_name]

            # Keep only the percentages and sort them from low to high
            sorted_shares = sorted(district_share_dict.values())

            # Put each sorted percentage into its bucket
            for i, share in enumerate(sorted_shares):
                bucket_number = i + 1
                buckets[group_name][bucket_number].append(share)

    # Convert raw bucket values into min, q1, median, q3, max
    box_data = {}

    for group_name, group_buckets in buckets.items():
        box_data[group_name] = {}

        for bucket_number, values in group_buckets.items():
            box_data[group_name][bucket_number] = box_stats(values)

    return box_data


def enacted_district_share_dots(enacted_partition):
    """
    Computes enacted-plan dots for the minority percentage chart.

    For each racial group:
        1. Calculate the minority percentage in each enacted district.
        2. Sort the districts from lowest percentage to highest percentage.
        3. Store each one as a dot for the matching bucket.

    This version also keeps the real district ID, which is useful for GUI tooltips.
    """

    enacted_dots = {}

    for group_name, group_info in GROUPS.items():

        # Reuse your existing helper function:
        # district_group_pop(partition, group_col)
        pops = district_group_pop(enacted_partition, group_info["pop_col"])

        district_values = []

        for d in pops:
            district_values.append({
                "district": int(d),
                "share": float(pops[d]["share"])
            })

        # Sort enacted districts by minority percentage
        district_values.sort(key=lambda x: x["share"])

        enacted_dots[group_name] = {}

        for i, item in enumerate(district_values):
            bucket_number = i + 1

            enacted_dots[group_name][bucket_number] = {
                "district": item["district"],
                "share": item["share"]
            }

    return enacted_dots

def render_minority_percentage_boxplot(district_share_boxes, enacted_dots, group_name):
    """
    Renders the minority percentage box-and-whisker chart for one racial group.

    Box plots = ensemble distribution
    Dots = enacted plan districts
    """

    boxes = district_share_boxes[group_name]
    dots = enacted_dots[group_name]

    boxplot_stats = []
    positions = []

    for bucket in sorted(boxes.keys()):
        stats = boxes[bucket]

        boxplot_stats.append({
            "label": str(bucket),
            "whislo": stats["min"],
            "q1": stats["q1"],
            "med": stats["median"],
            "q3": stats["q3"],
            "whishi": stats["max"],
            "fliers": []
        })

        positions.append(bucket)

    fig, ax = plt.subplots(figsize=(12, 6))

    ax.bxp(
        boxplot_stats,
        positions=positions,
        showfliers=False
    )

    x_values = []
    y_values = []
    labels = []

    for bucket in sorted(dots.keys()):
        item = dots[bucket]

        x_values.append(bucket)
        y_values.append(item["share"])
        labels.append(f"District {item['district']}: {item['share']:.2%}")

    scatter = ax.scatter(
        x_values,
        y_values,
        marker="o",
        label="Enacted Plan"
    )

    tooltip = mpld3.plugins.PointLabelTooltip(scatter, labels=labels)
    mpld3.plugins.connect(fig, tooltip)

    ax.set_title(f"{group_name} Population Percentage by Ordered District Bucket")
    ax.set_xlabel("Ordered District Bucket")
    ax.set_ylabel(f"{group_name} Population Share")
    ax.legend()
    ax.grid(True, axis="y", alpha=0.3)

    ax.yaxis.set_major_formatter(
        plt.FuncFormatter(lambda y, _: f"{y:.0%}")
    )


    fig.tight_layout()

    mpld3.save_html(fig, f"{sys.argv[2]}-{group_name}-Box.html")
    mpld3.save_json(fig, f"{sys.argv[2]}-{group_name}-Box.json")
    plt.savefig(f"{sys.argv[2]}-{group_name}-Box.png", dpi=200)

    plt.close(fig)

district_share_boxes = district_share_box_stats(passed_district_shares)
# print(district_share_boxes)
enacted_dots = enacted_district_share_dots(initial)

for group_name in GROUPS.keys():
    render_minority_percentage_boxplot(
        district_share_boxes=district_share_boxes,
        enacted_dots=enacted_dots,
        group_name=group_name
    )

# ============================================================
# Save Histogram
# ============================================================

print(passed_dem_seats)
fig, ax = plt.subplots(figsize=(12, 6))

bins = np.arange(min(passed_dem_seats), max(passed_dem_seats) + 2) - 0.5
ax.hist(passed_dem_seats, bins=bins)
# arguments are passed to np.histogram
ax.set_title('Democratic/Republican Splits')
ax.set_xlabel('Democratic Seats')
gen_ticks = []
counter = 0
while counter <= int(sys.argv[3]):
    gen_ticks.append(f"{counter}/{int(sys.argv[3])-counter}")
    counter = counter + 1
ax.set_xticks(range(int(sys.argv[3]) + 1), gen_ticks)

mpld3.save_html(fig, f"{sys.argv[2]}-Splits.html")
mpld3.save_json(fig, f"{sys.argv[2]}-Splits.json")
plt.savefig(f"{sys.argv[2]}-Splits.png", dpi=200)
plt.close(fig)

# ============================================================
# SAVE OUTPUT
# ============================================================

output = {
    #"plans": plans,
    "dem_seats": passed_dem_seats,
    "effectiveness": passed_effectiveness,
    "district_shares": passed_district_shares,
    "interesting_plans": interesting_plans,
    "minority_percentage_boxplot": {
        "boxes": district_share_boxes,
        "dots": enacted_dots
    }
}

with open(OUTPUT_FILE, "w") as f:
    json.dump(output, f)

print(f"Saved {len(plans)} valid plans")
