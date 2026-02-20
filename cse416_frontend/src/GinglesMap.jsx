import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import GinglesData from './GinglesData.jsx'
import GinglesChart from './GinglesChart.jsx'
import EIAnalysis from './EIAnalysis.jsx'
import EIKDE from './EIKDE.jsx'

// Data to be imported from the server
import axios from 'axios';

function GinglesMap({activeState}){
    // What type of data will we need for GinglesMap.jsx?
    // Top Left: Gingles Analysis Results (GUI-9)
    // Top Right: EI Analysis (GUI-12)
    // Bottom Left: Gingles Data (GUI-10, GUI-11)
    // Bottom Right: EI KDE Results (GUI-15)


    useEffect(() => {
        axios.get(`http://localhost:3000/api/${activeState}/gingles`)
        .then(response => {setgeojsonData(response.data[0]);
            setLatitude(response.data[1]);
            setLongitude(response.data[2]);
            setCurrentState(response.data[3])})
        .catch(error => console.log(error.response.data))
        // If Active State changes, then also reset districtData
        setDistrictData("")
        }, [activeState]);


    return (
        // Load the GeoJSON for the districting map
        // For Map 1 only: Map 2 does not have districting map
        // I will use GA for the prototype, although this may or may not be carried over to the final product
        // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
        // in accordance with the Navbar
        <div className="leaflet-containerset">
            <div className='leaflet-container-big'>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {/* Gingles Data */}
                    <GinglesData />
                    {/* Gingles Chart */}
                    <GinglesChart />
                </div>
            </div>
            <div className='leaflet-container-big'>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {/* EI Analysis */}
                    <EIAnalysis />
                    {/* EI KDE Results */}
                    <EIKDE />
                </div>
            </div>
        </div>
  );
};

export default GinglesMap;