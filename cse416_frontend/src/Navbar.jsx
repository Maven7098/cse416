import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link, Outlet, useLocation} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

function MainNavbar() {
  const location = useLocation();
  
  // Determine which state link should be active
  const isIowaActive = location.pathname.startsWith('/iowa') && !location.pathname.startsWith('/iowa/proposed');
  const isGeorgiaActive = location.pathname.startsWith('/georgia') && !location.pathname.startsWith('/georgia/proposed');
  const isIowaEnsembleActive = location.pathname.startsWith('/iowa/proposed');
  const isGeorgiaEnsembleActive = location.pathname.startsWith('/georgia/proposed');
  
  return (
    <div className="navbar-wrapper">
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid className="px-0">
          <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
            <Nav className="mx-auto">
              {/* onClick, change the latitude, longitude, geojsonData values */}
              <Nav.Link as={Link} className={isIowaActive ? 'active nav-link' : 'nav-link'} to="/iowa">
                NonPreclearanceState (Iowa - IA)</Nav.Link>
              <Nav.Link as={Link} className={isGeorgiaActive ? 'active nav-link' : 'nav-link'} to="/georgia">
                PreclearanceState (Georgia - GA)</Nav.Link>
                <Nav.Link as={Link} className={isIowaEnsembleActive ? 'active nav-link' : 'nav-link'} to="/iowa/proposed/vra">
                NonPreclearanceState (Iowa - IA) - District Ensembles</Nav.Link>
              <Nav.Link as={Link} className={isGeorgiaEnsembleActive ? 'active nav-link' : 'nav-link'} to="/georgia/proposed/vra">
                PreclearanceState (Georgia - GA) - District Ensembles</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default MainNavbar;
