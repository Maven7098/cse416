import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link, Outlet} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

function MapNavbar({activeState, activeRace, setActiveRace}) {
  let activeStateName = ""
  let destination = ""

  // Set Current State - Name, Latitude, Longitude
  // I have initially thought of setting this on the server
  // But why do we need to do that? Is the latitude or longitude important?
  switch (activeState) {
    case 'ia': activeStateName="Iowa"; destination="iowa"; break;
    case 'ga': activeStateName="Georgia"; destination="georgia"; break;
  }

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
    <Navbar expand="lg" className="data-bs-theme-dark">
      <Container>
        <Navbar.Brand>{activeStateName}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={`/${destination}/proposed`}>
              Summary of Ensembles</Nav.Link>
            <Nav.Link as={Link} to={`/${destination}/proposed/vra`}>
              Proposed Districts with Voting Rights Act</Nav.Link>
              <Nav.Link as={Link} to={`/${destination}/proposed/nonvra`}>
              Proposed Districts with Race Blind Redistricting</Nav.Link>
            <Nav.Link as={Link} to={`/${destination}/proposed/compare`}>
              Compare Districts</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Outlet />
    </>
  );
}

export default MapNavbar;
