# Import the libraries and functions that you need, including curve_fit from scipy.optimize.
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
import sys

INPUT_FILE = sys.argv[1]
OUTPUT_FILE = sys.argv[2]
GROUP = sys.argv[3]

# import the data
gingles = pd.read_csv(INPUT_FILE)

# Create your independent and dependent variables for curve fitting.
xdata = gingles[GROUP]/gingles['TOTAL']
ydata_dem = gingles['TOTAL_DEM']/gingles['TOTAL']
ydata_rep = gingles['TOTAL_REP']/gingles['TOTAL']

# 2. Define your nonlinear model (e.g., an exponential growth model)
def model_func(x, a, b, c):
    return a * np.exp(b * x) + c

# 3. Perform the regression
# p0 is an optional initial guess for the parameters [a, b, c]
popt_dem, pcov_dem = curve_fit(model_func, xdata, ydata_dem, p0=[1, 0.01, 1])
popt_rep, pcov_rep = curve_fit(model_func, xdata, ydata_rep, p0=[1, 0.01, 1])

print(f"Optimized Parameters: a={popt_dem[0]}, b={popt_dem[1]}, c={popt_dem[2]}")
print(f"Optimized Parameters: a={popt_rep[0]}, b={popt_rep[1]}, c={popt_rep[2]}")

# Generate a scatter plot
fig, ax = plt.subplots(figsize=(5.46, 7.2))
ax.scatter(xdata, ydata_dem, marker="o", label="Democratic")
ax.scatter(xdata, ydata_rep, marker="o", label="Republican")
ax.plot(xdata, model_func(xdata, *popt_dem), color='blue', label='Democratic Curve')
ax.plot(xdata, model_func(xdata, *popt_rep), color='red', label='Republican Curve')
ax.set_title(f"{group_name} Population vs Democratic Votes")
ax.set_xlabel(f"Percent {group_name}")
ax.set_ylabel(f"Democratic Vote Share")
ax.legend(); ax.grid(True, axis="y", alpha=0.3)
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f"{y:.0%}"))
fig.tight_layout()
mpld3.save_html(fig, f"{OUTPUT_FILE}-{group_name}-Gingles.html")
mpld3.save_json(fig, f"{OUTPUT_FILE}-{group_name}-Gingles.json")
plt.savefig(f"{OUTPUT_FILE}-{group_name}-Gingles.png", dpi=200)
plt.close(fig)
