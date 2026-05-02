#!/bin/fish

source pyei_venv/bin/activate.fish

python3 presidential_ei.py GA-Precinct-EI.csv Black Harris Complete/GA-Polarization-Black-Harris
python3 presidential_ei.py GA-Precinct-EI.csv Black Trump Complete/GA-Polarization-Black-Trump
python3 presidential_ei.py GA-Precinct-EI.csv Hispanic Harris Complete/GA-Polarization-Hispanic-Harris
python3 presidential_ei.py GA-Precinct-EI.csv Hispanic Trump Complete/GA-Polarization-Hispanic-Trump
python3 presidential_ei.py GA-Precinct-EI.csv Asian Harris Complete/GA-Polarization-Asian-Harris
python3 presidential_ei.py GA-Precinct-EI.csv Asian Trump Complete/GA-Polarization-Asian-Trump
python3 presidential_ei.py IA-Precinct-EI.csv Black Harris Complete/IA-Polarization-Black-Harris
python3 presidential_ei.py IA-Precinct-EI.csv Black Trump Complete/IA-Polarization-Black-Trump
python3 presidential_ei.py IA-Precinct-EI.csv Hispanic Harris Complete/IA-Polarization-Hispanic-Harris
python3 presidential_ei.py IA-Precinct-EI.csv Hispanic Trump Complete/IA-Polarization-Hispanic-Trump
python3 presidential_ei.py IA-Precinct-EI.csv Asian Harris Complete/IA-Polarization-Asian-Harris
python3 presidential_ei.py IA-Precinct-EI.csv Asian Trump Complete/IA-Polarization-Asian-Trump
python3 presidential_ei.py GA-Precinct-EI.csv White Harris Complete/GA-Polarization-White-Harris
python3 presidential_ei.py GA-Precinct-EI.csv White Trump Complete/GA-Polarization-White-Trump
python3 presidential_ei.py GA-Precinct-EI.csv Other Harris Complete/GA-Polarization-Other-Harris
python3 presidential_ei.py GA-Precinct-EI.csv Other Trump Complete/GA-Polarization-Other-Trump
python3 presidential_ei.py IA-Precinct-EI.csv White Harris Complete/IA-Polarization-White-Harris
python3 presidential_ei.py IA-Precinct-EI.csv White Trump Complete/IA-Polarization-White-Trump
python3 presidential_ei.py IA-Precinct-EI.csv Other Harris Complete/IA-Polarization-Other-Harris
python3 presidential_ei.py IA-Precinct-EI.csv Other Trump Complete/IA-Polarization-Other-Trump

deactivate

#sed -i 's/{"width": 1000.0, "height": 500.0,/{"width": 680.0, "height": 330.0,/g' *.html
#sed -i 's/{"width": 1000.0, "height": 500.0,/{"width": 680.0, "height": 330.0,/g' *.json

