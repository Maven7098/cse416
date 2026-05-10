import numpy as np
import sys
import json
import pandas as pd

def calculate_calibrated_effectiveness(k, s_raw, a, b):
    """
    Calculates the Calibrated Effectiveness score for a district (vectorized).
    
    Parameters:
    k     : Minority CVAP share (0.0 to 1.0)
    s_raw : Raw win rate or vote share (0.0 to 1.0)
    a     : Calibration parameter (slope)
    b     : Calibration parameter (intercept)
    """
    # 1. Group Control Factor
    # Using np.minimum to handle arrays
    c = np.minimum(2 * k, 1.0)
    
    # 2. Input to logistic function
    x = c * s_raw
    
    # 3. Apply logistic transformation: 1 / (1 + exp(-(ax + b)))
    # numpy handles exp on arrays and OverflowError is avoided by its default behavior (returning inf)
    z = a * x + b
    s_cal = 1 / (1 + np.exp(-z))
        
    return s_cal

if __name__ == "__main__":
    if len(sys.argv) > 2:
        # Command line arguments
        input_file = sys.argv[1]
        state_or_params = sys.argv[2]
        
        try:
            df = pd.read_csv(input_file)
        except Exception as e:
            print(f"Error reading {input_file}: {e}")
            sys.exit(1)
        
        if state_or_params.lower() == "ga":
            a, b = 21.91, -10.51
        elif state_or_params.lower() == "tx":
            a, b = 11.4, 2.0
        elif state_or_params.endswith(".json"):
            # Load from custom JSON file if provided
            try:
                with open(state_or_params, "r") as f:
                    params = json.load(f)
                    a, b = params['a'], params['b']
            except Exception as e:
                print(f"Error reading params file: {e}")
                sys.exit(1)
        else:
            # Fallback values
            a, b = 11.4, 2.0

        print(f"Using parameters a={a}, b={b}")

        # Calculate for every district (row) across all groups
        groups = ["HISPANIC", "BLACK", "ASIAN", "WHITE", "OTHER"]
        for group in groups:
            per_col = f"{group}_PER"
            eff_col = f"{group}_EFF"
            
            if per_col in df.columns and eff_col in df.columns:
                # Some files might have percentages as strings (e.g. '12.6%')
                # Need to ensure they are floats between 0 and 1
                if df[per_col].dtype == object:
                    df[per_col] = df[per_col].str.rstrip('%').astype('float') / 100.0
                
                df[f"{group}_CALB"] = calculate_calibrated_effectiveness(df[per_col], df[eff_col], a, b)
                print(f"Calculated calibrated effectiveness for {group}")
            else:
                print(f"Warning: Columns {per_col} or {eff_col} not found in {input_file}")

        # Save to output file
        output_file = input_file.replace(".csv", "_calibrated.csv")
        df.to_csv(output_file, index=False)
        print(f"Results saved to {output_file}")
    else:
        print("Usage: python3 calculate_calibrated_effectiveness.py <csv_file> <ga|tx|params.json>")
