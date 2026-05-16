import numpy as np
import pymc as pm
import math
from pyei.two_by_two import TwoByTwoEI
from pyei.r_by_c import RowByColumnEI
from pyei.goodmans_er import GoodmansER
from pyei.goodmans_er import GoodmansERBayes
from pyei.data import Datasets
from pyei.plot_utils import tomography_plot, plot_kdes as pyei_plot_kdes
from pyei.io_utils import from_netcdf, to_netcdf
import matplotlib.pyplot as plt
import matplotlib as mpl
import mpld3;
import pandas as pd;
import sys;
import json;
from scipy.stats import gaussian_kde;

# Fix DPI and precise 680x330 (for display in site)
fig, ax = plt.subplots(figsize=(6.8, 3.3))
# Increase bottom margin (e.g., to 0.2 or 0.3)
fig.subplots_adjust(bottom=0.2)
data = pd.read_csv(sys.argv[1])

# Remove rows with Total Population of 0 to avoid issues in EI calculations
data = data[data["TOTAL_REG"] > 0]

# Precinct Total and Names are used in both 2x2 and RowByColumn EI
precinct_total = np.array(data["TOTAL_REG"])
precinct_names = data['ID']

# Set up RowByColumn Inputs
demographic_group_names_rbyc = ["Black", "Hispanic", "Asian", "White", "Other"]
group_fractions_rbyc = np.array([data["BLACK_PER"], data["HISPANIC_PER"], data["ASIAN_PER"], data["WHITE_PER"], data["OTHER_PER"]])
votes_fractions_rbyc = np.array([data["TOTAL_DEM_PER"], data["TOTAL_REP_PER"]])
candidate_names_rbyc = ["Harris", "Trump"]
# data.head()



# Create a TwobyTwoEI object - As the EI for White is the complement for other groups, we need to run a 2by2 rather than RowbyColumn for White
# This allows to compare White vs. All Minority
# If we kept White in RowbyColumn, it would be compared against itself, which is not what we want
# On the other hand, the other groups use RowbyColumn to compare each group vs. White
ei_2by2_dem = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=8, pareto_shape=2)
ei_2by2_rep = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=8, pareto_shape=2)
ei_2by2_dem.fit(np.array(data["WHITE_PER"]), np.array(data["TOTAL_DEM_PER"]), precinct_total, demographic_group_name="White", candidate_name="Harris", precinct_names=precinct_names)
ei_2by2_rep.fit(np.array(data["WHITE_PER"]), np.array(data["TOTAL_REP_PER"]), precinct_total, demographic_group_name="White", candidate_name="Trump", precinct_names=precinct_names)
ei_rbyc = RowByColumnEI(model_name="multinomial-dirichlet-modified", pareto_shape=100, pareto_scale=100)
ei_rbyc.fit(group_fractions_rbyc, votes_fractions_rbyc, precinct_total, demographic_group_names=demographic_group_names_rbyc, candidate_names=candidate_names_rbyc, precinct_names=precinct_names)
for candidate_name in candidate_names_rbyc:
    for demographic_group in demographic_group_names_rbyc:
        group_idx = demographic_group_names_rbyc.index(demographic_group)
        cand_idx = candidate_names_rbyc.index(candidate_name)

        with open(f"{sys.argv[2]}-{demographic_group}-{candidate_name}.txt", "w") as f:
            posterior_mean_voting_prefs = ei_rbyc.posterior_mean_voting_prefs
            precinct_posterior_means, precinct_credible_intervals = ei_rbyc.precinct_level_estimates()
            
            # Use specific group/candidate names and correct indexing
            mean_support = posterior_mean_voting_prefs[group_idx, cand_idx]
            f.write(f"{demographic_group} support for {candidate_name}: {mean_support}\n")
            
            # Use f-string and avoid list concatenation error
            confidence_score = 1 / (1 + math.exp(18 - 26 * mean_support))
            f.write(f"Confidence Score for {demographic_group}: {confidence_score}\n")
            
            for index, item in enumerate(precinct_posterior_means):
                # Correct indexing for precinct-level results
                precinct_support = precinct_posterior_means[index][group_idx][cand_idx]
                f.write(f"Estimated (posterior mean) support for the candidate from the group in precinct {index}: {precinct_support}\n")

        # Calculate Overlap in the KDE plot
        if demographic_group == "White":
            ei_2by2 = ei_2by2_dem if candidate_name == "Harris" else ei_2by2_rep
            samples_group = ei_2by2.sampled_voting_prefs[0]
            samples_complement = ei_2by2.sampled_voting_prefs[1]
        else:
            white_idx = demographic_group_names_rbyc.index("White")
            samples_group = ei_rbyc.sampled_voting_prefs[:, group_idx, cand_idx]
            samples_complement = ei_rbyc.sampled_voting_prefs[:, white_idx, cand_idx]
        
        kde_group = gaussian_kde(samples_group)
        kde_complement = gaussian_kde(samples_complement)
        x = np.linspace(0, 1, 1000)
        overlap = np.trapezoid(np.minimum(kde_group(x), kde_complement(x)), x)

        with open(f"{sys.argv[2]}-{demographic_group}-{candidate_name}.txt", "a") as f:
            f.write(f"Overlap in KDE distributions: {overlap}\n")

        with open(f"{sys.argv[2]}-{demographic_group}-{candidate_name}-Overlap.json", "w") as f:
            json.dump({"overlap": overlap}, f)

        # As the EI for White is used as the complement for all other groups, we skip plotting it against itself
        if(demographic_group != "White"):
            white_idx = demographic_group_names_rbyc.index("White")
            # subset samples to include only the current group and the White group for the current candidate
            subset_samples = ei_rbyc.sampled_voting_prefs[:, [group_idx, white_idx], cand_idx : cand_idx + 1]
            ax = pyei_plot_kdes(subset_samples, [demographic_group, "White"], [candidate_name])
            fig = ax.figure
            fig.set_size_inches(6.8,3.3)
            mpld3.save_json(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-EI.json")
            mpld3.save_html(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-EI.html")
            plt.savefig(f"{sys.argv[2]}-{demographic_group}-{candidate_name}-EI.png", dpi=200)

            fig = ei_rbyc.plot_polarization_kde(candidate=candidate_name, groups=[demographic_group, "White"], percentile=95, show_threshold=False).figure
            fig.set_size_inches(6.8,3.3)
            mpld3.save_html(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-KDE.html")
            mpld3.save_json(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-KDE.json")
            plt.savefig(f"{sys.argv[2]}-{demographic_group}-{candidate_name}-KDE.png", dpi=200)
        else:
            if(candidate_name == "Harris"):
                fig = ei_2by2_dem.plot_kde().figure
                fig.set_size_inches(6.8,3.3)
                mpld3.save_json(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-EI.json")
                mpld3.save_html(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-EI.html")
                plt.savefig(f"{sys.argv[2]}-{demographic_group}-{candidate_name}-EI.png", dpi=200)
                
                fig = ei_2by2_dem.plot_polarization_kde(percentile=95, show_threshold=False).figure
                fig.set_size_inches(6.8,3.3)
                mpld3.save_html(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-KDE.html")
                mpld3.save_json(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-KDE.json")
                plt.savefig(f"{sys.argv[2]}-{demographic_group}-{candidate_name}-KDE.png", dpi=200)
            else:
                fig = ei_2by2_rep.plot_kde().figure
                fig.set_size_inches(6.8,3.3)
                mpld3.save_json(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-EI.json")
                mpld3.save_html(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-EI.html")
                plt.savefig(f"{sys.argv[2]}-{demographic_group}-{candidate_name}-EI.png", dpi=200)

                fig = ei_2by2_rep.plot_polarization_kde(percentile=95, show_threshold=False).figure
                fig.set_size_inches(6.8,3.3)
                mpld3.save_html(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-KDE.html")
                mpld3.save_json(fig, f"{sys.argv[2]}-{demographic_group}-{candidate_name}-KDE.json")
                plt.savefig(f"{sys.argv[2]}-{demographic_group}-{candidate_name}-KDE.png", dpi=200)