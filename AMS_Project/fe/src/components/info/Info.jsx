import React from 'react'

import { RxCalendar } from 'react-icons/rx';
import { BsShieldCheck } from "react-icons/bs";
import { BsBookmarkCheck } from "react-icons/bs";

import Aos from 'aos';
import 'aos/dist/aos.css';

const Info = () => {
  React.useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div className='info section'>
      <div className="infoContainer container">

        <div className="titleDiv flex">
          <h2  >Travel to make memories all around the world</h2>
          <button className='btn'>
            View All
          </button>
        </div>

        <div className="cardDiv grid">
          
          <div   className="singleCard grid">
            <div className="iconDiv flex">
              <RxCalendar className='icon' />
            </div>
            <span className='cardTitle'>Book & Relax </span>
            <p>You can also call airlines from your phone and book a flight trip</p>
          </div>

          <div   className="singleCard grid">
            <div className="iconDiv flex colorOne">
              <BsShieldCheck className='icon' />
            </div>
            <span className='cardTitle'>Smart checklist </span>
            <p>We provide you with a smart checklist to help you pack your bags</p>
          </div>

          <div  className="singleCard grid">
            <div className="iconDiv flex colorTwo">
              <BsBookmarkCheck className='icon' />
            </div>
            <span className='cardTitle'>Save more</span>
            <p>Save more by booking your flight and hotel together</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Info;
