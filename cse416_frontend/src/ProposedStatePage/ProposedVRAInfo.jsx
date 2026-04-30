import { useState, useEffect, useRef } from 'react';
import '../CSS/StateInfo.css';
import EnsembleSplits from './EnsembleSplits.jsx'
import BoxandWhiskerChart from './BoxandWhiskerChart.jsx'

// Prototype data
import ensembleSplitTestNonVRA from '../../../cse416_backend_java/src/main/resources/assets/ga/GA-Precinct-NonVRA-Splits.json'
import boxandWhiskerTestNonVRA from '../../../cse416_backend_java/src/main/resources/assets/ga/GA-Precinct-NonVRA-Asian-Box.json'

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
                <Mpld3Chart data={ensembleSplitTestNonVRA} figId="ensemble-splits" />
                </div>
                <div className='leaflet-container-big'>
                <h3 style={{marginBottom: "0.5rem"}}>{currentRace} distribution in districts</h3>
                <h5>Box and Whisker Data</h5>
                <Mpld3Chart data={boxandWhiskerTestNonVRA} figId="box-whisker" />
                {/* <BoxandWhiskerExtra /> */}
                </div>
            </div>
        </div>
  );
};

export default ProposedVRAInfo;