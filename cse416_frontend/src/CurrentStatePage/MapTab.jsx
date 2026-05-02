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
  const [currentMode, setCurrentMode] = useState("Precinct");

  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="info" fluid>
      <div className="stateinfo-main-content">
        <Row>
          <Col lg="auto">
            <Nav variant="pills" className="flex-column stateinfo-tabs">
              <Nav.Item>
                <Nav.Link eventKey="info">State Summary</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="heatmap">State Heatmap</Nav.Link>
              </Nav.Item>
              <NavDropdown title={`Select Display Mode`}>
                <NavDropdown.Item onClick={() => setCurrentMode("Precinct")}>
                  Precinct
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => setCurrentMode("Census Block")}
                >
                  Census Block
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
                  currentRace={currentRace}
                  latitude={latitude}
                  longitude={longitude}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="heatmap">
                <StateHeatmap
                  activeState={activeState}
                  currentMode={currentMode}
                  activeRace={activeRace}
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
