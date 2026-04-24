import { useEffect, useState } from 'react';
import '../CSS/GinglesTable.css'

function VraImpactThresholdTable ({ data, race, activePrecinct }) {
  return (
    <div>
        <table className='fixed-table'>
            <thead>
            <tr>
                <th>VRA Impact Threshold</th>
                <th>Race-Blind</th>
                <th>VRA-Constrainted</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        Satisfies Enacted Effectiveness
                        (number of effective districts in plan)
                    </td>
                    <td>{data.FALSE[0]}</td>
                    <td>{data.TRUE[0]}</td>
                </tr>
                <tr>
                    <td>
                        Satisfies Rough Proportionality
                        (number of effective districts proportional to demographics)
                    </td>
                    <td>{data.FALSE[1]}</td>
                    <td>{data.TRUE[1]}</td>
                </tr>
                <tr>
                    <td>
                        Satisfies both conditions above, jointly
                    </td>
                    <td>{data.FALSE[2]}</td>
                    <td>{data.TRUE[2]}</td>
                </tr>
            </tbody>
        </table>
    </div>
  );
};

export default VraImpactThresholdTable;