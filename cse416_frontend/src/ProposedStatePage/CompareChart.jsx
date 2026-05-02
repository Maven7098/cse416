import { useEffect, useState } from "react";
import VraImpactThresholdTable from "./VraImpactThresholdTable.jsx";
import "leaflet/dist/leaflet.css";
import "../CSS/StateInfo.css";
import axios from "axios";

function CompareChart({
  activeState,
  activeRace,
  currentRace,
  boxandWhiskerData,
  minorityEffectivenessData,
}) {
  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  const [vraImpactThresholdTable, setVraImpactThresholdTable] = useState([]);
  const [boxandWhiskerData, setBoxandWhiskerData] = useState([]);
  const [minorityEffectivenessData, setMinorityEffectivenessData] = useState(
    [],
  );

  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  // There are racial versions of all of those data
  useEffect(() => {
    axios
      .get(`http://localhost:8080/compare?currentState=${activeState}`)
      .then((response) => {
        setVraImpactThresholdTable(response.data[0]);
        setCompareBoxandWhiskerData(response.data[1]);
        setVraHistogram(response.data[2]);
        setNonVraHistogram(response.data[3]);
      })
      .catch((error) => console.log(error.response?.data ?? error.message));
  }, [activeState]);

  let vraImpactThresholdData = vraImpactThresholdTable.BLACK;
  let currentBoxandWhiskerData = "";
  let currentMinorityEffectivenessData = "";
  switch (activeRace) {
    case "HISPANIC":
      vraImpactThresholdData = vraImpactThresholdTable.HISPANIC;
      currentBoxandWhiskerData = boxandWhiskerData.HISPANIC;
      currentMinorityEffectivenessData = minorityEffectivenessData.HISPANIC;
      break;
    case "BLACK":
      vraImpactThresholdData = vraImpactThresholdTable.BLACK;
      currentBoxandWhiskerData = boxandWhiskerData.BLACK;
      currentMinorityEffectivenessData = minorityEffectivenessData.BLACK;
      break;
    case "ASIAN":
      vraImpactThresholdData = vraImpactThresholdTable.ASIAN;
      currentBoxandWhiskerData = boxandWhiskerData.ASIAN;
      currentMinorityEffectivenessData = minorityEffectivenessData.ASIAN;
      break;
  }

  return (
    // in accordance with the Navbar
    <div className="leaflet-containerset">
      <div className="leaflet-container-big">
        <VraImpactThresholdTable data={vraImpactThresholdData} />
      </div>
      <div className="leaflet-container-big">
        <h3 style={{ marginBottom: "0.5rem" }}>
          {currentRace} distribution in districts
        </h3>
        <h5>Box and Whisker Data</h5>
        {boxandWhiskerData && (
          <Mpld3Chart data={boxandWhiskerData} figId="box-whisker" />
        )}
        <h3 style={{ marginBottom: "0.5rem" }}>
          {currentRace} distribution in districts
        </h3>
        <h5>{currentRace} Effectiveness vs Majority Districts</h5>
        {minorityEffectivenessData && (
          <Mpld3Chart
            data={minorityEffectivenessData}
            figId="minority-effectiveness"
          />
        )}
      </div>
    </div>
  );
}

export default CompareChart;
