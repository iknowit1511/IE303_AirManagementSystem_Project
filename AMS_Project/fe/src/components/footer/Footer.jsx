import React from 'react'

import Logo from '../../assets/logo.png'
import { TiSocialFacebook } from "react-icons/ti";
import { RiTwitterXFill } from "react-icons/ri";
import { AiFillYoutube } from "react-icons/ai";
import { FaPinterestP } from "react-icons/fa";

import Aos from 'aos';
import 'aos/dist/aos.css';

const Footer = () => {

  return (
    <div className='footer'>

      <div className="sectionContainer container grid">

        <div className="gridOne">
          <div className="logoDiv">
            <img src={Logo} className='Logo'/>
          </div>
          <p>Your mind should be stronger than your feelings, fly!</p>
          <div className="socialIcon flex">
            <TiSocialFacebook className='icon'/>
            <RiTwitterXFill className='icon'/>
            <AiFillYoutube className='icon'/>
            <FaPinterestP className='icon'/>
          </div>
        </div>

        <div className="footerLink">
          <span className='linkTitle'>Information</span>
          <li>
            <a href="">Home</a>
          </li>
          <li>
            <a href="">Explore</a>
          </li>
          <li>
            <a href="">Flight status</a>
          </li>
          <li>
            <a href="">Travel</a>
          </li>
          <li>
            <a href="">Check-in</a>
          </li>
          <li>
            <a href="">Manage your booking</a>
          </li>
        </div>

        <div className="footerLink">
          <span className='linkTitle'>Quick Guide</span>
          <li>
            <a href="">FAQ</a>
          </li>
          <li>
            <a href="">How to</a>
          </li>
          <li>
            <a href="">Features</a>
          </li>
          <li>
            <a href="">Baggage</a>
          </li>
          <li>
            <a href="">Route map</a>
          </li>
          <li>
            <a href="">Our communities</a>
          </li>
        </div>

        <div className="footerLink">
          <span className='linkTitle'>Information</span>
          <li>
            <a href="">Chauffuer</a>
          </li>
          <li>
            <a href="">Our partners</a>
          </li>
          <li>
            <a href="">Destination</a>
          </li>
          <li>
            <a href="">Careers</a>
          </li>
          <li>
            <a href="">Transportation</a>
          </li>
          <li>
            <a href="">Programme rules</a>
          </li>
        </div>

      </div>

      <div className="copyrightDiv flex">
        <p>JK Travel @ 2025. All rights reserved.</p>
      </div>

    </div>
  )
}

export default Footer
Footer