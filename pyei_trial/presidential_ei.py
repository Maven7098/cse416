import numpy as np
import pymc as pm
import math
from pyei.two_by_two import TwoByTwoEI
from pyei.goodmans_er import GoodmansER
from pyei.goodmans_er import GoodmansERBayes
from pyei.data import Datasets
from pyei.plot_utils import tomography_plot
from pyei.io_utils import from_netcdf, to_netcdf
import matplotlib.pyplot as plt
import matplotlib as mpl
import mpld3;
import pandas as pd;
import sys;

# Fix DPI and precise 680x330 (for display in site)
fig, ax = plt.subplots(figsize=(6.8, 3.3))
# Increase bottom margin (e.g., to 0.2 or 0.3)
fig.subplots_adjust(bottom=0.2)
data = pd.read_csv(sys.argv[1])

# Percent of *selected race* vote (i.e. Black)
# HISPANIC_PER, BLACK_PER, WHITE_PER, ASIAN_PER, OTHER_PER
if (sys.argv[2] == "Black"):
    X = np.array(data["BLACK_PER"])
elif(sys.argv[2] == "Hispanic"):
    X = np.array(data["HISPANIC_PER"])
elif(sys.argv[2] == "Asian"):
    X = np.array(data["ASIAN_PER"])
elif(sys.argv[2] == "White"):
    X = np.array(data["WHITE_PER"])
elif(sys.argv[2] == "Other"):
    X = np.array(data["OTHER_PER"])
else:
    exit(1)
# Percent of *selected party* (i.e. Republican)
if (sys.argv[3] == "Trump"):
    T = np.array(data["TOTAL_REP_PER"])
elif (sys.argv[3] == "Harris"):
    T = np.array(data["TOTAL_DEM_PER"])
else:
    exit(1)
# Total
N = np.array(data["TOTAL"])

demographic_group_name = sys.argv[2]
candidate_name = sys.argv[3]
precinct_names = data['ID']
data.head()

ei_2by2 = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=8, pareto_shape=2)
ei_2by2.fit(X, T, N, demographic_group_name=demographic_group_name, candidate_name=candidate_name, precinct_names=precinct_names)
posterior_mean_voting_prefs = ei_2by2.posterior_mean_voting_prefs
precinct_posterior_means, precinct_credible_intervals = ei_2by2.precinct_level_estimates()

with open(f"{sys.argv[4]}.txt", "w") as f:
    f.write(demographic_group_name + " support for " + candidate_name + ": " + str(posterior_mean_voting_prefs[0]) + "\n")
    f.write("Non-" + demographic_group_name + " support for " + candidate_name + ": " + str(posterior_mean_voting_prefs[1]) + "\n")
    f.write("Confidence Score for " + demographic_group_name + ": " + str(1/(1 + math.exp(18 - 26*posterior_mean_voting_prefs[0]))))
    for index, item in enumerate(precinct_posterior_means):
        f.write("Estimated (posterior mean) support for the candidate from the group in precinct {index}: " + str(precinct_posterior_means[index][0][0]) + "\n")

fig = ei_2by2.plot_kde().figure
fig.set_size_inches(6.8,3.3)
mpld3.save_json(fig, f"{sys.argv[4]}-EI.json")
mpld3.save_html(fig, f"{sys.argv[4]}-EI.html")
plt.savefig(f"{sys.argv[4]}-EI.png", dpi=200)

fig = ei_2by2.plot_polarization_kde(percentile=95, show_threshold=False).figure
fig.set_size_inches(6.8,3.3)
mpld3.save_html(fig, f"{sys.argv[4]}-KDE.html")
mpld3.save_json(fig, f"{sys.argv[4]}-KDE.json")
plt.savefig(f"{sys.argv[4]}-KDE.png", dpi=200)

fig = ei_2by2.precinct_level_plot().figure
fig.set_size_inches(6.8,3.3)
mpld3.save_json(fig, f"{sys.argv[4]}-EI-Precinct.json")
mpld3.save_html(fig, f"{sys.argv[4]}-EI-Precinct.html")
plt.savefig(f"{sys.argv[4]}-EI-Precinct.png", dpi=200)
