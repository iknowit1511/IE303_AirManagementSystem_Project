import React from 'react';
import { SlCalender } from "react-icons/sl";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { AiOutlineMessage } from "react-icons/ai";


const homes = [
  {
    image: 'src/assets/explore/ho1.webp',
    name: 'Aparthotel Stare Miasto',
    location: 'Old Town, Poland, Kraków',
    rating: 8.8,
    label: 'Fabulous',
    reviews: 3251,
    price: 'VND 7,303,391',
  },
  {
    image: 'src/assets/explore/ho2.webp',
    name: 'Leman Locke',
    location: 'Tower Hamlets, United Kingdom, London',
    rating: 8.7,
    label: 'Fabulous',
    reviews: 708,
    price: 'VND 6,533,033',
  },
  {
    image: 'src/assets/explore/ho3.webp',
    name: 'Cheval Three Quays at The Tower of London',
    location: 'City of London, United Kingdom, London',
    rating: 9.4,
    label: 'Superb',
    reviews: 757,
    price: 'VND 11,285,288',
  },
  {
    image: 'src/assets/explore/ho4.webp',
    name: 'The Apartments by The Sloane Club',
    location: 'Kensington and Chelsea, United Kingdom, London',
    rating: 9.1,
    label: 'Superb',
    reviews: 245,
    price: 'VND 16,850,660',
  },
];

export default function HomesGuestsLove() {
  return (
    <div className="homes-guests-love">
      <div className="header">
        <h2>Homes guests love</h2>
      </div>
      <div className="home-list">
        {homes.map((item, index) => (
          <div className="home-card" key={index}>
            <img src={item.image} alt={item.title} className="property-image" />
            <div className="home-info">
              <h4>{item.name}</h4>
              <p>{item.location}</p>
              <div className="rating">
                <span className="score">{item.rating}</span>
                <span>{item.label}</span>
                <span>{item.reviews} reviews</span>
              </div>
              <div className="price">Starting from <strong>{item.price}</strong></div>
            </div>
          </div>
        ))}
      </div>
      <div className="benefits">
        <div className="benefit">
          <div className="icon"><SlCalender/></div>
          <div>
            <strong>Book now, pay at the property</strong>
            <p>FREE cancellation on most rooms</p>
          </div>
        </div>
        <div className="benefit">
          <div className="icon"> <TbBuildingSkyscraper/> </div>
          <div>
            <strong>2+ million properties worldwide</strong>
            <p>Hotels, guest houses, apartments, and more…</p>
          </div>
        </div>
        <div className="benefit">
          <div className="icon"> <AiOutlineMessage/></div>
          <div>
            <strong>Trusted customer service you can rely on, 24/7</strong>
            <p>We’re always here to help</p>
          </div>
        </div>
      </div>
    </div>
  );
}
