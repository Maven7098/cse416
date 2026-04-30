#!/bin/fish

source new-vra/bin/activate.fish

python3 new_vra.py NEW_GA_precinct_ei_fat_with_dist.json VRA/GA-Precinct-VRA 14
python3 new_raceblind.py NEW_GA_precinct_ei_fat_with_dist.json NonVRA/GA-Precinct-NonVRA 14
#python3 new_vra.py NEW_IA_precinct_ei_fat_with_dist.json VRA/IA-Precinct-VRA 14
#python3 new_raceblind.py NEW_IA_precinct_ei_fat_with_dist.json NonVRA/IA-Precinct-NonVRA 14

deactivate

#sed -i 's/{"width": 1200.0, "height": 600.0,/{"width": 820.0, "height": 760.0,/g' *.html
#sed -i 's/{"width": 1200.0, "height": 600.0,/{"width": 820.0, "height": 760.0,/g' *.json

