import json
import pandas as pd
import sys
from collections import defaultdict

def calculate_overlap(csv_file, output_file):
    try:
        df = pd.read_csv(csv_file)
    except Exception as e:
        print(f"Error reading {csv_file}: {e}")
        return

    # Demographic groups to analyze
    groups = ["BLACK", "HISPANIC", "ASIAN"]
    overlap_all = {}
    
    # Calculate total White votes and support percentages
    white_dem = df["WHITE_DEM"].sum()
    white_rep = df["WHITE_REP"].sum()
    white_total = white_dem + white_rep
    
    if white_total == 0:
        print("No white votes found in data.")
        return

    white_pct_harris = white_dem / white_total
    white_pct_trump = white_rep / white_total

    print(f"Analysis for: {csv_file}")
    print(f"Total White Vote: {white_total:,}")
    print(f"White support for Harris: {white_pct_harris:.2%}")
    print(f"White support for Trump: {white_pct_trump:.2%}")
    print("-" * 30)
    print(f"{'Group':<10} | {'Preferred':<10} | {'Overlap (%)':<12}")
    print("-" * 30)

    for g in groups:
        g_dem = df[f"{g}_DEM"].sum()
        g_rep = df[f"{g}_REP"].sum()
        g_total = g_dem + g_rep
        
        if g_total == 0:
            print(f"{g:<10} | {'N/A':<10} | {'N/A':<12}")
            continue
            
        # Determine group preference
        overlap_harris = white_pct_harris
        overlap_trump = white_pct_trump
        pref_harris = g_dem / g_total
        if pref_harris > 0.5:
            preferred_candidate = "Harris"
            overlap = white_pct_harris
        else:
            preferred_candidate = "Trump"
            overlap = white_pct_trump

        print(f"{g:<10} | {preferred_candidate:<10} | {overlap:.2%}")

        overlap_all['Harris'] = f"{overlap_harris:.2%}"
        overlap_all['Trump'] = f"{overlap_trump:.2%}"
        with open(f'{output_file}-{g.title()}-Overlap.json', "w") as f:
            json.dump(overlap_all, f)

if __name__ == "__main__":
    if len(sys.argv) > 2:
        overlap = calculate_overlap(sys.argv[1], sys.argv[2])
    else:
        print("Argument: ./pyei_venv/bin/python3 calculate_overlap.py input_file output_file")
