import React, { useRef } from 'react';
import { CiCircleChevLeft } from "react-icons/ci";
import { CiCircleChevRight } from "react-icons/ci";

const deals = [
  {
    name: 'The Luxury MAYS Hotel',
    location: 'Ho Chi Minh City, Vietnam',
    rating: 8.3,
    reviews: 278,
    tag: '',
    oldPrice: '1,090,000',
    newPrice: '1,701,000',
    nights: 2,
    img: 'src/assets/explore/mays.jpg'
  },
  {
    name: 'CĂN HỘ DU LỊCH NGHỈ DƯỠNG THE SÓNG...',
    location: 'Vung Tau, Vietnam',
    rating: 8.2,
    reviews: 37,
    tag: 'Getaway Deal',
    oldPrice: '3,700,000',
    newPrice: '2,220,000',
    nights: 2,
    img: 'src/assets/explore/mt.jpg'
  },
  {
    name: 'Arya Hotel Dalat',
    location: 'Da Lat, Vietnam',
    rating: 9.5,
    reviews: 433,
    tag: 'Genius',
    oldPrice: '1,897,018',
    newPrice: '948,509',
    nights: 2,
    img: 'src/assets/explore/arrya.jpg'
  },
  {
    name: 'CityHouse - El Pino Realm...',
    location: 'Ho Chi Minh City, Vietnam',
    rating: 9.2,
    reviews: 57,
    tag: 'Limited-time Deal',
    oldPrice: '8,000,000',
    newPrice: '4,080,000',
    nights: 2,
    img: 'src/assets/explore/ei.jpg'
  }
];

const DealsForWeekend = () => {
  const scrollRef = useRef();

  const scroll = (dir) => {
    const el = scrollRef.current;
    el.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' });
  };

  return (
    <div className="deals-for-weekend">
      <h2>Deals for the weekend</h2>
      <p>Save on stays for 6 June - 8 June</p>
      <div className="carousel-wrapper">
        <button className="nav left" onClick={() => scroll('left')}>
                    <CiCircleChevLeft />
                </button>
        <div className="carousel" ref={scrollRef}>
          {deals.map((deal, i) => (
            <div className="deal-card" key={i}>
              <img src={deal.img} alt={deal.name} />
              <div className="content">
                <h4>{deal.name}</h4>
                <div className="rating-tag">
                  <span className="rating">{deal.rating}</span>
                  <span className="review">Very good {deal.reviews} reviews</span>
                  {deal.tag && <span className="tag">{deal.tag}</span>}
                </div>
                <div className="price">
                  <span className="old">VND {deal.oldPrice}</span>
                  <span className="new">VND {deal.newPrice}</span>
                </div>
                <p className="nights">{deal.nights} nights</p>
              </div>
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

export default DealsForWeekend;
