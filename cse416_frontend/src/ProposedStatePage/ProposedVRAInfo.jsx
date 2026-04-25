import { useState, useEffect, useRef } from 'react';
import '../CSS/StateInfo.css';
import EnsembleSplits from './EnsembleSplits.jsx'
import BoxandWhiskerChart from './BoxandWhiskerChart.jsx'

// Prototype data
import ensembleSplitTest from './ga_dem_seats.json'
import boxandWhiskerTest from './district_shares.json'

function ProposedVRAInfo({ activeRace, ensembleSplitData, boxandWhiskerData, circleData }){

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
    
    const width = 800;
    const height = 640;

    const MyChart = () => {
        const svgRef = useRef();

        useEffect(() => {
            const svg = d3.select(svgRef.current);
            testEiData
        }, []);

        return <svg ref={svgRef}></svg>;
    };



    return (
        <div>
            <div className="leaflet-containerset">
                <div className='leaflet-container-big'>
                <h3 style={{marginBottom: "0.5rem"}}>Simulated Elections</h3>
                <h5>D/R: Democratic Victory/Republican Victory</h5>
                <EnsembleSplits data={ensembleSplitTest} width={width} height={height}/>
                </div>
                <div className='leaflet-container-big'>
                <h3 style={{marginBottom: "0.5rem"}}>{currentRace} distribution in districts</h3>
                <h5>Box and Whisker Data</h5>
                <BoxandWhiskerChart data={boxandWhiskerTest} activeRace={activeRace}
                width={width} height={height}/>
                {/* <BoxandWhiskerExtra /> */}
                </div>
            </div>
        </div>
  );
};

export default ProposedVRAInfo;