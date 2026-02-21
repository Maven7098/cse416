import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import GinglesData from './GinglesData.jsx'
import GinglesChart from './GinglesChart.jsx'
import EIAnalysis from './EIAnalysis.jsx'
import EIKDE from './EIKDE.jsx'
import { data } from './Data.js'
import { gdata } from './GData.js';

// Data to be imported from the server
import axios from 'axios';

function GinglesMap({activeState}){
    // What type of data will we need for GinglesMap.jsx?
    // Top Left: Gingles Analysis Results (GUI-9)
    // Top Right: EI Analysis (GUI-12)
    // Bottom Left: Gingles Data (GUI-10, GUI-11)
    // Bottom Right: EI KDE Results (GUI-15)
    const [currentState, setCurrentState] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:3000/api/${activeState}/geojson`)
        .then(response => {setCurrentState(response.data[3])})
        .catch(error => console.log(error.response.data))
        // If Active State changes, then also reset districtData
        }, [activeState]);
    
    const width = 700;
    const height = 280;
    const eiHeight = 210;

    return (
        // Load the GeoJSON for the districting map
        // For Map 1 only: Map 2 does not have districting map
        // I will use GA for the prototype, although this may or may not be carried over to the final product
        // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
        // in accordance with the Navbar
    <div>
        <h1>Racial Polarization status of {currentState.NAME}</h1>
        <div className="leaflet-containerset">
            <div className='leaflet-container-big'>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {/* Gingles Data */}
                    <h3>Gingles 2/3 Data</h3>
                    <GinglesData data={gdata} width={width} height={height} />
                    {/* Gingles Chart */}
                    <h3>Gingles 2/3 Table</h3>
                    {/* <GinglesChart /> */}
                </div>
            </div>
            <div className='leaflet-container-big'>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <h3>EI Analysis</h3>
                    {/* EI Analysis */}
                    <EIAnalysis data={data} width={width} height={eiHeight} />
                    <h3>EI KDE (Kernel Data) Results</h3>
                    {/* EI KDE Results */}
                    <EIKDE data={data} width={width} height={eiHeight} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default GinglesMap;