import React, { useRef, useState } from 'react';
import { PiCity } from "react-icons/pi";
import { TbBeach } from "react-icons/tb";
import { MdDirectionsBike } from "react-icons/md";
import { IoIosFlower } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { PiBowlFood } from "react-icons/pi";
import { CiCircleChevLeft } from "react-icons/ci";
import { CiCircleChevRight } from "react-icons/ci";

const types = ['City', 'Beach', 'Outdoors', 'Relax', 'Romance', 'Food'];

const allDestinations = {
  City: [
    { name: "Ho Chi Minh City", distance: "10 km", img: "src/assets/explore/hcm.jpg" },
    { name: "Rach Gia", distance: "191 km", img: "src/assets/explore/rachgia.jpg" },
    { name: "Phan Rang", distance: "270 km", img: "src/assets/explore/phanrang.jpg" },
    { name: "Hoi An", distance: "592 km", img: "src/assets/explore/hoian.jpg" },
    { name: "Hue", distance: "636 km", img: "src/assets/explore/hue.jpg" },
    { name: "Dong Hoi", distance: "739 km", img: "src/assets/explore/donghoi.jpg" },
    { name: "Hanoi", distance: "1,138 km", img: "src/assets/explore/hn.jpg" },
    { name: "Lao Cai", distance: "1,328 km", img: "src/assets/explore/laocai.jpg" }
  ],
  Beach: [
    { name: "Nha Trang", distance: "1,200 km", img: "src/assets/explore/nt.jpg" },
    { name: "Phu Quoc", distance: "1,500 km", img: "src/assets/explore/beach_phuquoc.jpg" },
    { name: "Da Nang", distance: "1,000 km", img: "src/assets/explore/dn.jpg" },
    { name: "Vung Tau", distance: "100 km", img: "src/assets/explore/beach_vt.jpg" },
    { name: "Mui Ne", distance: "200 km", img: "src/assets/explore/muine.jpg" },
    { name: "Con Dao", distance: "1,200 km", img: "src/assets/explore/condao.jpg" },
    { name: "Cam Ranh", distance: "1,300 km", img: "src/assets/explore/camranh.jpg" },
    { name: "Quy Nhon", distance: "1,100 km", img: "src/assets/explore/quynhon.jpg" },
    { name: "Phan Thiet", distance: "200 km", img: "src/assets/explore/phanthiet.jpg" },
    { name: "Tuy Hoa", distance: "120 km", img: "src/assets/explore/tuyhoa.jpg" }
  ],
  Outdoors: [
    { name: "Da Lat", distance: "1,500 km", img: "src/assets/explore/dl.jpg" },
    { name: "Con Dao", distance: "1,200 km", img: "src/assets/explore/condao.jpg" },
    { name: "Phong Nha", distance: "1,000 km", img: "src/assets/explore/phongnha.jpg" },
    { name: "Ninh Binh", distance: "754 km", img: "src/assets/explore/ninhbinh.jpg" },
    { name: "Cat Ba", distance: "1,051 km", img: "src/assets/explore/catba.jpg" },
    { name: "Mai Chau", distance: "1,103 km", img: "src/assets/explore/maichau.jpg" },
    { name: "Ha Long", distance: "1,127 km", img: "src/assets/explore/halong.jpg" },
    { name: "Sa Pa", distance: "1,314 km", img: "src/assets/explore/sapa.jpg" }
  ],
  Relax: [
    { name: "Ke Ga", distance: "149 km", img: "src/assets/explore/kega.jpg" },
    { name: "Da Lat", distance: "234 km", img: "src/assets/explore/out_dl.jpg" },
    { name: "Con Dao", distance: "237 km", img: "src/assets/explore/out_condao.jpg" },
    { name: "Ninh Van Bay", distance: "399 km", img: "src/assets/explore/ninhvanbay.jpg" },
    { name: "Doc Let", distance: "342 km", img: "src/assets/explore/doclet.jpg" },
    { name: "Tuy Hoa", distance: "385 km", img: "src/assets/explore/tuyhoa.jpg" },
    { name: "Ninh Binh", distance: "1,051 km", img: "src/assets/explore/out_ninhbinh.jpg" },
    { name: "Mai Chau", distance: "1,107 km", img: "src/assets/explore/maichau.jpg" },
    { name: "Ha Long", distance: "1,127 km", img: "src/assets/explore/halong.jpg" }
  ],
  Romance: [
    { name: "Ke Ga", distance: "149 km", img: "src/assets/explore/kega.jpg" },
    { name: "Ho Chi Minh City", distance: "10 km", img: "src/assets/explore/hcm.jpg" },
    { name: "Da Lat", distance: "234 km", img: "src/assets/explore/dl.jpg" },
    { name: "Phan Rang", distance: "270 km", img: "src/assets/explore/phanrang.jpg" },
    { name: "Pleiku", distance: "382 km", img: "src/assets/explore/pleiku.jpg" },
    { name: "Tuy Hoa", distance: "385 km", img: "src/assets/explore/tuyhoa.jpg" },
    { name: "Hoi An", distance: "591 km", img: "src/assets/explore/hoian.jpg" },
    { name: "Hanoi", distance: "1,138 km", img: "src/assets/explore/hn.jpg" },
    { name: "Lao Cai", distance: "1,328 km", img: "src/assets/explore/laocai.jpg" }
  ],
  Food: [
    { name: "Ke Ga", distance: "149 km", img: "src/assets/explore/kega.jpg" },
    { name: "Can Tho", distance: "127 km", img: "src/assets/explore/ct.jpg" },
    { name: "Ho Chi Minh City", distance: "10 km", img: "src/assets/explore/hcm.jpg" },
    { name: "Chau Doc", distance: "165 km", img: "src/assets/explore/chaudoc.jpg" },
    { name: "Hoi An", distance: "592 km", img: "src/assets/explore/hoian.jpg" },
    { name: "Da Nang", distance: "608 km", img: "src/assets/explore/dn.jpg" },
    { name: "Hanoi", distance: "1,138 km", img: "src/assets/explore/hn.jpg" },
    { name: "Lao Cai", distance: "1,328 km", img: "src/assets/explore/laocai.jpg" },
  ]
};

const TripPlanner = () => {
  const [activeType, setActiveType] = useState('City');
  const scrollRef = useRef();

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth / 2;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="trip-planner">
      <h2>Quick and easy trip planner</h2>
      <p>Pick a vibe and explore the top destinations in Vietnam</p>
      <div className="filter-tabs">
        {types.map(type => (
          <button key={type} className={type === activeType ? 'active' : ''} onClick={() => setActiveType(type)}>
            {type}
          </button>
        ))}
      </div>
      <div className="carousel-wrapper">
        <button className="nav left" onClick={() => scroll('left')}>
            <CiCircleChevLeft />
        </button>
        <div className="carousel" ref={scrollRef}>
          {allDestinations[activeType].map((dest, i) => (
            <div className="card" key={i}>
              <img src={dest.img} alt={dest.name} />
              <h4>{dest.name}</h4>
              <p>{dest.distance} away</p>
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

export default TripPlanner;
