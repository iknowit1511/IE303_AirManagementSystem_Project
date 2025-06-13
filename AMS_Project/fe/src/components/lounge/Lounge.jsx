import React from 'react'

import imgGrid from '../../assets/inside3.png'

import Aos from 'aos'
import 'aos/dist/aos.css'

const Lounge = () => {
  React.useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div className='lounge container section'>
      <div className="sectionContainer grid">

        <div  className="imgDiv">
          <img src={imgGrid}/>
        </div>

        <div className="textDiv">
          <h2 >Unaccompanied Minor Lounge</h2>

          <div className="grids gird">
            <div className="singleGrid">
              <span className='gridTitle'>Help through the airport</span>
              <p>We provide assistance through the airport, including check-in, security, and boarding.</p>
            </div>
            <div  className="singleGrid">
              <span className='gridTitle'>Care on the flight</span>
              <p>We provide assistance through the airport, including check-in, security, and boarding.</p>
            </div>
            <div  className="singleGrid">
              <span className='gridTitle'>Priority boarding</span>
              <p>We provide assistance through the airport, including check-in, security, and boarding.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Lounge;
