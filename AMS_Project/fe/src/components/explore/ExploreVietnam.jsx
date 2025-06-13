import React, { useRef } from 'react';
import { CiCircleChevLeft } from "react-icons/ci";
import { CiCircleChevRight } from "react-icons/ci";


const data = [
  { name: "Ho Chi Minh City", properties: "6,127", img: "src/assets/explore/hcm.jpg" },
  { name: "Da Nang", properties: "2,030", img: "src/assets/explore/dn.jpg" },
  { name: "Vung Tau", properties: "2,151", img: "src/assets/explore/vt.jpg" },
  { name: "Hanoi", properties: "5,260", img: "src/assets/explore/hn.jpg" },
  { name: "Da Lat", properties: "1,857", img: "src/assets/explore/dl.jpg" },
  { name: "Nha Trang", properties: "1,061", img: "src/assets/explore/nt.jpg" },
  { name: "Hue", properties: "593", img: "src/assets/explore/hue.jpg" },
  { name: "Can Tho", properties: "586", img: "src/assets/explore/ct.jpg" },
  { name: "Hoi An", properties: "1,015", img: "src/assets/explore/hoian.jpg" },
  { name: "Ninh Binh", properties: "593", img: "src/assets/explore/ninhbinh.jpg" },
];

const ExploreVietnam = () => {
  const scrollRef = useRef();

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth / 2;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="explore-vietnam">
      <h2>Explore Vietnam</h2>
      <p>These popular destinations have a lot to offer</p>
      <div className="carousel-wrapper">
        <button className="nav left" onClick={() => scroll('left')}>
            <CiCircleChevLeft />
        </button>
        <div className="carousel" ref={scrollRef}>
          {data.map((place, i) => (
            <div className="card" key={i}>
              <img src={place.img} alt={place.name} />
              <h4>{place.name}</h4>
              <p>{place.properties} properties</p>
            </div>
          ))}
        </div>
        <button className="nav right" onClick={() => scroll('right')}>
            <CiCircleChevRight />
        </button>
      </div>
    </div>
  );
};

export default ExploreVietnam;
