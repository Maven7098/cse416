import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

import GinglesMap from './GinglesMap';
import EIMap from './EIMap';
import '../CSS/CustomTab.css'
import { useState, useEffect } from 'react';
import axios from 'axios';


function GinglesTab({activeState, activeRace, latitude, longitude}) {
  // Set Current State - Name, Latitude, Longitude
  const [ginglesData, setGinglesData] = useState("");
  const [precinctGeoJsonData, setPrecinctGeoJsonData] = useState("");
  const [eiData, setEiData] = useState("");
  const [eiKdeData, setEiKdeData] = useState("");
  const [currentMode, setCurrentMode] = useState('D');

  // TODO Next: Get a Gingles Formula (pre-calculated) for each state from Mongo
    useEffect(() => {
        axios.get(`http://localhost:8080/polarization?currentState=${activeState}`)
        .then(response => {
          setGinglesData(response.data[0]);
          // setGinglesForumla(response.data[1]);
          setPrecinctGeoJsonData(response.data[1]);
          setEiData(response.data[2]);
          setEiKdeData(response.data[3]);
        })
        .catch(error => console.log(error.response?.data ?? error.message))
    }, [activeState]);

    return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="gingles" fluid>
      <div className="polarization-main-content">
      <Row>
        <Col lg={1}>
          <Nav variant="pills" className="flex-column polarization-tabs">
            <Nav.Item>
              <Nav.Link eventKey="gingles">Gingles</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ei">EI</Nav.Link>
            </Nav.Item>
          </Nav>
          <Dropdown>
            <Dropdown.Toggle id="select-mode">
              Select Party
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setCurrentMode('D')}>Democratic</Dropdown.Item>
              <Dropdown.Item onClick={() => setCurrentMode('R')}>Republican</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col lg={true}>
          <Tab.Content>
            <Tab.Pane eventKey="gingles"><GinglesMap ginglesData={ginglesData} activeRace={activeRace} /></Tab.Pane>
            <Tab.Pane eventKey="ei"><EIMap precinctGeoJsonData={precinctGeoJsonData} currentMode={currentMode} eiData={eiData} eiKdeData={eiKdeData} activeRace={activeRace} latitude={latitude} longitude={longitude} activeStateName={activeState.NAME} /></Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
      </div>
    </Tab.Container>
  );
}


export default GinglesTab;