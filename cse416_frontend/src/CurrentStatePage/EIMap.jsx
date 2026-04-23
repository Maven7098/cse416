import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../CSS/StateInfo.css';
import Legend from './MapLegend.jsx';
import EIAnalysis from './EIAnalysis.jsx'
import EIKDE from './EIKDE.jsx'

import testEiData from './TestEi.json'
import testEiKdeData from './TestEiKde.json'
import Mpld3Chart from './Mpld3Chart.jsx';

function EIMap({ precinctGeoJsonData, currentMode, eiData, eiKdeData, activeRace, latitude, longitude }){

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
    let colors = [];
    if(currentMode == 'D'){
        colors = ['#EDA0FF', '#0000FF', '#0000D7', '#0000C6', '#0000B7', '#00009B'];
    }
    else{
        colors = ['#FFEDA0', '#FF0000', '#D70000', '#C60000', '#B70000', '#9B0000'];
    } 

    // Grades of Blue (if Democrat is selected)
    // Grades of Red (if Republican is selected)
    function getColor(d, currentMode) {
        if(currentMode == 'D'){
            return d > 1 ? '#00009B' :
                d > 0.8  ? '#0000B7' :
                d > 0.6  ? '#0000C6' :
                d > 0.4  ? '#0000D7' :
                d > 0.2  ? '#0000FF' :
                            '#EDA0FF';
        }
        else{
            return d > 1 ? '#9B0000' :
                d > 0.8  ? '#B70000' :
                d > 0.6  ? '#C60000' :
                d > 0.4  ? '#D70000' :
                d > 0.2  ? '#FF0000' :
                            '#FFEDA0';
        }
    }

    function getWinner(currentMode) {
        switch (currentMode) {
                case 'R': return "#ff0000";
                case 'D': return "#0000ff";
        }
    }

    // On click, show district number
    function style(feature) {
        // Need to find data on which President won which district
        // No third party won any district in Georgia or Iowa, so I only keep 2 values
        let mapRace;
        let mapRaceVote;

        switch (activeRace) {
        case "HISPANIC":
            mapRace = feature.properties.HISPANIC;
            if(currentMode == 'D'){
                mapRaceVote = feature.properties.HISPANIC_DEM;
            }
            else{
                mapRaceVote = feature.properties.HISPANIC_REP;
            }
            break;
        case "BLACK":
            mapRace = feature.properties.BLACK;
            if(currentMode == 'D'){
                mapRaceVote = feature.properties.BLACK_DEM;
            }
            else{
                mapRaceVote = feature.properties.BLACK_REP;
            }
            break;
        case "ASIAN":
            mapRace = feature.properties.ASIAN;
            if(currentMode == 'D'){
                mapRaceVote = feature.properties.ASIAN_DEM;
            }
            else{
                mapRaceVote = feature.properties.ASIAN_REP;
            }
            break;
        }
        
        return {
            // property type should be chosen later on (after graph rendering is done)
            fillColor: getColor(mapRaceVote/mapRace, currentMode),
            color: getWinner(currentMode),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        };
    }
    
    const width = 680;
    const eiHeight = 330;

    const MyChart = () => {
        const svgRef = useRef();

        useEffect(() => {
            const svg = d3.select(svgRef.current);
            testEiData
        }, []);

        return <svg ref={svgRef}></svg>;
    };

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
                    {/* EI Analysis */}
                    {/* <EIAnalysis data={testEiData} width={width} height={eiHeight} race={activeRace} /> */}
                    
                    {/* EI KDE Results */}
                    <section>
                        <h5>EI Analysis</h5>
                        <Mpld3Chart data={testEiData} figId="ei-data" />
                    </section>

                    {/* Second Chart */}
                    <section>
                        <h5>EI KDE (Kernel Data) Results</h5>
                        <Mpld3Chart data={testEiKdeData} figId="ei-kde" />
                    </section>
                    {/* <EIKDE data={testEiKdeData} width={width} height={eiHeight} race={activeRace}/> */}
                </div>
            </div>
        </div>
    </div>
  );
};

export default EIMap;