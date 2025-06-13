import React, { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const menuItems = [
  'About JK Travel™',
  'Legal',
  'Digital Services Act',
  'Digital Markets Act',
  'Terms & Conditions',
  'How we work'
];

const contentData = {
  0: {
    title: 'About JK Travel™',
    paragraphs: [
        `JK Travel™ is a leading online travel agency that connects travelers with a wide range of accommodation options, from hotels to vacation rentals. Our mission is to make travel accessible and enjoyable for everyone, offering a user-friendly platform that simplifies the booking process.`,
        `With a commitment to customer satisfaction, we provide comprehensive travel solutions, including flight bookings, car rentals, and personalized travel experiences. Our team works tirelessly to ensure that every journey is memorable and hassle-free.`
    ]
  },
  1: {
    title: 'Legal Information',
    paragraphs: [
      `This section provides important legal information regarding the use of Booking.com services. It covers various aspects such as data privacy, intellectual property rights, and compliance with international laws.`,
      `Users are encouraged to review these legal documents carefully to understand their rights and obligations when interacting with our platform. Our commitment is to operate transparently and in accordance with applicable regulations.`
    ]
  },
  2: {
    title: 'Digital Services Act (DSA)',
    paragraphs: [
      `The Digital Services Act (DSA) is a landmark piece of legislation in the European Union that aims to create a safer and more accountable online environment. Booking.com is committed to complying with all requirements of the DSA to protect our users and ensure fair practices.`,
      `This includes measures related to content moderation, transparency in advertising, and mechanisms for users to report illegal content or activities. We continuously update our policies and systems to align with the DSA's evolving framework.`
    ]
  },
  3: {
    title: 'Digital Markets Act (DMA)',
    paragraphs: [
      `The Digital Markets Act (DMA) is an EU regulation designed to ensure fair and open digital markets by preventing large online platforms from abusing their market power. Booking.com supports initiatives that foster healthy competition and innovation in the digital travel sector.`,
      `We are actively working to adapt our operations and services to meet the requirements of the DMA, ensuring a level playing field for all participants in our marketplace.`
    ]
  },
  4: {
    title: 'Terms & Conditions',
    paragraphs: [
      `These Terms & Conditions govern your access to and use of the Booking.com platform and services. By accessing or using our services, you agree to be bound by these terms.`,
      `They cover important aspects such as booking procedures, payment policies, cancellation rules, user conduct, and dispute resolution. Please read them thoroughly before making any reservations or using our features.`
    ]
  },
  5: {
    title: 'How We Work',
    paragraphs: [
      `We strive to connect travelers with the best accommodation options and travel experiences worldwide. Our platform utilizes advanced technology to provide seamless search, booking, and management tools.`,
      `We work with a vast network of property partners, from independent hotels to major chains, ensuring a wide variety of choices for every type of traveler. Our business model is based on commissions from successful bookings, ensuring we only earn when you find the perfect stay.`
    ]
  },
};

export default function AboutPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentContent = contentData[activeIndex] || { title: 'Content Not Found', paragraphs: ['The content for this section is not available yet.'] };

  return (
    <div className="about-page-container">
    <Navbar />
    <div className="about-page">
      <div className="sidebar">
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={activeIndex === index ? 'active' : ''}
              onClick={() => setActiveIndex(index)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="content">
        <h2>{currentContent.title}</h2>
        {currentContent.paragraphs.map((paragraph, pIndex) => (
          <p key={pIndex} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}
      </div>
    </div>
    </div>
  );
}
