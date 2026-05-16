#!/bin/fish

source pyei_venv/bin/activate.fish

python3 presidential_ei.py GA-Precinct-EI-with-District-2.csv ga/GA-Polarization
python3 presidential_ei.py IA-Precinct-EI-with-District-2.csv ia/IA-Polarization

deactivate
