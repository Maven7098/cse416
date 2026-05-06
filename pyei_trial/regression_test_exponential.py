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
# Normalize to [0, 1] for stable regression
xdata_norm = gingles[GROUP.upper()]/gingles['TOTAL']
ydata_dem_norm = gingles['TOTAL_DEM']/gingles['TOTAL']
ydata_rep_norm = gingles['TOTAL_REP']/gingles['TOTAL']

# Data for plotting (0-100 scale)
xdata = xdata_norm * 100
ydata_dem = ydata_dem_norm * 100
ydata_rep = ydata_rep_norm * 100

# 2. Define your nonlinear model (e.g., an exponential growth model)
def model_func(x, a, b, c):
    return a * np.exp(b * x) + c

# 3. Perform the regression on normalized data
# p0 is an optional initial guess for the parameters [a, b, c]
try:
    popt_dem_norm, pcov_dem = curve_fit(model_func, xdata_norm, ydata_dem_norm, p0=[0.1, 1, 0], maxfev=20000)
    popt_rep_norm, pcov_rep = curve_fit(model_func, xdata_norm, ydata_rep_norm, p0=[0.1, 1, 0], maxfev=20000)
except Exception as e:
    print(f"Regression failed: {e}")
    # Fallback to some defaults or handle error
    popt_dem_norm = [0, 0, 0.5]
    popt_rep_norm = [0, 0, 0.5]

# Rescale parameters for the 0-100 scale formula: Y = A * exp(B * X) + C
# y/100 = a * exp(b * x/100) + c  =>  y = 100*a * exp((b/100) * x) + 100*c
popt_dem = [popt_dem_norm[0] * 100, popt_dem_norm[1] / 100, popt_dem_norm[2] * 100]
popt_rep = [popt_rep_norm[0] * 100, popt_rep_norm[1] / 100, popt_rep_norm[2] * 100]

# Export the formula
print(f"Optimized Parameters (DEM): a={popt_dem[0]}, b={popt_dem[1]}, c={popt_dem[2]}")
print(f"Optimized Parameters (REP): a={popt_rep[0]}, b={popt_rep[1]}, c={popt_rep[2]}")
with open(f'{OUTPUT_FILE}-{GROUP}-Line.json', "w") as f:
    json.dump({"TOTAL_DEM": [popt_dem[0], popt_dem[1], popt_dem[2]],
               "TOTAL_REP": [popt_rep[0], popt_rep[1], popt_rep[2]]}, f)

# Generate a scatter plot
fig, ax = plt.subplots(figsize=(16.1, 7.59))
ax.scatter(xdata, ydata_dem, marker="o", color='blue', alpha=0.3, label="Democratic")
ax.scatter(xdata, ydata_rep, marker="o", color='red', alpha=0.3, label="Republican")

# Plot the curves
x_plot = np.linspace(0, 100, 200)
ax.plot(x_plot, model_func(x_plot, *popt_dem), color='darkblue', linewidth=2, label='Democratic Curve')
ax.plot(x_plot, model_func(x_plot, *popt_rep), color='darkred', linewidth=2, label='Republican Curve')

ax.set_title(f"{GROUP} Population vs Vote Share")
ax.set_xlabel(f"Percent {GROUP} (%)")
ax.set_ylabel(f"Vote Share (%)")
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.legend(); ax.grid(True, linestyle='--', alpha=0.6)
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f"{y:.0f}%"))
ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f"{x:.0f}%"))
fig.tight_layout()
mpld3.save_html(fig, f"{OUTPUT_FILE}-{GROUP}.html")
mpld3.save_json(fig, f"{OUTPUT_FILE}-{GROUP}.json")
plt.savefig(f"{OUTPUT_FILE}-{GROUP}.png", dpi=200)
plt.close(fig)

