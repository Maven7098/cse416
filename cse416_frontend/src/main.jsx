import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BasicExample from './Base.jsx'
import Map from './Map.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BasicExample />
    <Map />
  </StrictMode>
)
