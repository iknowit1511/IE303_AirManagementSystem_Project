import React, { useRef } from 'react';
import { CiCircleChevLeft } from "react-icons/ci";
import { CiCircleChevRight } from "react-icons/ci";

const types = [
  { name: 'Hotels', img: 'src/assets/explore/hotels.jpeg' },
  { name: 'Apartments', img: 'src/assets/explore/apartments.jpeg' },
  { name: 'Resorts', img: 'src/assets/explore/resorts.jpeg' },
  { name: 'Villas', img: 'src/assets/explore/villas.jpeg' },
  { name: 'Cabins', img: 'src/assets/explore/cabins.jpeg' },
  { name: 'Cottages', img: 'src/assets/explore/cottages.jpeg' },
  { name: 'Serviced Apartments', img: 'src/assets/explore/sa.jpeg' },
  { name: 'Hostels', img: 'src/assets/explore/hostels.jpeg' },
  { name: 'Bed & Breakfasts', img: 'src/assets/explore/bb.jpeg' },
  { name: 'Boutique Hotels', img: 'src/assets/explore/guest.jpeg' },
  { name: 'Luxury Hotels', img: 'src/assets/explore/lux.jpeg' },
  { name: 'Budget Hotels', img: 'src/assets/explore/budget.jpeg' }
];

const BrowseByType = () => {
  const scrollRef = useRef();

  const scroll = (dir) => {
    const el = scrollRef.current;
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="browse-by-type">
      <h2>Browse by property type</h2>
      <div className="carousel-wrapper">
        <button className="nav left" onClick={() => scroll('left')}>
                    <CiCircleChevLeft />
                </button>
        <div className="carousel" ref={scrollRef}>
          {types.map((type, i) => (
            <div className="card" key={i}>
              <img src={type.img} alt={type.name} />
              <h4>{type.name}</h4>
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

export default BrowseByType;
