import { useState, useEffect } from 'react'
import { Link, Outlet } from 'react-router'
import axios from 'axios';
import './Home.css'

function Home() {
  // Get the image of Iowa and Georgia states from server
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:3000/api/`)
      .then(response => setPlaces(response.data))
      .catch(error => console.log(error.response.data))
    }, []);

  return (
    <>
      <h1>Select a State</h1>

      <div className="stateContainer">
        <Link to="/iowa">
            <div className="smallStateContainer">
                <img src={places[0]} alt="Iowa (Non-Preclearance State)" />
                <p>Iowa (Non-Preclearance State)</p>
            </div>
        </Link>
        <Link to="/georgia">
            <div className="smallStateContainer">
                <img src={places[1]} alt="Georgia (Preclearance State)" />
                <p>Georgia (Preclearance State)</p>
            </div>
        </Link>

        <Outlet />
      </div>
    </>
  )
}

export default Home
