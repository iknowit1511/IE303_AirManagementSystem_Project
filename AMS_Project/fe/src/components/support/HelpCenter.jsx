import React, { useState } from 'react';
import { TiMessages } from "react-icons/ti";
import { LuPhone } from "react-icons/lu";
import { IoBedOutline } from "react-icons/io5";
import { IoCarOutline } from "react-icons/io5";
import { CiPlane } from "react-icons/ci";
import { AiOutlineInsurance } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';


const faqData = {
  stays: [
    { question: "Cancellations", answer: "You can cancel your stay by going to your bookings." },
    { question: "Payment", answer: "We accept Visa, MasterCard, and PayPal." },
    { question: "Room types", answer: "You can choose from a variety of room types during booking." }
  ],
  flights: [
    { question: "Is there a fee to book flights?", answer: "Booking flights on our website is completely free; you only pay for the airline ticket fare." },
    { question: "How can I find cheap flights?", answer: "You should book early, be flexible with your travel dates, and compare prices from various airlines to find the best deals." },
    { question: "Can I change my flight date after booking?", answer: "Flight date changes depend on the airline's policy and the type of ticket you purchased. Change fees and fare differences may apply." },
    { question: "How do I receive my flight details?", answer: "After successful booking, detailed flight information (booking code, flight time, gate) will be sent to your email." },
    { question: "What documents do children need to fly?", answer: "Children need a birth certificate or passport. Depending on their age and airline regulations, an authorization letter may be required if they are not traveling with their parents." },
    { question: "Flight delays", answer: "If your flight is delayed, contact the airline for compensation." },
    { question: "Baggage rules", answer: "Each airline has its own baggage policy." }
  ],
  car: [
    { question: "What are the requirements for renting a car?", answer: "Typically, you'll need a valid driver's license, a credit card in your name, and you must meet the minimum age requirement (usually 21 or 25, depending on the rental company and country)." },
    { question: "Is insurance included with the car rental?", answer: "Basic liability insurance is often included, but it's recommended to check if additional coverage (e.g., collision damage waiver) is needed or offered." },
    { question: "Can I add an additional driver?", answer: "Yes, you can usually add an additional driver, but most companies charge an extra daily fee for this service. The additional driver must also meet the rental requirements." },
    { question: "What is your fuel policy?", answer: "Most rentals operate on a 'full-to-full' policy, meaning you pick up the car with a full tank and return it full. Options to pre-purchase fuel may also be available." },
    { question: "What if I return the car late?", answer: "Late returns can incur additional charges, often an extra day's rental fee, so it's best to return the car on time or notify the rental company in advance if you expect delays." }
  ],
  taxi: [
    { question: "How do I book an airport taxi?", answer: "You can book an airport taxi through our website, mobile app, or by calling our customer service hotline. Online booking allows you to pre-select your vehicle and payment method." },
    { question: "What if my flight is delayed?", answer: "We monitor flight arrival times, so if your flight is delayed, your driver will adjust the pick-up time accordingly. There are usually no extra charges for flight delays." },
    { question: "Where will I meet my driver at the airport?", answer: "For airport pickups, your driver will typically meet you at the arrivals hall with a sign displaying your name. Specific meeting instructions will be provided in your booking confirmation." },
    { question: "Are child seats available?", answer: "Yes, child and baby seats are available upon request. Please specify the age and number of children when making your booking so we can arrange appropriate seating." },
    { question: "Can I pay in cash?", answer: "Payment options vary, but typically you can pay by credit card online or directly to the driver, or pay in cash upon arrival at your destination." }
  ],
  insurance: [
    { question: "Do I need travel insurance?", answer: "While not mandatory, travel insurance is highly recommended. It provides coverage for unexpected events like trip cancellations, medical emergencies, lost luggage, and more, offering peace of mind." },
    { question: "When should I buy travel insurance?", answer: "It's best to purchase travel insurance as soon as you book your trip. This ensures you're covered for unforeseen events that might occur before your departure, such as trip cancellation due to illness." },
    { question: "What does travel insurance cover?", answer: "Coverage typically includes trip cancellation/interruption, medical emergencies, emergency evacuation, lost or delayed luggage, and sometimes even rental car excess or adventure sports. Specifics depend on your chosen policy." },
    { question: "Can I get coverage for pre-existing medical conditions?", answer: "Some policies offer coverage for pre-existing medical conditions, often with an additional premium or specific conditions. It's crucial to declare all conditions when applying for insurance." },
    { question: "How do I make a claim?", answer: "To make a claim, you'll generally need to contact your insurance provider as soon as possible, provide relevant documents (e.g., medical reports, police reports, receipts), and follow their specific claim process." }
  ],
  other: [
    { question: "Can I modify my booking after it's confirmed?", answer: "Most bookings can be modified, but terms and conditions vary by service type and provider. Check your booking confirmation or contact our support team for assistance." },
    { question: "How do I contact customer support?", answer: "Our customer support team is available via phone, email, and live chat. Visit our 'Contact Us' page for detailed contact information and operating hours." },
    { question: "Are my personal details safe?", answer: "We use advanced encryption and security measures to protect your personal and payment information. Your privacy is our top priority." }
  ]
};

const tabs = [
  { key: "stays", label: "Stays", icon: <IoBedOutline /> },
  { key: "car", label: "Car rentals", icon: <IoCarOutline /> },
  { key: "flights", label: "Flights", icon: <CiPlane /> },
  { key: "taxi", label: "Airport taxis", icon: <LuPhone/> },
  { key: "insurance", label: "Insurance", icon: <AiOutlineInsurance /> },
  { key: "other", label: "Other", icon: <BsThreeDots /> }
];

const HelpCenter = () => {
  const [selectedTab, setSelectedTab] = useState("stays");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = faqData[selectedTab] || [];

  return (
    <div>
        <Navbar />
    <div className="help-center">
              <div className="warning-box">
        <strong>Stay safe online</strong>
        <p>Protect your security by never sharing your personal or credit card info by phone, email, or chat.</p>
      </div>

      <h1>Welcome to the Help Centre</h1>
      <p className="subtext">We’re available 24/7</p>


      <div className="help-options">
          <div className="options-container">
            <div className="option">
            <h4> <TiMessages/> Send us a message</h4>
            <p>Contact our agents and we’ll reply as soon as possible.</p>
            </div>
            <div className="option">
            <h4> <LuPhone/> Call us</h4>
            <p>For anything urgent, call us anytime on a local or international phone number.</p>
            </div>
        </div>
        <button className="btn-signin">Sign in</button>
        <a href="#" className="continue-link">Continue without an account</a>
      </div>

      <div className="faq-section">
        <h2>Frequently asked questions</h2>
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={selectedTab === tab.key ? 'active' : ''}
              onClick={() => { setSelectedTab(tab.key); setOpenIndex(null); }}
            >
              {tab.icon}
              <span>{tab.label}</span> 
            </button>
          ))}
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div
                className="question"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.question}
                <span className="arrow-icon">
                  {openIndex === index ? (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7 10l5 5 5-5z"></path></svg> // Mũi tên xuống
                  ) : (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10 7l5 5-5 5z"></path></svg> // Mũi tên phải
                  )}
                </span>
              </div>
              {openIndex === index && <div className="answer">{faq.answer}</div>}
            </div>
          ))}
          {faqs.length === 0 && <div className="no-questions">No questions available in this category.</div>}
        </div>
      </div>
    </div>
        <Footer />
    </div>
  );
};

export default HelpCenter;
