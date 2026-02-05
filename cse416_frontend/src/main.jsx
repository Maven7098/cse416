import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainNavbar from './Navbar.jsx'
import Map from './Map.jsx';
import geojsonDataIA from './IA-Congress-2022-shape.json'
import geojsonDataGA from './GA-Congress-2023-shape.json'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Show on all sites */}
    <MainNavbar />
    {/* Iowa (IA) - NonPreclearance */}
    <Map latitude={41.8780} longitude={-93.0977} geojsonData={geojsonDataIA} />
    {/* Georgia (GA) - Preclearance*/}
    <Map latitude={33.2478} longitude={-83.4411} geojsonData={geojsonDataGA} />
  </StrictMode>
)
