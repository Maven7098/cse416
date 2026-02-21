import { Tabs, Tab } from 'react-bootstrap';
import Map from './Map';
import GinglesMap from './GinglesMap';


function MapTab({activeState}) {

  return (

    <Tabs defaultActiveKey="info" id="uncontrolled-tab-example">

      <Tab eventKey="info" title="State Information">

        <Map activeState={activeState} />

      </Tab>

      <Tab eventKey="gingles" title="Racial Polarization">

        <GinglesMap activeState={activeState} />

      </Tab>

    </Tabs>

  );

}


export default MapTab;