// From https://galencasstevens.com/pagination-with-react-bootstrap/

import { useState } from 'react';
import PaginationHelper from './PaginationHelper.jsx';
import Table from 'react-bootstrap/Table';

function GinglesChart ({ data, race }) {
    // I guess a simple table will do?
    // total population, population by region type
    // (rural, urban, suburban), minority non-white population, average household
    // income, Republican votes, and Democratic votes

    // TODO Today: Pagination
    // Divide the charts by 15
    const linePerPage = 6;
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

  return (
    <div>
         <table width={"100%"} style={{fontSize:"smaller"}}>
            <thead>
            <tr>
                <th>ID</th>
                <th>Total Population</th>
                <th>Urban Population</th>
                <th>Suburban Population</th>
                <th>Rural Population</th>
                <th>Hispanic Population</th>
                <th>Black Population</th>
                <th>Asian Population</th>
                <th>White Population</th>
                <th>Household Income</th>
                <th>Democratic Votes</th>
                <th>Republican Votes</th>
            </tr>
            </thead>
            {
                paginatedData.map(function(precinct) {
                    return (
                        <tbody key={precinct.UNIQUE_ID}>
                        <tr>
                            <td>{precinct.UNIQUE_ID}</td>
                            <td>{precinct.TOTAL}</td>
                            <td>{precinct.URBAN}</td>
                            <td>{precinct.SUBURBAN}</td>
                            <td>{precinct.RURAL}</td>
                            {race == "HISPANIC" ? <td style={{fontWeight: "bold"}}>{precinct.HISPANIC}</td> : <td>{precinct.HISPANIC}</td>}
                            {race == "BLACK" ? <td style={{fontWeight: "bold"}}>{precinct.BLACK}</td> : <td>{precinct.BLACK}</td>}
                            {race == "ASIAN" ? <td style={{fontWeight: "bold"}}>{precinct.ASIAN}</td> : <td>{precinct.ASIAN}</td>}
                            <td>{precinct.WHITE}</td>
                            <td>{precinct.INCOME}</td>
                            <td>{precinct.DEMOCRATIC}</td>
                            <td>{precinct.REPUBLICAN}</td>
                        </tr>
                        </tbody>
                    )
                })
            }
        </table> 
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PaginationHelper
                paginate={paginate}
                active={activePage}
                totalPages={totalPages}
            />
		</div>
    </div>
  );
};

export default GinglesChart;