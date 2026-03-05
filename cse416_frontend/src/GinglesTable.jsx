// From https://galencasstevens.com/pagination-with-react-bootstrap/

import { useEffect, useState } from 'react';
import PaginationHelper from './PaginationHelper.jsx';
import './GinglesTable.css'

function GinglesTable ({ data, race, activePrecinct }) {
    // I guess a simple table will do?
    // total population, population by region type
    // (rural, urban, suburban), minority non-white population, average household
    // income, Republican votes, and Democratic votes

    // TODO Today: Pagination
    // Divide the charts by 15
    const linePerPage = 18;
    const lineCount = data.length;
    const totalPages = Math.ceil(lineCount / linePerPage);
    const [paginatedData, setPaginatedData] = useState(
		data.slice(0, linePerPage)
	);
    const [activePage, setActivePage] = useState(1);

    const paginate = (pageNumber) => {
		const startIndex = (pageNumber - 1) * linePerPage;
		const endIndex = pageNumber * linePerPage;
		setActivePage(pageNumber);
		setPaginatedData(data.slice(startIndex, endIndex));
	};

    useEffect (() => {
        const pageNumber = Math.ceil((activePrecinct ? activePrecinct : 1) / linePerPage);
        paginate(pageNumber)
    }, [activePrecinct])

  return (
    <div>
        <table className='fixed-table'>
            <thead>
            <tr>
                <th>Precinct ID</th>
                <th>Total Population</th>
                <th>Urban Population</th>
                <th>Suburban Population</th>
                <th>Rural Population</th>
                <th>Hispanic Population</th>
                <th>Black Population</th>
                <th>Asian Population</th>
                <th>White Population</th>
                <th>Democratic Votes</th>
                <th>Republican Votes</th>
            </tr>
            </thead>
            {
                paginatedData.map(function(precinct) {
                    return (
                        <tbody key={precinct.COUNT}>
                        <tr>
                            {activePrecinct === precinct.COUNT
                             ? <td style={{fontWeight: "bold"}}>
                                <div style={{height: "3em", alignContent:"center", overflow:"hidden", textOverflow: "ellipsis"}}>
                                {precinct.UNIQUE_ID}</div></td> : 
                                <td><div style={{height: "3em", alignContent:"center", overflow:"hidden", textOverflow: "ellipsis"}}>
                                {precinct.UNIQUE_ID}</div></td>}
                            {activePrecinct === precinct.COUNT
                             ? <td style={{fontWeight: "bold"}}>{precinct.TOTAL}</td> : <td>{precinct.TOTAL}</td>}
                            {activePrecinct === precinct.COUNT
                             ? <td style={{fontWeight: "bold"}}>{precinct.URBAN}</td> : <td>{precinct.URBAN}</td>}
                            {activePrecinct === precinct.COUNT
                             ? <td style={{fontWeight: "bold"}}>{precinct.SUBURBAN}</td> : <td>{precinct.SUBURBAN}</td>}
                            {activePrecinct === precinct.COUNT
                             ? <td style={{fontWeight: "bold"}}>{precinct.RURAL}</td> : <td>{precinct.RURAL}</td>}
                            {(race == "HISPANIC" || activePrecinct === precinct.COUNT)
                             ? <td style={{fontWeight: "bold"}}>{precinct.HISPANIC}</td> : <td>{precinct.HISPANIC}</td>}
                            {(race == "BLACK" || activePrecinct === precinct.COUNT)
                             ? <td style={{fontWeight: "bold"}}>{precinct.BLACK}</td> : <td>{precinct.BLACK}</td>}
                            {(race == "ASIAN" || activePrecinct === precinct.COUNT)
                             ? <td style={{fontWeight: "bold"}}>{precinct.ASIAN}</td> : <td>{precinct.ASIAN}</td>}
                            {activePrecinct === precinct.COUNT
                             ? <td style={{fontWeight: "bold"}}>{precinct.WHITE}</td> : <td>{precinct.WHITE}</td>}
                            {activePrecinct === precinct.COUNT
                             ? <td style={{fontWeight: "bold"}}>{precinct.DEMOCRATIC}</td> : <td>{precinct.DEMOCRATIC}</td>}
                            {activePrecinct === precinct.COUNT
                             ? <td style={{fontWeight: "bold"}}>{precinct.REPUBLICAN}</td> : <td>{precinct.REPUBLICAN}</td>}
                        </tr>
                        </tbody>
                    )
                })
            }
        </table>
        <p></p>
        <div className="gingles-pagination" style={{ display: 'flex', justifyContent: 'center' }}>
            <PaginationHelper
                paginate={paginate}
                active={activePage}
                totalPages={totalPages}
            />
		</div>
    </div>
  );
};

export default GinglesTable;