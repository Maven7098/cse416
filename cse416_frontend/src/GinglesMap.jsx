import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import GinglesData from './GinglesData.jsx'
import GinglesChart from './GinglesChart.jsx'

// Data to be imported from the server
import axios from 'axios';

function GinglesMap({activeState}){
    // What type of data will we need for GinglesMap.jsx?
    // Left: Gingles Analysis Results (GUI-9)
    // Right: Gingles Data (GUI-10, GUI-11)
    // Top Right: EI Analysis (GUI-12)
    const [ginglesData, setGinglesData] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:3000/api/${activeState}/gingles`)
        .then(response => {setGinglesData(response.data)})
        .catch(error => console.log(error.response.data))
        // If Active State changes, then also reset districtData
        }, [activeState]);
    
    const width = 700;
    const height = 380;

    return (
        // Load the GeoJSON for the districting map
        // For Map 1 only: Map 2 does not have districting map
        // I will use GA for the prototype, although this may or may not be carried over to the final product
        // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
        // in accordance with the Navbar
    <div>
        {ginglesData ? <>
        <h1>Racial Polarization status of {activeState}</h1>
        <div className="leaflet-containerset">
            <div className='leaflet-container-big'>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {/* Gingles Data */}
                    <h3>Gingles 2/3 Data</h3>
                    <GinglesData data={ginglesData} width={width} height={height} />
                    {/* Gingles Chart */}
                </div>
            </div>
            <div className='leaflet-container-big'>
                <div style={{display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
                    <h3>Gingles 2/3 Table</h3>
                    <GinglesChart data={ginglesData} />
                </div>
            </div>
        </div>
        </> :
        <></>}
        
    </div>
  );
};

export default GinglesMap;