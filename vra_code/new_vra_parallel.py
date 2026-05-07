import json
import multiprocessing as mp
import random
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

POP_COL = "TOTAL"
ASSIGN_COL = "DISTRICT"

DEM_COL = "DEMOCRATIC"
REP_COL = "REPUBLICAN"

# White Population is required as it is needed to print in box and whisker comparison
GROUPS = {
    "Black": {
        "pop_col": "BLACK",
        "reg_total_col": "BLACK_REG",
        "reg_dem_col": "BLACK_DEM",
        "reg_rep_col": "BLACK_REP",
    },
    "Hispanic": {
        "pop_col": "HISPANIC",
        "reg_total_col": "HISPANIC_REG",
        "reg_dem_col": "HISPANIC_DEM",
        "reg_rep_col": "HISPANIC_REP",
    },
    "Asian": {
        "pop_col": "ASIAN",
        "reg_total_col": "ASIAN_REG",
        "reg_dem_col": "ASIAN_DEM",
        "reg_rep_col": "ASIAN_REP",
    },
    "White": {
        "pop_col": "WHITE",
        "reg_total_col": "WHITE_REG",
        "reg_dem_col": "WHITE_DEM",
        "reg_rep_col": "WHITE_REP",
    },
}

EFFECTIVENESS_THRESHOLD = float(sys.argv[5]) if len(sys.argv) > 5 else 0

STEPS = 1000000
TARGET_PLANS = int(sys.argv[4]) if len(sys.argv) > 4 else 0
POP_TOL = 0.08

OUTPUT_FILE = sys.argv[2]
NUM_DISTRICTS = int(sys.argv[3]) if len(sys.argv) > 3 else 0

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
    reg_total_col = group_info["reg_total_col"]
    reg_dem_col = group_info["reg_dem_col"]
    district_totals = defaultdict(lambda: {"group_total": 0, "group_dem": 0, "dem_votes": 0, "rep_votes": 0})
    for node in partition.graph.nodes:
        d = partition.assignment[node]
        attrs = partition.graph.nodes[node]
        district_totals[d]["group_total"] += attrs.get(reg_total_col, 0)
        district_totals[d]["group_dem"] += attrs.get(reg_dem_col, 0)
        district_totals[d]["dem_votes"] += attrs.get(DEM_COL, 0)
        district_totals[d]["rep_votes"] += attrs.get(REP_COL, 0)
    scores_and_dist_winner = defaultdict(lambda: {"score": 0, "winner": 0})
    for d, vals in district_totals.items():
        if vals["group_total"] == 0:
            scores_and_dist_winner[d]["score"] = 0
            scores_and_dist_winner[d]["winner"] = -1
        else:
            scores_and_dist_winner[d]["score"] = vals["group_dem"] / vals["group_total"]
            scores_and_dist_winner[d]["winner"] = 1 if vals["dem_votes"] > vals["rep_votes"] else 0
    return scores_and_dist_winner

def effective_districts(partition, group_info, threshold=EFFECTIVENESS_THRESHOLD):
    scores = district_effectiveness_scores(partition, group_info)
    return [d for d, v in scores.items() if v["score"] >= threshold and v["winner"] > 0]

def majority_districts(partition, group_col):
    pop = district_group_pop(partition, group_col)
    return [d for d, v in pop.items() if v["share"] >= 0.5]

def count_dem_seats(partition):
    votes = district_votes(partition)
    return sum(1 for d in votes if votes[d]["DEM"] > votes[d]["REP"])

def is_fair(partition, baseline_counts):
    for name, group_info in GROUPS.items():
        if len(effective_districts(partition, group_info)) < baseline_counts[name]:
            return False
    return True

# ============================================================
# WORKER FUNCTION
# ============================================================

def run_chain_worker(is_vra, target_to_collect, steps, graph_data, initial_assignment, updaters, ideal_pop, pop_tol, baseline_counts, seed):
    random.seed(seed)
    np.random.seed(seed)
    
    # Re-initialize partition in worker
    partition = Partition(graph_data, assignment=initial_assignment, updaters=updaters)
    pop_constraint = within_percent_of_ideal_population(partition, pop_tol)
    proposal = partial(recom, pop_col=POP_COL, pop_target=ideal_pop, epsilon=pop_tol, node_repeats=4)
    
    chain = MarkovChain(
        proposal=proposal,
        constraints=[pop_constraint],
        accept=lambda x: True,
        initial_state=partition,
        total_steps=steps
    )
    
    local_plans = []
    local_dem_seats = []
    local_effectiveness = {group: [] for group in GROUPS.keys()}
    local_majority = {group: [] for group in GROUPS.keys()}
    local_district_shares = []
    local_interesting_plans = []
    MAX_INTERESTING = 10

    for step, part in enumerate(chain):
        if not is_vra or is_fair(part, baseline_counts):
            # 1. Plan Assignment
            plan = {graph_data.nodes[n]["ID"]: int(part.assignment[n]) for n in graph_data.nodes}
            local_plans.append(plan)

            # 2. Seats
            dem_seats = count_dem_seats(part)
            local_dem_seats.append(dem_seats)

            # 3. Effectiveness
            eff_counts = {}
            for group_name, group_info in GROUPS.items():
                count = len(effective_districts(part, group_info))
                local_effectiveness[group_name].append(count)
                eff_counts[group_name] = count

            # 3.1. Minority-Majority
            majority_counts = {}
            for group_name, group_info in GROUPS.items():
                count = len(majority_districts(part, group_info["pop_col"]))
                local_majority[group_name].append(count)
                majority_counts[group_name] = count

            # 4. Shares
            plan_shares = {}
            for group_name, group_info in GROUPS.items():
                pops = district_group_pop(part, group_info["pop_col"])
                plan_shares[group_name] = {int(d): pops[d]["share"] for d in pops}
            local_district_shares.append(plan_shares)

            # 5. Interesting Plans logic
            total_districts = len(part.parts)
            extreme_score = abs(dem_seats - total_districts/2)
            total_effective = sum(eff_counts.values())
            total_majority = sum(majority_counts.values())
            
            # Scores for tooltips
            scores_map = {}
            for g_name, g_info in GROUPS.items():
                s = district_effectiveness_scores(part, g_info)
                scores_map[g_name] = {int(d): (float(v["score"]) if v["winner"] > 0 else 0) for d, v in s.items()}

            local_interesting_plans.append({
                "plan": plan, "dem_seats": dem_seats, "effectiveness": eff_counts,
                "shares": plan_shares, "effectiveness_scores": scores_map,
                "extreme_score": extreme_score, "total_effective": total_effective
            })
            local_interesting_plans.sort(key=lambda x: (x["extreme_score"], x["total_effective"]), reverse=True)
            local_interesting_plans = local_interesting_plans[:MAX_INTERESTING]

            if len(local_plans) >= target_to_collect:
                break
    
    return {
        "plans": local_plans,
        "dem_seats": local_dem_seats,
        "effectiveness": local_effectiveness,
        "majority": local_majority,
        "district_shares": local_district_shares,
        "interesting_plans": local_interesting_plans
    }

# ============================================================
# PLOTTING FUNCTIONS
# ============================================================

def box_stats(values):
    if len(values) == 0:
        return {"min": None, "q1": None, "median": None, "q3": None, "max": None}
    values = np.array(values, dtype=float)
    return {
        "min": float(np.min(values)), "q1": float(np.percentile(values, 25)),
        "median": float(np.percentile(values, 50)), "q3": float(np.percentile(values, 75)),
        "max": float(np.max(values))
    }

def district_share_box_stats(all_shares):
    buckets = {group_name: defaultdict(list) for group_name in GROUPS.keys()}
    for plan_shares in all_shares:
        for group_name in GROUPS.keys():
            sorted_shares = sorted(plan_shares[group_name].values())
            for i, share in enumerate(sorted_shares):
                buckets[group_name][i+1].append(share)
    box_data = {}
    for group_name, group_buckets in buckets.items():
        box_data[group_name] = {num: box_stats(vals) for num, vals in group_buckets.items()}
    return box_data

def enacted_district_share_dots(enacted_partition):
    enacted_dots = {}
    for group_name, group_info in GROUPS.items():
        pops = district_group_pop(enacted_partition, group_info["pop_col"])
        district_values = sorted([{"district": int(d), "share": float(pops[d]["share"])} for d in pops], key=lambda x: x["share"])
        enacted_dots[group_name] = {i+1: item for i, item in enumerate(district_values)}
    return enacted_dots

def render_minority_percentage_boxplot(district_share_boxes, enacted_dots, group_name, suffix):
    boxes = district_share_boxes[group_name]
    dots = enacted_dots[group_name]
    boxplot_stats = []
    positions = []
    for bucket in sorted(boxes.keys()):
        stats = boxes[bucket]
        boxplot_stats.append({"label": str(bucket), "whislo": stats["min"], "q1": stats["q1"], "med": stats["median"], "q3": stats["q3"], "whishi": stats["max"], "fliers": []})
        positions.append(bucket)
    fig, ax = plt.subplots(figsize=(5.46, 7.2))
    ax.bxp(boxplot_stats, positions=positions, showfliers=False)
    x_vals, y_vals, labels = [], [], []
    for bucket in sorted(dots.keys()):
        item = dots[bucket]
        x_vals.append(bucket); y_vals.append(item["share"]); labels.append(f"District {item['district']}: {item['share']:.2%}")
    scatter = ax.scatter(x_vals, y_vals, marker="o", label="Enacted Plan", color="lightyellow", edgecolor="black")
    mpld3.plugins.connect(fig, mpld3.plugins.PointLabelTooltip(scatter, labels=labels))
    ax.set_title(f"{group_name} Population Percentage by Ordered District Bucket")
    ax.set_xlabel("District Bucket")
    ax.set_ylabel(f"{group_name} Population Share")
    ax.legend(); ax.grid(True, axis="y", alpha=0.3)
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f"{y:.0%}"))
    fig.tight_layout()
    mpld3.save_html(fig, f"{OUTPUT_FILE}-{group_name}-{suffix}-Box.html")
    mpld3.save_json(fig, f"{OUTPUT_FILE}-{group_name}-{suffix}-Box.json")
    plt.savefig(f"{OUTPUT_FILE}-{group_name}-{suffix}-Box.png", dpi=200)
    plt.close(fig)

def render_minority_effectiveness_boxplot(group_name, vra_eff, nonvra_eff, baseline_counts):
    fig, ax = plt.subplots(figsize=(5.46, 7.2))
    ax.boxplot([vra_eff[group_name], nonvra_eff[group_name]], label=["VRA-Constrained", "Race-Blind"], positions=[1, 1.4], widths=0.3, showfliers=False)
    ax.boxplot([vra_eff["White"], nonvra_eff["White"]], positions=[2.6, 3], widths=0.3, showfliers=False)
    scatter = ax.scatter([1.2, 2.8], [baseline_counts[group_name], baseline_counts["White"]], marker="o", label="Enacted Plan", color="lightyellow", edgecolor="black")
    mpld3.plugins.connect(fig, mpld3.plugins.PointLabelTooltip(scatter, labels=labels))
    ax.set_title(f"{group_name} Effectiveness Distribution")
    ax.set_xticks([1.2, 2.8], [f"{group_name} Voters", "White Voters"])
    ax.legend(); ax.grid(True, axis="y", alpha=0.3)
    ax.set_ylim(bottom=0)
    ax.yaxis.get_major_locator().set_params(integer=True)
    fig.tight_layout()
    mpld3.save_html(fig, f"{OUTPUT_FILE}-{group_name}-Compare-Box.html")
    mpld3.save_json(fig, f"{OUTPUT_FILE}-{group_name}-Compare-Box.json")
    plt.savefig(f"{OUTPUT_FILE}-{group_name}-Compare-Box.png", dpi=200)
    plt.close(fig)

def render_minority_effectiveness_histogram(group_name, vra_eff, nonvra_eff):
    fig, ax = plt.subplots(figsize=(5.46, 7.2))
    all_vals = vra_eff[group_name] + nonvra_eff[group_name]
    bins = np.arange(min(all_vals), max(all_vals) + 2) - 0.5
    hist_vra = ax.hist(vra_eff[group_name], label="VRA-Constrained", alpha=0.5, bins=bins)
    mpld3.plugins.connect(fig, mpld3.plugins.PointLabelTooltip(hist_vra, labels=labels))
    hist_nonvra = ax.hist(nonvra_eff[group_name], label="Race-Blind", alpha=0.5, bins=bins)
    mpld3.plugins.connect(fig, mpld3.plugins.PointLabelTooltip(hist_nonvra, labels=labels))
    ax.set_title(f"{group_name} Effectiveness Histogram")
    ax.set_xlabel("Number of Districts")
    ax.set_xticks(range(NUM_DISTRICTS + 1), [f"{c}" for c in range(NUM_DISTRICTS + 1)])
    ax.legend(); fig.tight_layout();
    mpld3.save_html(fig, f"{OUTPUT_FILE}-{group_name}-Compare-Histogram.html")
    mpld3.save_json(fig, f"{OUTPUT_FILE}-{group_name}-Compare-Histogram.json")
    plt.savefig(f"{OUTPUT_FILE}-{group_name}-Compare-Histogram.png", dpi=200)
    plt.close(fig)

def render_minority_effectiveness_majority_histogram(group_name, vra_eff, vra_majority, suffix):
    fig, ax = plt.subplots(figsize=(5.46, 7.2))
    all_vals = vra_eff[group_name] + vra_majority[group_name]
    bins = np.arange(min(all_vals), max(all_vals) + 2) - 0.5
    hist_eff = ax.hist(vra_eff[group_name], label=f"{group_name} Effective", alpha=0.5, bins=bins)
    mpld3.plugins.connect(fig, mpld3.plugins.PointLabelTooltip(hist_eff, labels=labels))
    hist_maj = ax.hist(vra_majority[group_name], label=f"{group_name} Majority", alpha=0.5, bins=bins)
    mpld3.plugins.connect(fig, mpld3.plugins.PointLabelTooltip(hist_maj, labels=labels))
    ax.set_title(f"{group_name} Effectiveness vs Majority Histogram")
    ax.set_xlabel("Number of Districts")
    ax.set_xticks(range(NUM_DISTRICTS + 1), [f"{c}" for c in range(NUM_DISTRICTS + 1)])
    ax.legend(); fig.tight_layout();
    mpld3.save_html(fig, f"{OUTPUT_FILE}-{group_name}-{suffix}-Majority-Histogram.html")
    mpld3.save_json(fig, f"{OUTPUT_FILE}-{group_name}-{suffix}-Majority-Histogram.json")
    plt.savefig(f"{OUTPUT_FILE}-{group_name}-{suffix}-Majority-Histogram.png", dpi=200)
    plt.close(fig)
    
def render_ensemble_charts_histogram(dem_seats, suffix):
    fig, ax = plt.subplots(figsize=(5.46, 7.2))

    bins = np.arange(min(dem_seats), max(dem_seats) + 2) - 0.5
    hist = ax.hist(dem_seats, bins=bins, color="lightyellow", edgecolor="black")
    mpld3.plugins.connect(fig, mpld3.plugins.PointLabelTooltip(hist, labels=labels))
    # arguments are passed to np.histogram
    ax.set_title('Democratic/Republican Splits')
    #ax.set_xlabel('Democratic/Republican Splits')
    gen_ticks = []
    counter = 0
    while counter <= NUM_DISTRICTS:
        gen_ticks.append(f"{counter}/{NUM_DISTRICTS-counter}")
        counter = counter + 1
    ax.set_xticks(range(NUM_DISTRICTS + 1), gen_ticks)
    mpld3.save_html(fig, f"{OUTPUT_FILE}-{suffix}-Splits.html")
    mpld3.save_json(fig, f"{OUTPUT_FILE}-{suffix}-Splits.json")
    plt.savefig(f"{OUTPUT_FILE}-{suffix}-Splits.png", dpi=200)
    plt.close(fig)

def render_ensemble_threshold(group_name, vra_eff, nonvra_eff, baseline_counts, pop_group, pop_total):
    vra_count_baseline = 0
    nonvra_count_baseline = 0
    vra_count_proportionality = 0
    nonvra_count_proportionality = 0
    vra_count_both = 0
    nonvra_count_both = 0
    print(pop_group)
    print(POP_COL)
    for d in vra_eff[group_name]:
        if d > baseline_counts:
            vra_count_baseline = vra_count_baseline + 1
        if d > int(pop_group / pop_total * NUM_DISTRICTS):
            vra_count_proportionality = vra_count_proportionality + 1
        if d > baseline_counts and d > int(pop_group / pop_total * NUM_DISTRICTS):
            vra_count_both = vra_count_both + 1
    for d in nonvra_eff[group_name]:
        if d > baseline_counts:
            nonvra_count_baseline = nonvra_count_baseline + 1
        if d > int(pop_group / pop_total * NUM_DISTRICTS):
            nonvra_count_proportionality = nonvra_count_proportionality + 1
        if d > baseline_counts and d > int(pop_group / pop_total * NUM_DISTRICTS):
            nonvra_count_both = nonvra_count_both + 1
    return [vra_count_baseline, vra_count_proportionality, vra_count_both,
            nonvra_count_baseline, nonvra_count_proportionality, nonvra_count_both]
    
def save_interesting_plans_as_geojsons(base_gdf, interesting_plans, ensemble_type):
    threshold_name = str(EFFECTIVENESS_THRESHOLD).replace(".", "p")

    for rank, interesting_plan in enumerate(interesting_plans, start=1):
        # Make a copy so the original gdf is not changed
        plan_gdf = base_gdf.copy()

        # The stored plan is:
        # ID -> district number
        plan_assignment = interesting_plan["plan"]

        # Convert keys to strings to avoid int/string mismatch issues
        plan_assignment_lookup = {
            str(precinct_id): district
            for precinct_id, district in plan_assignment.items()
        }

        # Preserves the original enacted district
        plan_gdf["ORIGINAL_DISTRICT"] = plan_gdf["DISTRICT"]

        # Replace DISTRICT with the generated plan's district assignment
        plan_gdf["DISTRICT"] = (
            plan_gdf["ID"]
            .astype(str)
            .map(plan_assignment_lookup)
        )

        # Save useful metadata columns for debugging/comparison
        plan_gdf["INTERESTING_RANK"] = rank
        plan_gdf["ENSEMBLE_TYPE"] = ensemble_type
        plan_gdf["DEM_SEATS"] = interesting_plan["dem_seats"]
        plan_gdf["EXTREME_SCORE"] = interesting_plan["extreme_score"]
        plan_gdf["TOTAL_EFFECTIVE"] = interesting_plan["total_effective"]

        # File name uses the sys.argv-based values
        geojson_name = (
            f"{OUTPUT_FILE}"
            f"-{ensemble_type}"
            f"-districts{NUM_DISTRICTS}"
            f"-target{TARGET_PLANS}"
            f"-threshold{threshold_name}"
            f"-interesting{rank}"
            f"-dem{interesting_plan['dem_seats']}"
            f"-eff{interesting_plan['total_effective']}"
            f"-GeoJSON.json"
        )

        plan_gdf.to_file(geojson_name, driver="GeoJSON")

        print(f"Saved interesting plan GeoJSON: {geojson_name}")


# ============================================================
# MAIN EXECUTION
# ============================================================

if __name__ == "__main__":
    # Load data once
    gdf = gpd.read_file(INPUT_FILE)
    gdf["geometry"] = gdf["geometry"].buffer(0)
    graph = Graph.from_geodataframe(gdf)
    updaters = {"population": Tally(POP_COL, alias="population")}
    initial = Partition(graph, assignment=ASSIGN_COL, updaters=updaters)
    ideal_pop = sum(initial["population"].values()) / len(initial.parts)
    
    # Baseline
    baseline_counts = {name: len(effective_districts(initial, info)) for name, info in GROUPS.items()}
    print(f"Baseline counts: {baseline_counts}")

    # Baseline total population (used for proportionality calculation)
    population = {}
    population["Total"] = gdf[POP_COL].sum()
    for group_name, group_info in GROUPS.items():
        population[group_name] = gdf[group_info["pop_col"]].sum()

    num_procs = mp.cpu_count()
    plans_per_proc = [TARGET_PLANS // num_procs] * num_procs
    for i in range(TARGET_PLANS % num_procs):
        plans_per_proc[i] += 1

    def run_parallel_ensemble(is_vra):
        print(f"Starting {'VRA' if is_vra else 'Non-VRA'} ensemble with {num_procs} processes...")
        with mp.Pool(processes=num_procs) as pool:
            results = pool.starmap(run_chain_worker, [
                (is_vra, plans_per_proc[i], STEPS, graph, ASSIGN_COL, updaters, ideal_pop, POP_TOL, baseline_counts, random.randint(0, 1000000))
                for i in range(num_procs)
            ])
        
        # Aggregate
        agg = {"plans": [], "dem_seats": [], "effectiveness": {g: [] for g in GROUPS.keys()}, "majority": {g: [] for g in GROUPS.keys()}, "district_shares": [], "interesting_plans": []}
        for r in results:
            agg["plans"].extend(r["plans"])
            agg["dem_seats"].extend(r["dem_seats"])
            agg["district_shares"].extend(r["district_shares"])
            agg["interesting_plans"].extend(r["interesting_plans"])
            for g in GROUPS.keys():
                agg["effectiveness"][g].extend(r["effectiveness"][g])
                agg["majority"][g].extend(r["majority"][g])
        
        agg["interesting_plans"].sort(key=lambda x: (x["extreme_score"], x["total_effective"]), reverse=True)
        agg["interesting_plans"] = agg["interesting_plans"][:10]
        return agg

    vra_res = run_parallel_ensemble(True)
    nonvra_res = run_parallel_ensemble(False)

    # Stats and Plotting
    vra_boxes = district_share_box_stats(vra_res["district_shares"])
    nonvra_boxes = district_share_box_stats(nonvra_res["district_shares"])
    enacted_dots = enacted_district_share_dots(initial)
    
    threshold = {}

    for group_name in GROUPS.keys():
        # We do not need White files, so skip this
        # White data are still needed for comparison box and whisker chart
        if group_name == 'White':
            continue
        render_minority_percentage_boxplot(vra_boxes, enacted_dots, group_name, "VRA")
        render_minority_percentage_boxplot(nonvra_boxes, enacted_dots, group_name, "NonVRA")
        render_minority_effectiveness_boxplot(group_name, vra_res["effectiveness"], nonvra_res["effectiveness"], baseline_counts)
        render_minority_effectiveness_histogram(group_name, vra_res["effectiveness"], nonvra_res["effectiveness"])
        render_minority_effectiveness_majority_histogram(group_name, vra_res["effectiveness"], vra_res["majority"], "VRA")
        render_minority_effectiveness_majority_histogram(group_name, nonvra_res["effectiveness"], nonvra_res["majority"], "NonVRA")
        threshold[group_name] = render_ensemble_threshold(group_name, vra_res["effectiveness"], nonvra_res["effectiveness"], baseline_counts[group_name], population[group_name], population["Total"])
    render_ensemble_charts_histogram(vra_res["dem_seats"], "VRA")
    render_ensemble_charts_histogram(nonvra_res["dem_seats"], "NonVRA")
    with open(f"{OUTPUT_FILE}-Compare-Threshold.json", "w") as f:
        json.dump(threshold, f)

    # Final Save
    with open(f"{OUTPUT_FILE}-VRA.json", "w") as f:
        json.dump({k: vra_res[k] for k in ["dem_seats", "effectiveness", "majority", "district_shares", "interesting_plans"]}, f)
    with open(f"{OUTPUT_FILE}-NonVRA.json", "w") as f:
        json.dump({k: nonvra_res[k] for k in ["dem_seats", "effectiveness", "majority", "district_shares", "interesting_plans"]}, f)

    # ---------------------------------
    # Converts the interesting plans into geojsons, using the generated plan's assignment
    # ---------------------------------
    save_interesting_plans_as_geojsons(
        base_gdf=gdf,
        interesting_plans=vra_res["interesting_plans"],
        ensemble_type="VRA"
    )

    save_interesting_plans_as_geojsons(
        base_gdf=gdf,
        interesting_plans=nonvra_res["interesting_plans"],
        ensemble_type="NonVRA"
    )
    # ---------------------------------
    # ---------------------------------

    print(f"Successfully collected {len(vra_res['plans'])} VRA and {len(nonvra_res['plans'])} Non-VRA plans.")
