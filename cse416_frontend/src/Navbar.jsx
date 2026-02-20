import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link, Outlet} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

function MainNavbar({setActiveState}) {
  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* onClick, change the latitude, longitude, geojsonData values */}
            <Nav.Link as={Link} to="/iowa">
              NonPreclearanceState (Iowa - IA)</Nav.Link>
            <Nav.Link as={Link} to="/georgia">
              PreclearanceState (Georgia - GA)</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Outlet />
    </>
  );
}

export default MainNavbar;
