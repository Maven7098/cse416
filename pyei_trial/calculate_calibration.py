import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
import sys
import json

def calculate_calibration_parameters(csv_file, output_json):
    """
    Calculates calibration parameters (a, b) using historical district-level data.
    
    Expected CSV columns:
    - 'RAW_EFFECTIVENESS': (s_raw) The historical win rate/vote share (0.0 to 1.0)
    - 'MINORITY_CVAP': (k) Minority share of Citizen Voting Age Population (0.0 to 1.0)
    - 'OUTCOME': (delta) Binary outcome 1 if the candidate won, 0 if they lost.
    """
    try:
        df = pd.read_csv(csv_file)
    except Exception as e:
        print(f"Error reading {csv_file}: {e}")
        return

    # 1. Calculate Group Control Factor: c = min(2k, 1)
    df['c'] = df['MINORITY_CVAP'].apply(lambda k: min(2 * k, 1.0))
    
    # 2. Define the input variable: x = c * s_raw
    X = (df['c'] * df['RAW_EFFECTIVENESS']).values.reshape(-1, 1)
    y = df['OUTCOME'].values

    # 3. Fit Logistic Regression (following Appendix B settings)
    # L2 penalty and balanced class weights to handle data imbalance
    model = LogisticRegression(penalty='l2', class_weight='balanced', solver='liblinear')
    model.fit(X, y)

    # 4. Extract Parameters
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
