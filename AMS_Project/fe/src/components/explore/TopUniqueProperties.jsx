import React from 'react';

const properties = [
  {
    image: 'src/assets/explore/uni1.webp',
    name: 'Domki Wierszyki Shelters',
    location: 'Poland, Zakopane',
    rating: 9.7,
    label: 'Exceptional',
    reviews: 90,
  },
  {
    image: 'src/assets/explore/uni2.webp',
    name: 'Tiny House Dreischwesternherz',
    location: 'Germany, Trier',
    rating: 9.6,
    label: 'Exceptional',
    reviews: 147,
  },
  {
    image: 'src/assets/explore/uni3.webp',
    name: 'Das rote Haus hinterm Deich',
    location: 'Germany, Simonsberg',
    rating: 9.3,
    label: 'Superb',
    reviews: 45,
  },
  {
    image: 'src/assets/explore/uni4.webp',
    name: 'Agriturismo Caberle',
    location: 'Italy, Santorso',
    rating: 9.5,
    label: 'Exceptional',
    reviews: 276,
  },
];

export default function TopUniqueProperties() {
  return (
    <div className="top-unique-properties">
      <h2>Stay at our top unique properties</h2>
      <p>From castles and villas to boats and igloos, we’ve got it all</p>
      <div className="property-list">
        {properties.map((item, index) => (
          <div className="property-card" key={index}>
            <img src={item.image} alt={item.title} className="property-image" />
            <div className="property-info">
              <h4>{item.name}</h4>
              <p>{item.location}</p>
              <div className="rating">
                <span className="score">{item.rating}</span>
                <span>{item.label}</span>
                <span>{item.reviews} reviews</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
