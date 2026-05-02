import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import NavDropdown from 'react-bootstrap/NavDropdown'
import Dropdown from 'react-bootstrap/Dropdown'
import ProposedVRAMap from './ProposedVRAMap.jsx';
import ProposedVRAInfo from './ProposedVRAInfo.jsx';
import { useState, useEffect } from 'react';
import '../CSS/CustomTab.css'

import axios from 'axios';


function MapTab({activeState, activeRace, currentRace, currentMode, latitude, longitude}) {
    const [activeMap, setactiveMap] = useState("Precinct");

    const [districtGeoJsonData, setDistrictGeoJsonData] = useState("");
    const [ensembleSplitData, setEnsembleSplitData] = useState(null);
    const [boxandWhiskerData, setBoxandWhiskerData] = useState([]);
    const [minorityEffectivenessData, setMinorityEffectivenessData] = useState([]);

    // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
    useEffect(() => {
        axios.get(`http://localhost:8080/proposed?currentState=${activeState}&currentMode=${currentMode}`)
        .then(response => {
          const payload = Array.isArray(response.data) ? response.data : [];

          const districtPayload = payload[0] && typeof payload[0] === "object" ? payload[0] : "";
          let ensemblePayload = payload[1] && typeof payload[1] === "object" ? payload[1] : null;
          if (Array.isArray(ensemblePayload) && ensemblePayload.length > 0) {
            ensemblePayload = ensemblePayload[0];
          }
          // boxandWhiskerData and minorityEffectivenessData are 3 racial groups combined
          setDistrictGeoJsonData(districtPayload);
          setEnsembleSplitData(ensemblePayload && !Array.isArray(ensemblePayload) ? ensemblePayload : null);
          setBoxandWhiskerData(Array.isArray(payload[2]) ? payload[2] : []);
          setMinorityEffectivenessData(Array.isArray(payload[3]) ? payload[3] : []);
        })
        .catch(error => console.log(error.response?.data ?? error.message))
        // If Active State changes, then also reset districtData
        setDistrictGeoJsonData("")
    }, [activeState, currentMode]);

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
              <Nav.Link eventKey="map">Interesting Maps</Nav.Link>
            </Nav.Item>
            <NavDropdown title={`Select Map`}>

              {districtGeoJsonData != "" && districtGeoJsonData.map((item, index) => (
                <NavDropdown.Item onClick={() => setactiveMap(item)}>Map {index}</NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Col>
        <Col lg={true}>
          <Tab.Content>
            <Tab.Pane eventKey="info"><ProposedVRAInfo activeRace={activeRace} currentRace={currentRace} ensembleSplitData={ensembleSplitData} boxandWhiskerData={boxandWhiskerData} minorityEffectivenessData={minorityEffectivenessData} /></Tab.Pane>
            <Tab.Pane eventKey="map"><ProposedVRAMap activeState={activeState} activeMap={activeMap} activeRace={activeRace} latitude={latitude} longitude={longitude} /></Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
      </div>
    </Tab.Container>
  );
}


export default MapTab;