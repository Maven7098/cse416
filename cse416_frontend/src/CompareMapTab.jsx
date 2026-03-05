import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Dropdown from 'react-bootstrap/Dropdown';
import './CustomTab.css'
import CompareMap from './CompareMap.jsx';
import CompareChart from './CompareChart.jsx';
import { useState } from 'react';

const DEFAULT_COMPARE_MODE = "Select a Comparison Option";

function CompareMapTab({activeState, activeRace, latitude, longitude}) {
  // Set Current State - Name, Latitude, Longitude
  // I have initially thought of setting this on the server
  // But why do we need to do that? Is the latitude or longitude important?

  const [currentMode, setCurrentMode] = useState(DEFAULT_COMPARE_MODE);
  const needsSelection = currentMode === DEFAULT_COMPARE_MODE;
  
  // Close the item once clicked
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = (isOpen) => {
    setShowDropdown(isOpen);
  };

  const handleItemClick = () => {
    // Perform item-specific logic here
    setShowDropdown(false); // Manually close the dropdown after an item click
  };
  
    return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="map" fluid>
      <div className="compare-main-content">
      <Row>
        <Col lg={3}>
        <div className="compare-mode-dropdown-wrap" style={{display: 'flex', justifyContent: 'center'}}>
            <Dropdown className="compare-mode-dropdown" show={showDropdown} onToggle={toggleDropdown}>
              <Dropdown.Toggle
                id="dropdown-basic"
                className={`compare-mode-toggle ${needsSelection ? 'compare-mode-toggle-attention' : ''}`.trim()}
                variant='outline-secondary'
              >
              {currentMode}
              </Dropdown.Toggle>

              <Dropdown.Menu>
              <Dropdown.Item onClick={(e) => {setCurrentMode("Current / Proposed-VRA-Compliant"); e.stopPropagation(); handleItemClick()}}>
                Current / Proposed-VRA-Compliant</Dropdown.Item>
              <Dropdown.Item onClick={(e) => {setCurrentMode("Current / Proposed-Race-Blind"); e.stopPropagation(); handleItemClick()}
              }>Current / Proposed-Race-Blind</Dropdown.Item>
              <Dropdown.Item onClick={(e) => {setCurrentMode("Proposed-VRA-Compliant / Proposed-Race-Blind"); e.stopPropagation(); handleItemClick()}
              }>Proposed-VRA-Compliant / Proposed-Race-Blind</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="map">Compare Maps</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="chart">Compare Charts (Proposed Districts only)</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col lg={true}>
          <Tab.Content>
            <Tab.Pane eventKey="map"><CompareMap activeState={activeState} currentMode={currentMode} latitude={latitude} longitude={longitude}/></Tab.Pane>
            <Tab.Pane eventKey="chart"><CompareChart activeState={activeState} activeRace={activeRace} currentMode={currentMode} /></Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
      </div>
    </Tab.Container>
  );
}


export default CompareMapTab;