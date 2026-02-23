import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import EIAnalysis from './EIAnalysis.jsx'
import EIKDE from './EIKDE.jsx'
import { data } from './Data.js'

// Data to be imported from the server
import axios from 'axios';

function EIMap({activeState}){
    // What type of data will we need for GinglesMap.jsx?
    // Left: Choropleth Map (GUI-14)
    // Top Right: EI Analysis (GUI-12)
    // Bottom Right: EI KDE Results (GUI-15)

    const [geojsonData, setgeojsonData] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [districtData, setDistrictData] = useState("");
    const [currentState, setCurrentState] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:3000/api/${activeState}/geojson`)
        .then(response => {setgeojsonData(response.data[0]);
            setLatitude(response.data[1]);
            setLongitude(response.data[2]);
            setCurrentState(response.data[3])})
        .catch(error => console.log(error.response.data))
        // If Active State changes, then also reset districtData
        setDistrictData("")
    }, [activeState]);

    const resizeMap = (mapRef) => {
        const resizeObserver = new ResizeObserver(() => mapRef.current?.invalidateSize())
        const container = document.getElementById('map-container')
        if (container) {
        resizeObserver.observe(container)
        }
    }
    const mapRef = useRef(null)

    function getColor(d) {
    return d > 1000000 ? '#800026' :
           d > 500000  ? '#BD0026' :
           d > 200000  ? '#E31A1C' :
           d > 100000  ? '#FC4E2A' :
           d > 50000   ? '#FD8D3C' :
           d > 20000   ? '#FEB24C' :
           d > 10000   ? '#FED976' :
                      '#FFEDA0';
    }
    function getWinner(d) {
        switch (d) {
                case 'R': return "#ff0000";
                case 'D': return "#0000ff";
        }
    }

    // On click, show district number
    function style(feature) {
        // Need to find data on which President won which district
        // No third party won any district in Georgia or Iowa, so I only keep 2 values
        
        return {
            // property type should be chosen later on (after graph rendering is done)
            fillColor: getColor(feature.properties.BLACK),
            color: getWinner(feature.properties.WINNER),
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        };
    }
    
    const width = 900;
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
                <h1>Select Precinct</h1>
                <MapContainer center={[latitude, longitude]} key={JSON.stringify(geojsonData)}
                zoom={7} className="leaflet-container" ref={mapRef} id="map-container"
                whenReady={() => resizeMap(mapRef)}>
                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Afraid of rendering a precinct file too large (I ran out of memory) */}
                    {/* <GeoJSON data={geojsonData} style={style} onEachFeature={onEachFeature} key={JSON.stringify(geojsonData)}/> */}
                </MapContainer>
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

export default EIMap;