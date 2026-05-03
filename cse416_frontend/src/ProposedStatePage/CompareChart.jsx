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
  const [vraImpactThresholdTable, setVraImpactThresholdTable] = useState(null);
  const [compareBoxandWhiskerData, setCompareBoxandWhiskerData] = useState("");
  const [compareHistogram, setCompareHistogram] = useState("");

  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  // There are racial versions of all of those data
  useEffect(() => {
    axios
      .get(`http://localhost:8080/compare?currentState=${activeState}`)
      .then((response) => {
        setVraImpactThresholdTable(response.data[0]);
        setCompareBoxandWhiskerData(response.data[1]);
        setCompareHistogram(response.data[2]);
      })
      .catch((error) => console.log(error.response?.data ?? error.message));
  }, [activeState]);

  const [vraImpactThresholdData, setVraImpactThresholdData] = useState(null);

  useEffect(() => {
    switch (activeRace) {
    case "HISPANIC":
      setVraImpactThresholdData(vraImpactThresholdTable?.Hispanic)
      break;
    case "BLACK":
      setVraImpactThresholdData(vraImpactThresholdTable?.Black)
      break;
    case "ASIAN":
      setVraImpactThresholdData(vraImpactThresholdTable?.Asian)
      break;
    }
  }, [activeRace, vraImpactThresholdTable]);

  const currentCompareBoxandWhiskerData = compareBoxandWhiskerData?.[activeRace];
  const currentCompareHistogramData = compareHistogram?.[activeRace];

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
        {currentCompareBoxandWhiskerData && (
          <Mpld3Chart data={currentCompareBoxandWhiskerData} figId="box-whisker" />
        )}
      </div>
      <div className="leaflet-container-big">
        <h3 style={{ marginBottom: "0.5rem" }}>
          {currentRace} distribution in districts
        </h3>
        <h5>Compare Histogram</h5>
        {currentCompareHistogramData && (
          <Mpld3Chart data={currentCompareHistogramData} figId="compare-histogram" />
        )}
      </div>
    </div>
  );
}

export default CompareChart;
