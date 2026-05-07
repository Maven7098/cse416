#!/bin/fish

source pyei_venv/bin/activate.fish

python3 presidential_ei.py GA-Precinct-EI.csv Black Harris ga/GA-Polarization-Black-Harris
python3 presidential_ei.py GA-Precinct-EI.csv Black Trump ga/GA-Polarization-Black-Trump
python3 presidential_ei.py GA-Precinct-EI.csv Hispanic Harris ga/GA-Polarization-Hispanic-Harris
python3 presidential_ei.py GA-Precinct-EI.csv Hispanic Trump ga/GA-Polarization-Hispanic-Trump
python3 presidential_ei.py GA-Precinct-EI.csv Asian Harris ga/GA-Polarization-Asian-Harris
python3 presidential_ei.py GA-Precinct-EI.csv Asian Trump ga/GA-Polarization-Asian-Trump
python3 presidential_ei.py IA-Precinct-EI.csv Black Harris ia/IA-Polarization-Black-Harris
python3 presidential_ei.py IA-Precinct-EI.csv Black Trump ia/IA-Polarization-Black-Trump
python3 presidential_ei.py IA-Precinct-EI.csv Hispanic Harris ia/IA-Polarization-Hispanic-Harris
python3 presidential_ei.py IA-Precinct-EI.csv Hispanic Trump ia/IA-Polarization-Hispanic-Trump
python3 presidential_ei.py IA-Precinct-EI.csv Asian Harris ia/IA-Polarization-Asian-Harris
python3 presidential_ei.py IA-Precinct-EI.csv Asian Trump ia/IA-Polarization-Asian-Trump
#python3 presidential_ei.py GA-Precinct-EI.csv White Harris ga/GA-Polarization-White-Harris
#python3 presidential_ei.py GA-Precinct-EI.csv White Trump ga/GA-Polarization-White-Trump
#python3 presidential_ei.py GA-Precinct-EI.csv Other Harris ga/GA-Polarization-Other-Harris
#python3 presidential_ei.py GA-Precinct-EI.csv Other Trump ga/GA-Polarization-Other-Trump
#python3 presidential_ei.py IA-Precinct-EI.csv White Harris ia/IA-Polarization-White-Harris
#python3 presidential_ei.py IA-Precinct-EI.csv White Trump ia/IA-Polarization-White-Trump
#python3 presidential_ei.py IA-Precinct-EI.csv Other Harris ia/IA-Polarization-Other-Harris
#python3 presidential_ei.py IA-Precinct-EI.csv Other Trump ia/IA-Polarization-Other-Trump

deactivate

#sed -i 's/{"width": 1000.0, "height": 500.0,/{"width": 680.0, "height": 330.0,/g' *.html
#sed -i 's/{"width": 1000.0, "height": 500.0,/{"width": 680.0, "height": 330.0,/g' *.json

