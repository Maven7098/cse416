import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import GinglesMap from './GinglesMap';
import EIMap from './EIMap';
import './CustomTab.css'


function GinglesTab({activeState, activeRace}) {
  let activeStateName = ""
  let latitude=0;
  let longitude=0;

  // Set Current State - Name, Latitude, Longitude
  // I have initially thought of setting this on the server
  // But why do we need to do that? Is the latitude or longitude important?
  switch (activeState) {
      case 'ia': activeStateName="Iowa"; latitude=41.8780; longitude=-93.0977; break;
      case 'ga': activeStateName="Georgia"; latitude=33.2478; longitude=-83.4411; break;
    }
  
    return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="first" fluid>
      <Row>
        <Col lg={1}>
          <Nav variant="pills" className="flex-column">
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
            <Tab.Pane eventKey="gingles"><GinglesMap activeState={activeState} activeRace={activeRace} activeStateName={activeStateName} /></Tab.Pane>
            <Tab.Pane eventKey="ei"><EIMap activeState={activeState} activeRace={activeRace} latitude={latitude} longitude={longitude} activeStateName={activeStateName} /></Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}


export default GinglesTab;