import { useEffect, useState } from "react";
import "../CSS/GinglesTable.css";

function VraImpactThresholdTable({ data, race, activePrecinct }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "1rem" }}>
        VRA Impact Threshold Table is not available yet.
      </div>
    );
  }
  return (
    <div>
      <table className="fixed-table">
        <thead>
          <tr>
            <th>VRA Impact Threshold</th>
            <th>Race-Blind</th>
            <th>VRA-Constrainted</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* Enacted Effectiveness: from effectiveness.json */}
            {/* Count effectiveness.json > 5 (for GA), > 0 (for IA) */}
            <td>
              Satisfies Enacted Effectiveness (number of effective districts in
              plan)
            </td>
            <td>{data.FALSE[0]}</td>
            <td>{data.TRUE[0]}</td>
          </tr>
          <tr>
            {/* Rough Proportionality: from effectiveness.json */}
            {/* (MinorityEffective/TotalDistrict) / (MinorityPopulation/TotalPopulation) */}
            {/* Count effectiveness.json > ? (for GA), > 0 (for IA) */}
            <td>
              Satisfies Rough Proportionality (number of effective districts
              proportional to demographics)
            </td>
            <td>{data.FALSE[1]}</td>
            <td>{data.TRUE[1]}</td>
          </tr>
          <tr>
            <td>Satisfies both conditions above, jointly</td>
            <td>{data.FALSE[2]}</td>
            <td>{data.TRUE[2]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VraImpactThresholdTable;
