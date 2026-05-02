import json
import sys

def merge_json_by_id(file1_path, file2_path, output_path, id_field):
    """
    Merges data from two JSON files based on a common ID field.

    Args:
        file1_path (str): Path to the first JSON file.
        file2_path (str): Path to the second JSON file.
        output_path (str): Path where the merged JSON file will be saved.
        id_field (str): The common key (e.g., 'id' or 'user_id') to match records.
    """
    # 1. Load data from both JSON files
    with open(file1_path, 'r') as f1:
        data1prep = json.load(f1)
        data1 = data1prep["features"]

    with open(file2_path, 'r') as f2:
        data2 = json.load(f2)
    
    # 2. Use a dictionary for efficient lookups of records in the first file
    # This assumes the data in each file is a list of dictionaries
    # and we prioritize data from the second file for any key collisions
    merged_data = {item["properties"][id_field] : item for item in data1}
    
    # 3. Iterate through the second file's data and merge/update
    for item in data2:
        # Convert item_id to Titlecase
        # actual item inside "properties" in GeoJSON
        item_id = item[id_field].upper()
        if item_id in merged_data:
            # If ID matches, update the existing record with data from the second file
            merged_data[item_id].update(item)
        else:
            # If ID is new, add the entire record
            merged_data[item_id] = item
            
    # 4. Convert the dictionary of merged data back to a list
    final_merged_list = list(merged_data.values())
    
    # 5. Write the result to a new JSON file
    with open(output_path, 'w') as outfile:
        json.dump(final_merged_list, outfile, indent=4)
    
    print(f"Merged data saved to {output_path}")

# Example Usage:
# Assuming you have "file1.json" and "file2.json" in the same directory
# containing data like: [{"id": 1, "name": "A", "info1": "..."}]
merge_json_by_id(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])

