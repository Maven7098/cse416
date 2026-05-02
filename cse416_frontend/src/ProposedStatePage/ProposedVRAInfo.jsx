import { useState, useRef } from "react";
import "../CSS/StateInfo.css";
import Mpld3Chart from "../Chart/Mpld3Chart.jsx";

function ProposedVRAInfo({
  activeRace,
  currentRace,
  ensembleSplitData,
  boxandWhiskerData,
  minorityEffectivenessData,
}) {
  let currentBoxandWhiskerData = "";
  let currentMinorityEffectivenessData = "";
  switch (activeRace) {
    case "HISPANIC":
      currentBoxandWhiskerData = boxandWhiskerData.HISPANIC;
      currentMinorityEffectivenessData = minorityEffectivenessData.HISPANIC;
      break;
    case "BLACK":
      currentBoxandWhiskerData = boxandWhiskerData.BLACK;
      currentMinorityEffectivenessData = minorityEffectivenessData.BLACK;
      break;
    case "ASIAN":
      currentBoxandWhiskerData = boxandWhiskerData.ASIAN;
      currentMinorityEffectivenessData = minorityEffectivenessData.ASIAN;
      break;
  }

  return (
    <div>
      <div className="leaflet-containerset">
        <div className="leaflet-container-big">
          <h3 style={{ marginBottom: "0.5rem" }}>Simulated Elections</h3>
          <h5>D/R: Democratic Victory/Republican Victory</h5>
          {ensembleSplitData && (
            <Mpld3Chart data={ensembleSplitData} figId="ensemble-splits" />
          )}
        </div>
        <div className="leaflet-container-big">
          <h3 style={{ marginBottom: "0.5rem" }}>
            {currentRace} distribution in districts
          </h3>
          <h5>Box and Whisker Data</h5>
          {currentBoxandWhiskerData && (
            <Mpld3Chart data={currentBoxandWhiskerData} figId="box-whisker" />
          )}
        </div>
        <div className="leaflet-container-big">
          <h3 style={{ marginBottom: "0.5rem" }}>
            {currentRace} distribution in districts
          </h3>
          <h5>{currentRace} Effectiveness vs Majority Districts</h5>
          {currentMinorityEffectivenessData && (
            <Mpld3Chart
              data={currentMinorityEffectivenessData}
              figId="minority-effectiveness"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProposedVRAInfo;
