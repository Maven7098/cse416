import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
import sys
import json

def calculate_calibration_parameters(csv_file, output_json):
    # Read CSV file
    try:
        df = pd.read_csv(csv_file)
    except Exception as e:
        print(f"Error reading {csv_file}: {e}")
        return

    # Define the column pairs to iterate through
    groups = [
        ("BLACK_PER", "BLACK_EFF"),
        ("HISPANIC_PER", "HISPANIC_EFF"),
        ("ASIAN_PER", "ASIAN_EFF")
    ]

    all_x = []
    all_y = []

    for per_col, eff_col in groups:
        # Calculate Group Control factor: c = min(2k, 1)
        c = np.minimum(2 * df[per_col], 1.0)
        
        # Define input variables: x = c * s_raw
        x_group = (c * df[eff_col]).values
        
        # Outcome: 1 if Democrat wins, 0 otherwise
        y_group = (df['WINNER'] == "D").astype(int).values

        all_x.extend(x_group)
        all_y.extend(y_group)

    # Convert to numpy arrays for sklearn
    X = np.array(all_x).reshape(-1, 1)
    y = np.array(all_y)

    # Check if we have at least two classes to perform classification
    unique_classes = np.unique(y)
    if len(unique_classes) < 2:
        print(f"Error: Only one class found in outcomes ({unique_classes}).")
        print("Calibration requires at least one win and one loss in the historical data.")
        return

    # Fit logistic regression (Following Appendix B)
    try:
        model = LogisticRegression(penalty='l2', class_weight='balanced', solver='liblinear')
        model.fit(X, y)
    except Exception as e:
        print(f"Error fitting model: {e}")
        return

    # Extract parameters
    a = float(model.coef_[0][0])
    b = float(model.intercept_[0])
    params = {"a": a, "b": b}

    print(f"Calculation Complete.")
    print(f"Slope (a): {a:.4f}")
    print(f"Intercept (b): {b:.4f}")

    with open(output_json, "w") as f:
        json.dump(params, f, indent=4)
    print(f"Parameters saved to {output_json}")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        calculate_calibration_parameters(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python3 calculate_calibration.py <historical_data.csv> <output_params.json>")
