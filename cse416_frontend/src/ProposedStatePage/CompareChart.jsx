import { useEffect, useState } from 'react';
import VraImpactThresholdTable from './VraImpactThresholdTable.jsx'
import BoxandWhiskerChart from './BoxandWhiskerChart';
import MinorityEffectivenessHistogram from './MinorityEffectivenessHistogram.jsx'
import 'leaflet/dist/leaflet.css';
import '../CSS/StateInfo.css';
import axios from 'axios';

function CompareChart({ activeState, activeRace }){
  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  const [vraImpactThresholdTable, setVraImpactThresholdTable] = useState([]);
  const [compareBoxandWhiskerData, setCompareBoxandWhiskerData] = useState([]);
  const [vraHistogram, setVraHistogram] = useState([]);
  const [nonVraHistogram, setNonVraHistogram] = useState([]);

  const width = 600;
  const height = 320;

  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  // There are racial versions of all of those data
  useEffect(() => {
      axios.get(`http://localhost:8080/compare?currentState=${activeState}`)
      .then(response => {
            setVraImpactThresholdTable(response.data[0]);
            setCompareBoxandWhiskerData(response.data[1]);
            setVraHistogram(response.data[2]);
            setNonVraHistogram(response.data[3]);})
      .catch(error => console.log(error.response?.data ?? error.message))
  }, [activeState]);

  let vraImpactThresholdData = vraImpactThresholdTable.BLACK;
  switch (activeRace) {
        case "HISPANIC":
            vraImpactThresholdData = vraImpactThresholdTable.HISPANIC;
            break;
        case "BLACK":
            vraImpactThresholdData = vraImpactThresholdTable.BLACK;
            break;
        case "ASIAN":
            vraImpactThresholdData = vraImpactThresholdTable.ASIAN;
            break;
    }

  return (
    // in accordance with the Navbar
    <div className="leaflet-containerset">
      <div className='leaflet-container-big'>
        <VraImpactThresholdTable data={vraImpactThresholdData} />
      </div>
      <div className='leaflet-container-big'>
        <BoxandWhiskerChart width={width} height={height} data={compareBoxandWhiskerData} />
        <MinorityEffectivenessHistogram vraData={vraHistogram} nonVraData={nonVraHistogram} width={width} height={height} />
      </div>
    </div>
  );
};

export default CompareChart;