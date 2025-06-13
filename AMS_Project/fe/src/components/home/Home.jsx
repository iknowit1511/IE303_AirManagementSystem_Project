import React, {useEffect} from 'react'

import video from '../../assets/ams_video.mp4'
import plane from '../../assets/plane_3.png'

import Aos from 'aos'
import 'aos/dist/aos.css'


const Home = () => {
  useEffect(() => {
    Aos.init({duration: 2000})
  }, [])



  return (
    <div className='home flex container'>

      <div className="mainText">
        <h1  >Create Ever-lasting Memories With Us</h1>
      </div>

      <div  className="homeImages flex">
        <div className="videoDiv">
          <video src={video} autoPlay muted loop className='video'></video>
        </div>

        <img src={plane} className='plane'/>

      </div>

    </div>
  )
}

export default Home;
