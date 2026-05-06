import csv
import json
import sys
import os

filename, extension = os.path.splitext(sys.argv[1])

print(filename)

with open(f"{filename}.csv", mode='r', newline='', encoding='utf-8') as csvfile:
    data = list(csv.DictReader(csvfile))

with open(f"{filename}.json", mode='w', encoding='utf-8') as jsonfile:
    json.dump(data, jsonfile, indent=4)
