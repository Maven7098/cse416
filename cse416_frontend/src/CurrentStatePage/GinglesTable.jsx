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
  const linePerPage = 18;
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
            <tbody key={precinct.ID}>
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
                        alignContent: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
                        alignContent: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
                    {precinct.TOTAL}
                  </td>
                ) : (
                  <td>{precinct.TOTAL}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {precinct.HISPANIC}
                  </td>
                ) : race == "HISPANIC" ? (
                  <td style={{ fontWeight: "bold" }}>{precinct.HISPANIC}</td>
                ) : (
                  <td>{precinct.HISPANIC}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {precinct.BLACK}
                  </td>
                ) : race == "BLACK" ? (
                  <td style={{ fontWeight: "bold" }}>{precinct.BLACK}</td>
                ) : (
                  <td>{precinct.BLACK}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {precinct.ASIAN}
                  </td>
                ) : race == "ASIAN" ? (
                  <td style={{ fontWeight: "bold" }}>{precinct.ASIAN}</td>
                ) : (
                  <td>{precinct.ASIAN}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {precinct.WHITE}
                  </td>
                ) : (
                  <td>{precinct.WHITE}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {precinct.TOTAL_DEM}
                  </td>
                ) : (
                  <td>{precinct.TOTAL_DEM}</td>
                )}
                {activePrecinct === precinct ? (
                  <td
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {precinct.TOTAL_REP}
                  </td>
                ) : (
                  <td>{precinct.TOTAL_REP}</td>
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
