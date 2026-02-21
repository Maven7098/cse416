function GinglesChart ({ data }) {
    // I guess a simple table will do?
    // total population, population by region type
    // (rural, urban, suburban), minority non-white population, average household
    // income, Republican votes, and Democratic votes
  return (
    <div>
         <table>
            <tr>
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
            {
                data.map(function(precinct) {
                    return (
                        <tr key={precinct.ID}>
                            <td>{precinct.TOTAL}</td>
                            <td>{precinct.URBAN}</td>
                            <td>{precinct.SUBURBAN}</td>
                            <td>{precinct.RURAL}</td>
                            <td>{precinct.HISPANIC}</td>
                            <td>{precinct.BLACK}</td>
                            <td>{precinct.ASIAN}</td>
                            <td>{precinct.WHITE}</td>
                            <td>{precinct.INCOME}</td>
                            <td>{precinct.DEMOCRATIC}</td>
                            <td>{precinct.REPUBLICAN}</td>
                        </tr>
                    )
                })
            }
        </table> 
    </div>
  );
};

export default GinglesChart;