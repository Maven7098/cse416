#!/bin/python3

import json, sys
fileName = sys.argv[1]
with open(fileName) as f:
    d = json.load(f)
    
count = 1
for item in d:
    item["COUNT"] = count
    count=count+1
    
with open(fileName, "w") as f:
    json.dump(d, f)
