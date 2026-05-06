# Import the libraries and functions that you need, including curve_fit from scipy.optimize.
import mpld3
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
import sys
import json

INPUT_FILE = sys.argv[1]
OUTPUT_FILE = sys.argv[2]
GROUP = sys.argv[3]

# import the data
gingles = pd.read_csv(INPUT_FILE)
gingles = gingles[gingles['TOTAL'] != 0]
print(gingles[GROUP.upper()])
print(gingles['TOTAL'])
print(gingles['TOTAL_DEM'])
print(gingles['TOTAL_REP'])

# Create your independent and dependent variables for curve fitting.
xdata = gingles[GROUP.upper()]/gingles['TOTAL']
ydata_dem = gingles['TOTAL_DEM']/gingles['TOTAL']
ydata_rep = gingles['TOTAL_REP']/gingles['TOTAL']
print(xdata)
print(ydata_dem)
print(ydata_rep)

# 2. Define your nonlinear model (e.g., an exponential growth model)
def model_func(x, a, b, c):
    return a * np.exp(b * x) + c

# 3. Perform the regression
# p0 is an optional initial guess for the parameters [a, b, c]
popt_dem, pcov_dem = curve_fit(model_func, xdata, ydata_dem, maxfev=10000)
popt_rep, pcov_rep = curve_fit(model_func, xdata, ydata_rep, maxfev=10000)

# Export the formula
print(f"Optimized Parameters: a={popt_dem[0]}, b={popt_dem[1]}, c={popt_dem[2]}")
print(f"Optimized Parameters: a={popt_rep[0]}, b={popt_rep[1]}, c={popt_rep[2]}")
with open(f'{OUTPUT_FILE}-{GROUP}-Line.json', "w") as f:
    json.dump({"DEMOCRATIC": [popt_dem[0], popt_dem[1], popt_dem[2]],
               "REPUBLICAN": [popt_rep[0], popt_rep[1], popt_rep[2]]}, f)

# Generate a scatter plot
fig, ax = plt.subplots(figsize=(16.1, 7.59))
ax.scatter(xdata, ydata_dem, marker="o", color='blue', alpha=0.3, label="Democratic")
ax.scatter(xdata, ydata_rep, marker="o", color='red', alpha=0.3, label="Republican")
ax.plot(xdata, model_func(xdata, *popt_dem), color='darkblue', label='Democratic Curve')
ax.plot(xdata, model_func(xdata, *popt_rep), color='darkred', label='Republican Curve')
ax.set_title(f"{GROUP} Population vs Democratic Votes")
ax.set_xlabel(f"Percent {GROUP}")
ax.set_ylabel(f"Democratic Vote Share")
ax.legend(); ax.grid(True, axis="y", alpha=0.3)
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f"{y:.0%}"))
ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f"{x:.0%}"))
fig.tight_layout()
mpld3.save_html(fig, f"{OUTPUT_FILE}-{GROUP}.html")
mpld3.save_json(fig, f"{OUTPUT_FILE}-{GROUP}.json")
plt.savefig(f"{OUTPUT_FILE}-{GROUP}.png", dpi=200)
plt.close(fig)
