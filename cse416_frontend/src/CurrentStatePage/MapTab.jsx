import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import StateInfo from './StateInfo.jsx';
import StateHeatmap from './StateHeatmap.jsx';
import '../CSS/CustomTab.css'


function MapTab({activeState, activeRace, latitude, longitude}) {
    return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="info" fluid>
      <div className="stateinfo-main-content">
      <Row>
        <Col lg={1}>
          <Nav variant="pills" className="flex-column stateinfo-tabs">
            <Nav.Item>
              <Nav.Link eventKey="info">State Summary</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="heatmap">State Heatmap</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col lg={true}>
          <Tab.Content>
            <Tab.Pane eventKey="info"><StateInfo activeState={activeState} latitude={latitude} longitude={longitude} /></Tab.Pane>
            <Tab.Pane eventKey="heatmap"><StateHeatmap activeState={activeState} activeRace={activeRace} latitude={latitude} longitude={longitude}  /></Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
      </div>
    </Tab.Container>
  );
}


export default MapTab;