import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import StateInfo from "./StateInfo.jsx";
import StateHeatmap from "./StateHeatmap.jsx";
import { useState } from "react";
import "../CSS/CustomTab.css";

function MapTab({ activeState, activeRace, currentRace, latitude, longitude }) {
  const [currentMode, setCurrentMode] = useState("District");

  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="info" fluid>
      <div className="stateinfo-main-content">
        <Row>
          <Col lg="auto">
            <Nav variant="pills" className="flex-column stateinfo-tabs">
              <NavDropdown title={`Select Display Mode`}>
                <NavDropdown.Item onClick={() => setCurrentMode("District")}>
                  District Map
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => setCurrentMode("Precinct")}>
                  Precinct Heatmap
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => setCurrentMode("Census Block")}
                >
                  Census Block Heatmap
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Col>
          <Col lg={true}>
            <Tab.Content>
              <Tab.Pane eventKey="info">
                <StateInfo
                  activeState={activeState}
                  activeRace={activeRace}
                  currentMode={currentMode}
                  currentRace={currentRace}
                  latitude={latitude}
                  longitude={longitude}
                />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </div>
    </Tab.Container>
  );
}

export default MapTab;
