import { useEffect, useState } from 'react';
import EnsembleSplits from './EnsembleSplits';
import BoxandWhiskerChart from './BoxandWhiskerChart';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import axios from 'axios';

function CompareChart({ activeState, activeRace, currentMode }){
  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  const [currentEnsembleSplitData, setCurrentEnsembleSplitData] = useState([]);
  const [currentBoxandWhiskerData, setCurrentBoxandWhiskerData] = useState([]);
  const [vraEnsembleSplitData, setVraEnsembleSplitData] = useState([]);
  const [vraBoxandWhiskerData, setVraBoxandWhiskerData] = useState([]);
  const [nonVraEnsembleSplitData, setNonVraEnsembleSplitData] = useState([]);
  const [nonVraBoxandWhiskerData, setNonVraBoxandWhiskerData] = useState([]);
  const [districtOne, setDistrictOne] = useState([[],[]]);
  const [districtTwo, setDistrictTwo] = useState([[],[]]);

  let districtOneName = "District 1"
  let districtTwoName = "District 2"

  const width = 450;
  const proposedHeight = 200;

    // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  useEffect(() => {
      axios.get(`http://localhost:3000/api/${activeState}/district-compare-chart`)
      .then(response => {
            setCurrentEnsembleSplitData(response.data[0]);
            setCurrentBoxandWhiskerData(response.data[1]);
            setVraEnsembleSplitData(response.data[2]);
            setVraBoxandWhiskerData(response.data[3]);
            setNonVraEnsembleSplitData(response.data[4]);
            setNonVraBoxandWhiskerData(response.data[5]);})
      .catch(error => console.log(error.response.data))
  }, [activeState]);

  // Switch District #1 and #2 based on current Mode
  useEffect(() => {
    switch (currentMode) {
    case "Current / Proposed-VRA-Compliant":
      setDistrictOne([currentEnsembleSplitData,currentBoxandWhiskerData]);
      districtOneName = "Current District"
      setDistrictTwo([vraEnsembleSplitData, vraBoxandWhiskerData]);
      districtTwoName = "Proposed District (VRA Compliant)"
      break;
    case "Current / Proposed-Race-Blind":
      setDistrictOne([currentEnsembleSplitData,currentBoxandWhiskerData]);
      districtOneName = "Current District"
      setDistrictTwo([nonVraEnsembleSplitData, nonVraBoxandWhiskerData]);
      districtTwoName = "Proposed District (Race Blind)"
      break;
    case "Proposed-VRA-Compliant / Proposed-Race-Blind":
      setDistrictOne([vraEnsembleSplitData, vraBoxandWhiskerData]);
      districtOneName = "Proposed District (VRA Compliant)"
      setDistrictTwo([nonVraEnsembleSplitData, nonVraBoxandWhiskerData]);
      districtTwoName = "Proposed District (Race Blind)"
      break;
    default:
      setDistrictOne("");
      districtOneName = "District 1"
      setDistrictTwo("");
      districtTwoName = "District 2"
  }
  }, [currentMode])

  return (
    // in accordance with the Navbar
    <div className="leaflet-containerset">
        {(districtOne && districtTwo) && 
        <>
          <div className='leaflet-container-big'>
          <h3>{districtOneName}</h3>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            {/* GUI-16: Display Ensemble Splits in Bar Chart */}
            <EnsembleSplits data={districtOne[0]} width={width} height={proposedHeight}/>
            {/* GUI-17: Display Box & Whisker Data */}
            <h3>Box and Whisker Data</h3>
            <BoxandWhiskerChart data={districtOne[1]} width={width} height={proposedHeight}/>
          </div>
        </div>
        <div className='leaflet-container-big'>
          <h3>{districtTwoName}</h3>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            {/* GUI-16: Display Ensemble Splits in Bar Chart */}
            <EnsembleSplits data={districtTwo[0]} width={width} height={proposedHeight}/>
            {/* GUI-17: Display Box & Whisker Data */}
            <h3>Box and Whisker Data</h3>
            <BoxandWhiskerChart data={districtTwo[1]} width={width} height={proposedHeight}/>
          </div>
        </div>
        </>
      }
    </div>
  );
};

export default CompareChart;