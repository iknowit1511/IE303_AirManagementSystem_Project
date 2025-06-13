import React, { use } from 'react'

import Aos from 'aos'
import 'aos/dist/aos.css'

const Subcribers = () => {
  React.useEffect(() => {
    Aos.init({duration: 2000})
  }, [])

  return (
    <div className='subcribers section'>
      <div  className="sectionContainer container">
        <h2>Subcribe newsletters and get latest news!</h2>
        <div className="inputDiv flex">
          <input type="text" placeholder='Enter your email address'/>
          <button className='btn'>Subcribe</button>
        </div>
      </div>
    </div>
  )
}

export default Subcribers
Subcribers