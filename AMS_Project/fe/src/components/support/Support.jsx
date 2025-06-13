import React from 'react'

import gridImage from '../../assets/view.png'

import Aos from 'aos'
import 'aos/dist/aos.css'

const Support = () => {
  React.useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div className='support container section'>
      <div className="sectionContainer">

        <div className="titleDiv">
          <small>Travel support</small>
          <h2>Plan your travel with confidence!</h2>
          <p>Find help with booking and travels plan, see what to expect along the journey.</p>
        </div>

        <div className="infoDiv grid">
          <div className="textDiv grid">

            <div  className="singleInfo">
              <span className='numver'>01</span>
              <h4>Travel requirements</h4>
              <p>Check the latest travel requirements for your destination, including entry restrictions and health protocols.</p>
            </div>
            
            <div  className="singleInfo">
              <span className='numver colorOne'>02</span>
                <h4>Chauffer services at your arrival</h4>
                <p>Book a chauffeur service to pick you up from the airport and take you to your destination.</p>
            </div>

            <div className="singleInfo ">
              <span className='numver colorTwo'>03</span>
                <h4>Multirisk travel insurance</h4>
                <p>Get peace of mind with travel insurance that covers trip cancellations, medical emergencies, and more.</p>
            </div>

          </div>

          <div  className="imgDiv">
            <img src={gridImage}/>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Support;
