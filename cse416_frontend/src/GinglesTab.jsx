import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import GinglesMap from './GinglesMap';
import EIMap from './EIMap';
import './CustomTab.css'


function GinglesTab({activeState, activeRace, latitude, longitude}) {
  // Set Current State - Name, Latitude, Longitude
  // I have initially thought of setting this on the server
  // But why do we need to do that? Is the latitude or longitude important?
  
  
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
        </Col>
        <Col lg={true}>
          <Tab.Content>
            <Tab.Pane eventKey="gingles"><GinglesMap activeState={activeState} activeRace={activeRace} activeStateName={activeState.NAME} /></Tab.Pane>
            <Tab.Pane eventKey="ei"><EIMap activeState={activeState} activeRace={activeRace} latitude={latitude} longitude={longitude} activeStateName={activeState.NAME} /></Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
      </div>
    </Tab.Container>
  );
}


export default GinglesTab;