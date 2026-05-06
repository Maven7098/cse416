#!/bin/fish
source regression_test/bin/activate.fish

python3 regression_test_exponential.py GA-Precinct-EI.csv ga/GA-Polarization-Gingles Black
python3 regression_test_exponential.py GA-Precinct-EI.csv ga/GA-Polarization-Gingles Hispanic
python3 regression_test_exponential.py GA-Precinct-EI.csv ga/GA-Polarization-Gingles Asian
python3 regression_test_exponential.py IA-Precinct-EI.csv ia/IA-Polarization-Gingles Black
python3 regression_test_exponential.py IA-Precinct-EI.csv ia/IA-Polarization-Gingles Hispanic
python3 regression_test_exponential.py IA-Precinct-EI.csv ia/IA-Polarization-Gingles Asian

deactivate
