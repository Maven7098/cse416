import { useEffect, useState } from "react";
import VraImpactThresholdTable from "./VraImpactThresholdTable.jsx";
import "leaflet/dist/leaflet.css";
import "../CSS/StateInfo.css";
import axios from "axios";
import Mpld3Chart from "../Chart/Mpld3Chart.jsx";

function CompareChart({
  activeState,
  activeRace,
  currentRace
}) {
  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  const [vraImpactThresholdTable, setVraImpactThresholdTable] = useState("");
  const [boxandWhiskerData, setBoxandWhiskerData] = useState("");
  const [minorityEffectivenessData, setMinorityEffectivenessData] = useState("");

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

  const [vraImpactThresholdData, setVraImpactThresholdData] = useState(vraImpactThresholdTable.Black);
  const [currentBoxandWhiskerData, setCurrentBoxandWhiskerData] = useState(boxandWhiskerData.Black);
  const [currentMinorityEffectivenessData, setCurrentMinorityEffectivenessData] = useState(minorityEffectivenessData.Black);

  useEffect(() => {
    switch (activeRace) {
    case "HISPANIC":
      setVraImpactThresholdData(vraImpactThresholdTable.Hispanic)
      setCurrentBoxandWhiskerData(boxandWhiskerData.Hispanic)
      setCurrentMinorityEffectivenessData(minorityEffectivenessData.Hispanic)
      break;
    case "BLACK":
      setVraImpactThresholdData(vraImpactThresholdTable.Black)
      setCurrentBoxandWhiskerData(boxandWhiskerData.Black)
      setCurrentMinorityEffectivenessData(minorityEffectivenessData.Black)
      break;
    case "ASIAN":
      setVraImpactThresholdData(vraImpactThresholdTable.Asian)
      currentBoxandWhiskerData(boxandWhiskerData.Asian)
      setCurrentMinorityEffectivenessData(minorityEffectivenessData.Asian)
      break;
    }
  }, [activeRace]);

  return (
    // in accordance with the Navbar
    <div className="leaflet-containerset">
      <div className="leaflet-container-big">
        <h3 style={{ marginBottom: "0.5rem" }}>
          {currentRace} VRA Impact Threshold Table
        </h3>
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
