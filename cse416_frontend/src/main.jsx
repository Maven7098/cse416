import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BasicExample from './Base.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BasicExample />
  </StrictMode>
)
