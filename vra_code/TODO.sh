#!/bin/fish

source new-vra/bin/activate.fish

mkdir Complete_256_Low Complete_4096_Low Complete_256_Medium Complete_4096_Medium Complete_256_High Complete_4096_High

#python3 new_vra_parallel.py GA-Precinct-EI-GeoJSON.json Complete_256_High/NEW-GA-Precinct 14 256 0.75
#python3 new_vra_parallel.py GA-Precinct-EI-GeoJSON.json Complete_256_Medium/NEW-GA-Precinct 14 256 0.6
#python3 new_vra_parallel.py GA-Precinct-EI-GeoJSON.json Complete_256_Low/NEW-GA-Precinct 14 256 0.5
#python3 new_vra_parallel.py GA-Precinct-EI-GeoJSON.json Complete_4096_High/NEW-GA-Precinct 14 4096 0.75
#python3 new_vra_parallel.py GA-Precinct-EI-GeoJSON.json Complete_4096_Medium/NEW-GA-Precinct 14 4096 0.6
#python3 new_vra_parallel.py GA-Precinct-EI-GeoJSON.json Complete_4096_Low/NEW-GA-Precinct 14 4096 0.5

python3 new_vra_parallel.py IA-Precinct-EI-GeoJSON.json Complete_256_High/NEW-IA-Precinct 4 256 0.75
python3 new_vra_parallel.py IA-Precinct-EI-GeoJSON.json Complete_256_Medium/NEW-IA-Precinct 4 256 0.6
python3 new_vra_parallel.py IA-Precinct-EI-GeoJSON.json Complete_256_Low/NEW-IA-Precinct 4 256 0.5
python3 new_vra_parallel.py IA-Precinct-EI-GeoJSON.json Complete_4096_High/NEW-IA-Precinct 4 4096 0.75
python3 new_vra_parallel.py IA-Precinct-EI-GeoJSON.json Complete_4096_Medium/NEW-IA-Precinct 4 4096 0.6
python3 new_vra_parallel.py IA-Precinct-EI-GeoJSON.json Complete_4096_Low/NEW-IA-Precinct 4 4096 0.5

deactivate