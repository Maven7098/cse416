import { Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap';
import Map from './Map';
import GinglesMap from './GinglesMap';
import EIMap from './EIMap';
import { useState } from 'react';


function MapTab({activeState}) {
  const [activeRace, setActiveRace] = useState("BLACK");

  let currentRace = "Black / African American"
  switch (activeRace) {
      case "HISPANIC":
        currentRace = "Hispanic / Latino"
        break;
      case "BLACK":
        currentRace = "Black / African American"
        break;
      case "ASIAN":
        currentRace = "Asian / Asian American"
        break;
    }

  return (
    <>
    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
      <h3 style={{margin: "0 0.5em"}}> Select Race: </h3>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic" variant='outline-secondary'>
          {currentRace}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setActiveRace("BLACK")}>Black / African American</Dropdown.Item>
          <Dropdown.Item onClick={() => setActiveRace("HISPANIC")}>Hispanic / Latino</Dropdown.Item>
          <Dropdown.Item onClick={() => setActiveRace("ASIAN")}>Asian / Asian American</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>

    <Tabs defaultActiveKey="info" id="uncontrolled-tab-example" fill>
      <Tab eventKey="info" title="State Information">
        <Map activeState={activeState} activeRace={activeRace} />
      </Tab>
      <Tab eventKey="gingles" title="Racial Polarization">
        <GinglesMap activeState={activeState} activeRace={activeRace} />
      </Tab>
      <Tab eventKey="ei" title="Ecological Inference">
        <EIMap activeState={activeState} activeRace={activeRace} />
      </Tab>
    </Tabs>
    </>
  );

}


export default MapTab;