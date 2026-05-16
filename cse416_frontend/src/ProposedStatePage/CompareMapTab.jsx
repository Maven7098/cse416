import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import CompareChart from "./CompareChart.jsx";
import DatasetAbout from "./DatasetAbout.jsx"
import { useState, useEffect } from "react";
import "../CSS/CustomTab.css";

import axios from "axios";

function CompareMapTab({ activeState, activeRace, currentRace, mode: currentMode}) {
  const [currentCount, setCurrentCount] = useState("4096");
  const [currentThreshold, setCurrentThreshold] = useState("High");
  const [vraImpactThresholdTable, setVraImpactThresholdTable] = useState(null);
  const [compareBoxandWhiskerData, setCompareBoxandWhiskerData] = useState("");
  const [compareHistogram, setCompareHistogram] = useState("");

  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/compare?currentState=${activeState}&currentMode=${currentMode}&count=${currentCount}&threshold=${currentThreshold}`,
      )
      .then((response) => {
        setVraImpactThresholdTable(response.data[0]);
        setCompareBoxandWhiskerData(response.data[1]);
        setCompareHistogram(response.data[2]);
      })
      .catch((error) => console.log(error.response?.data ?? error.message));
    // If Active State changes, then also reset districtData
    // setDistrictGeoJsonData("");
  }, [activeState, currentMode, currentCount, currentThreshold]);

  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  let currentVraImpactThresholdData = null;
  switch (activeRace) {
    case "HISPANIC":
      currentVraImpactThresholdData = vraImpactThresholdTable?.Hispanic
      break;
    case "BLACK":
      currentVraImpactThresholdData = vraImpactThresholdTable?.Black
      break;
    case "ASIAN":
      currentVraImpactThresholdData = vraImpactThresholdTable?.Asian
      break;
    case "WHITE":
      currentVraImpactThresholdData = vraImpactThresholdTable?.White
      break;
  }
  const currentCompareBoxandWhiskerData = compareBoxandWhiskerData?.[activeRace];
  const currentCompareHistogramData = compareHistogram?.[activeRace];

  console.log(currentVraImpactThresholdData)

  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="info" fluid>
      <div className="stateinfo-main-content">
        <Row>
          <Col lg="auto">
            <Nav variant="pills" className="flex-column stateinfo-tabs">
              <NavDropdown title="Select Dataset">
                    <NavDropdown.Item onClick={() => {setCurrentCount(256); setCurrentThreshold("Low")}}>
                      256_Low
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => {setCurrentCount(256); setCurrentThreshold("Medium")}}>
                      256_Medium
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => {setCurrentCount(256); setCurrentThreshold("High")}}>
                      256_High
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => {setCurrentCount(4096); setCurrentThreshold("Low")}}>
                      4096_Low
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => {setCurrentCount(4096); setCurrentThreshold("Medium")}}>
                      4096_Medium
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => {setCurrentCount(4096); setCurrentThreshold("High")}}>
                      4096_High
                    </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Col>
          <Col lg={true}>
            <Tab.Content>
              <Tab.Pane eventKey="info">
                <CompareChart
                  currentCount={currentCount}
                  currentRace={currentRace}
                  currentVraImpactThresholdData={currentVraImpactThresholdData}
                  currentCompareBoxandWhiskerData={currentCompareBoxandWhiskerData}
                  currentCompareHistogramData={currentCompareHistogramData}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="about">
                <DatasetAbout />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </div>
    </Tab.Container>
  );
}

export default CompareMapTab;
