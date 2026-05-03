import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import ProposedVRAInfo from "./ProposedVRAInfo.jsx";
// import ProposedVRAMap from "./ProposedVRAMap.jsx";
import DatasetAbout from "./DatasetAbout.jsx"
import { useState, useEffect } from "react";
import "../CSS/CustomTab.css";

import axios from "axios";

function MapTab({
  activeState,
  activeRace,
  currentRace,
  mode: currentMode,
  latitude,
  longitude,
}) {
  const [activeMap, setactiveMap] = useState("Precinct");
  const [currentCount, setCurrentCount] = useState("4096");
  const [currentThreshold, setCurrentThreshold] = useState("High");
  //const [districtGeoJsonData, setDistrictGeoJsonData] = useState("");
  const [ensembleSplitData, setEnsembleSplitData] = useState(null);
  const [boxandWhiskerData, setBoxandWhiskerData] = useState([]);
  const [minorityEffectivenessData, setMinorityEffectivenessData] = useState(
    [],
  );

  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/proposed?currentState=${activeState}&currentMode=${currentMode}&count=${currentCount}&threshold=${currentThreshold}`,
      )
      .then((response) => {
        setEnsembleSplitData(response.data[0]);
        setBoxandWhiskerData(response.data[1]);
        setMinorityEffectivenessData(response.data[2]);
      })
      .catch((error) => console.log(error.response?.data ?? error.message));
    // If Active State changes, then also reset districtData
    // setDistrictGeoJsonData("");
  }, [activeState, currentMode, currentCount, currentThreshold]);

  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="info" fluid>
      <div className="stateinfo-main-content">
        <Row>
          <Col lg="auto">
            <Nav variant="pills" className="flex-column stateinfo-tabs">
              <Nav.Item>
                <Nav.Link eventKey="info">State Summary</Nav.Link>
              </Nav.Item>
              {/* <Nav.Item>
                <Nav.Link eventKey="map">Interesting Maps</Nav.Link>
              </Nav.Item> */}
              <Nav.Item>
                <Nav.Link eventKey="about">About Datasets</Nav.Link>
              </Nav.Item>
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
              {/* <NavDropdown title="Select Map">
                {districtGeoJsonData != "" &&
                  districtGeoJsonData.map((item, index) => (
                    <NavDropdown.Item onClick={() => setactiveMap(item)}>
                      Map {index}
                    </NavDropdown.Item>
                  ))}
              </NavDropdown> */}
            </Nav>
          </Col>
          <Col lg={true}>
            <Tab.Content>
              <Tab.Pane eventKey="info">
                <ProposedVRAInfo
                  activeRace={activeRace}
                  currentRace={currentRace}
                  ensembleSplitData={ensembleSplitData}
                  boxandWhiskerData={boxandWhiskerData}
                  minorityEffectivenessData={minorityEffectivenessData}
                />
              </Tab.Pane>
              {/* <Tab.Pane eventKey="map">
                <ProposedVRAMap
                  activeState={activeState}
                  activeMap={activeMap}
                  activeRace={activeRace}
                  latitude={latitude}
                  longitude={longitude}
                />
              </Tab.Pane> */}
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

export default MapTab;
