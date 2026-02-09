import { Link, Outlet } from 'react-router'
import iowa from './assets/iowa.png'
import georgia from './assets/georgia.png'
import './Home.css'

function Home() {

  return (
    <>
      <h1>Select a State</h1>

      <div className="stateContainer">
        <Link to="/iowa">
            <div className="smallStateContainer">
                <img src={iowa} alt="Iowa (Non-Preclearance State)" />
                <p>Iowa (Non-Preclearance State)</p>
            </div>
        </Link>
        <Link to="/georgia">
            <div className="smallStateContainer">
                <img src={georgia} alt="Georgia (Preclearance State)" />
                <p>Georgia (Preclearance State)</p>
            </div>
        </Link>

        <Outlet />
      </div>
    </>
  )
}

export default Home
