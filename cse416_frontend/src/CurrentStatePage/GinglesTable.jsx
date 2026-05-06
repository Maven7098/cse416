// From https://galencasstevens.com/pagination-with-react-bootstrap/

import { useEffect, useState } from "react";
import PaginationHelper from "../Chart/PaginationHelper.jsx";
import "../CSS/GinglesTable.css";

function GinglesTable({ data, race, activePrecinct }) {
  // I guess a simple table will do?
  // total population, population by region type
  // (rural, urban, suburban), minority non-white population, average household
  // income, Republican votes, and Democratic votes

  // TODO Today: Pagination
  // Divide the charts by 15
  const linePerPage = 20;
  const lineID = data.length;
  const totalPages = Math.ceil(lineID / linePerPage);
  const [paginatedData, setPaginatedData] = useState(
    data.slice(0, linePerPage),
  );
  const [activePage, setActivePage] = useState(1);

  const paginate = (pageNumber) => {
    const startIndex = (pageNumber - 1) * linePerPage;
    const endIndex = pageNumber * linePerPage;
    setActivePage(pageNumber);
    setPaginatedData(data.slice(startIndex, endIndex));
  };

  useEffect(() => {
    const pageNumber = Math.ceil(
      (activePrecinct ? data.indexOf(activePrecinct) : 1) / linePerPage,
    );
    paginate(pageNumber);
  }, [activePrecinct]);

  return (
    <div>
      <table className="fixed-table">
        <thead>
          <tr>
            <th>Precinct ID</th>
            <th>Total Population</th>
            <th>Hispanic Population</th>
            <th>Black Population</th>
            <th>Asian Population</th>
            <th>White Population</th>
            <th>Democratic Votes</th>
            <th>Republican Votes</th>
          </tr>
        </thead>
        {paginatedData.map(function (precinct) {
          return (
            <tbody key={precinct.ID} style={{textAlign: "right", fontSize: "small"}}>
              <tr>
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    <div
                      style={{
                        height: "3em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                        fontSize: "x-small"
                      }}
                    >
                      {precinct.ID}
                    </div>
                  </td>
                ) : (
                  <td>
                    <div
                      style={{
                        height: "3em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                        fontSize: "x-small"
                      }}
                    >
                      {precinct.ID}
                    </div>
                  </td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {Number(precinct.TOTAL).toLocaleString()}
                  </td>
                ) : (
                  <td>{Number(precinct.TOTAL).toLocaleString()}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {Number(precinct.HISPANIC).toLocaleString()}
                  </td>
                ) : race == "HISPANIC" ? (
                  <td style={{ fontWeight: "bold" }}>{Number(precinct.HISPANIC).toLocaleString()}</td>
                ) : (
                  <td>{Number(precinct.HISPANIC).toLocaleString()}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {Number(precinct.BLACK).toLocaleString()}
                  </td>
                ) : race == "BLACK" ? (
                  <td style={{ fontWeight: "bold" }}>{Number(precinct.BLACK).toLocaleString()}</td>
                ) : (
                  <td>{Number(precinct.BLACK).toLocaleString()}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {Number(precinct.ASIAN).toLocaleString()}
                  </td>
                ) : race == "ASIAN" ? (
                  <td style={{ fontWeight: "bold" }}>{Number(precinct.ASIAN).toLocaleString()}</td>
                ) : (
                  <td>{Number(precinct.ASIAN).toLocaleString()}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {Number(precinct.WHITE).toLocaleString()}
                  </td>
                ) : (
                  <td>{Number(precinct.WHITE).toLocaleString()}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {Number(precinct.TOTAL_DEM).toLocaleString()}
                  </td>
                ) : (
                  <td>{Number(precinct.TOTAL_DEM).toLocaleString()}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {Number(precinct.TOTAL_REP).toLocaleString()}
                  </td>
                ) : (
                  <td>{Number(precinct.TOTAL_REP).toLocaleString()}</td>
                )}
              </tr>
            </tbody>
          );
        })}
      </table>
      <p></p>
      <div
        className="gingles-pagination"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <PaginationHelper
          paginate={paginate}
          active={activePage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

export default GinglesTable;
