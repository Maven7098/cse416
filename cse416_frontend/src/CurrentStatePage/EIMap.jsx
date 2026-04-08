import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../CSS/StateInfo.css';
import Legend from './MapLegend.jsx';
import EIAnalysis from './EIAnalysis.jsx'
import EIKDE from './EIKDE.jsx'

function EIMap({ precinctGeoJsonData, eiData, eiKdeData, activeRace, latitude, longitude }){

    // What type of data will we need for GinglesMap.jsx?
    // Left: Choropleth Map (GUI-14)
    // Top Right: EI Analysis (GUI-12)
    // Bottom Right: EI KDE Results (GUI-15)

    const resizeMap = (mapRef) => {
        const resizeObserver = new ResizeObserver(() => mapRef.current?.invalidateSize())
        const container = document.getElementById('map-container-precinct')
        if (container) {
        resizeObserver.observe(container)
        }
    }
    const mapRef = useRef(null)

    let currentRace = "Black / African American"
    switch (activeRace) {
        case "HISPANIC":
            currentRace = "Hispanic / Latino";
            break;
        case "BLACK":
            currentRace = "Black / African American";
            break;
        case "ASIAN":
            currentRace = "Asian / Asian American";
            break;
    }
    
    // GUI-14 (TODO Next)
    const grades = [0, 20, 40, 60, 80, 100];
    const colors = ['#FFEDA0', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

    function style(){
    return {
        fillColor: '#FFEDA0',
        color: '#800026',
        weight: 2,
        opacity: 0.5,
        fillOpacity: 0.5
        };
    }
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
        let mapRace;

        switch (activeRace) {
        case "HISPANIC":
            mapRace = feature.properties.HISPANIC;
            break;
        case "BLACK":
            mapRace = feature.properties.BLACK;
            break;
        case "ASIAN":
            mapRace = feature.properties.ASIAN;
            break;
        }
        
        return {
            // property type should be chosen later on (after graph rendering is done)
            fillColor: getColor(mapRace),
            color: getWinner(feature.properties.WINNER),
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
        };
    }
    
    const width = 680;
    const eiHeight = 330;

    return (
        // Load the GeoJSON for the districting map
        // For Map 1 only: Map 2 does not have districting map
        // I will use GA for the prototype, although this may or may not be carried over to the final product
        // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
        // in accordance with the Navbar
    <div>
        <div className="leaflet-containerset">
            <div className='leaflet-container-big'>
                <h3>Voting Preference for {currentRace}</h3>
                <div className="map"><MapContainer center={[latitude, longitude]} key={JSON.stringify(precinctGeoJsonData)}
                zoom={7} className="leaflet-container" ref={mapRef} id="map-container-precinct"
                whenReady={() => resizeMap(mapRef)}>
                    <Legend grades={grades} colors={colors} title={`${currentRace} Voting %`}/>
                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Afraid of rendering a precinct file too large (I ran out of memory) */}
                    <GeoJSON data={precinctGeoJsonData} style={style} key={JSON.stringify(precinctGeoJsonData)}/>
                </MapContainer></div>
            </div>
            <div className='leaflet-container-big'>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <h3>Support for Candidate</h3>
                    <h5>EI Analysis</h5>
                    {/* EI Analysis */}
                    <EIAnalysis data={eiData} width={width} height={eiHeight} race={activeRace} />
                    <h3>EI KDE (Kernel Data) Results</h3>
                    {/* EI KDE Results */}
                    <EIKDE data={eiKdeData} width={width} height={eiHeight} race={activeRace}/>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EIMap;