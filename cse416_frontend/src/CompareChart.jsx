import { useEffect, useState } from 'react';
import EnsembleSplits from './EnsembleSplits';
import BoxandWhiskerChart from './BoxandWhiskerChart';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import axios from 'axios';

function CompareChart({ activeState, activeRace }){
  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  const [currentBoxandWhiskerData, setCurrentBoxandWhiskerData] = useState([]);
  const [vraEnsembleSplitData, setVraEnsembleSplitData] = useState([]);
  const [vraBoxandWhiskerData, setVraBoxandWhiskerData] = useState([]);
  const [nonVraEnsembleSplitData, setNonVraEnsembleSplitData] = useState([]);
  const [nonVraBoxandWhiskerData, setNonVraBoxandWhiskerData] = useState([]);
  const [districtOne, setDistrictOne] = useState([[],[]]);
  const [districtTwo, setDistrictTwo] = useState([[],[]]);

  let districtOneName = "Proposed District (VRA Compliant)"
  let districtTwoName = "Proposed District (Race Blind)"

  const width = 700;
  const proposedHeight = 320;

  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  // There are racial versions of all of those data
  useEffect(() => {
      axios.get(`http://localhost:8080/compare?currentState=${activeState}&currentMode=chart`)
      .then(response => {
            setVraEnsembleSplitData(response.data[0]);
            setNonVraEnsembleSplitData(response.data[1])
            setCurrentBoxandWhiskerData(response.data[2]);
            setVraBoxandWhiskerData(response.data[3]);
            setNonVraBoxandWhiskerData(response.data[4]);})
      .catch(error => console.log(error.response.data))
  }, [activeState]);

  useEffect(() => {
    setDistrictOne([vraEnsembleSplitData, vraBoxandWhiskerData]);
    setDistrictTwo([nonVraEnsembleSplitData, nonVraBoxandWhiskerData]);
  },[vraEnsembleSplitData, nonVraEnsembleSplitData, vraBoxandWhiskerData, nonVraBoxandWhiskerData])

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
            {(districtOne[1] && currentBoxandWhiskerData) &&
            <BoxandWhiskerChart data={districtOne[1].filter((data) => data.RACE === activeRace)} circleData={currentBoxandWhiskerData.filter((data) => data.RACE === activeRace)} width={width} height={proposedHeight}/>}
            {/* <BoxandWhiskerExtra /> */}
          </div>
        </div>
        <div className='leaflet-container-big'>
          <h3>{districtTwoName}</h3>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            {/* GUI-16: Display Ensemble Splits in Bar Chart */}
            <EnsembleSplits data={districtTwo[0]} width={width} height={proposedHeight}/>
            {/* GUI-17: Display Box & Whisker Data */}
            <h3>Box and Whisker Data</h3>
            {(districtTwo[1] && currentBoxandWhiskerData) && 
            <BoxandWhiskerChart data={districtTwo[1].filter((data) => data.race === activeRace)} circleData={currentBoxandWhiskerData.filter((data) => data.race === activeRace)} width={width} height={proposedHeight}/>}
            {/* <BoxandWhiskerExtra /> */}
          </div>
        </div>
        </>
      }
    </div>
  );
};

export default CompareChart;