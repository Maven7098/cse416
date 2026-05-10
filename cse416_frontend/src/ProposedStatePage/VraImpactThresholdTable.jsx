import { useState } from "react";
import "../CSS/GinglesTable.css";

function VraImpactThresholdTable({ data, count }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "1rem" }}>
        VRA Impact Threshold Table is not available yet.
      </div>
    );
  }
  return (
    // data has [vra_constrained_enacted, vra_constrained_proportionality, vra_constrained_both,
    // nonvra_constrained_enacted, nonvra_constrained_proportionality, nonvra_constrained_both]
    <div>
      <table className="fixed-table">
        <thead>
          <tr style={{textAlign: "left", fontSize: "medium"}}>
            <th>VRA Impact Threshold</th>
            <th>Race-Blind</th>
            <th>VRA-Constrainted</th>
          </tr>
        </thead>
        <tbody style={{textAlign: "right", fontSize: "large"}}>
          <tr>
            {/* Enacted Effectiveness: from effectiveness.json */}
            {/* Count effectiveness.json > 5 (for GA), > 0 (for IA) */}
            <td style={{textAlign: "left", fontSize: "medium"}}>
              Satisfies Enacted Effectiveness (number of effective districts in
              plan)
            </td>
            <td>{(data[3]/count*100).toFixed(3)}%</td>
            <td>{(data[0]/count*100).toFixed(3)}%</td>
          </tr>
          <tr>
            {/* Rough Proportionality: from effectiveness.json */}
            {/* (MinorityEffective/TotalDistrict) / (MinorityPopulation/TotalPopulation) */}
            {/* Count effectiveness.json > ? (for GA), > 0 (for IA) */}
            <td style={{textAlign: "left", fontSize: "medium"}}>
              Satisfies Rough Proportionality (number of effective districts
              proportional to demographics)
            </td>
            <td>{(data[4]/count*100).toFixed(3)}%</td>
            <td>{(data[1]/count*100).toFixed(3)}%</td>
          </tr>
          <tr>
            <td style={{textAlign: "left", fontSize: "medium"}}>
              Satisfies both conditions above, jointly</td>
            <td>{(data[5]/count*100).toFixed(3)}%</td>
            <td>{(data[2]/count*100).toFixed(3)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VraImpactThresholdTable;
