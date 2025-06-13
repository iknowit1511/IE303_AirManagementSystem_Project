import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const FAQ = () => {
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleQuestion = (id) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqs = [
    {
      id: 1,
      question: "What is the best time to book a flight?",
      answer:
        "The best time to book a flight is typically 6-8 weeks before your travel date. Booking on weekdays, especially Tuesday or Wednesday, can also help you find better deals.",
    },
    {
      id: 2,
      question: "Can I change or cancel my flight booking?",
      answer:
        "Yes, most airlines allow changes or cancellations, but fees may apply depending on the ticket type and airline policy. Check the terms and conditions of your booking or contact customer support for assistance.",
    },
    {
      id: 3,
      question: "How can I find the cheapest flights?",
      answer:
        "To find the cheapest flights, be flexible with your travel dates, book in advance, and use fare comparison tools. Also, consider flying on less busy days like mid-week.",
    },
    {
      id: 4,
      question: "What documents do I need to board an international flight?",
      answer:
        "For international flights, you typically need a valid passport, visa (if required), and your boarding pass. Some destinations may also require proof of vaccination or a negative COVID-19 test.",
    },
  ];

  return (
    <div className="faq">
      <div className="faq-container">
        <h2>Frequently asked questions (FAQ)</h2>
        <p>Everything you need to know about booking flights</p>
        <div className="faq-list">
          {faqs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <div className="faq-question" onClick={() => toggleQuestion(faq.id)}>
                <h4>{faq.question}</h4>
                <button
                  className={`toggle-btn ${openQuestions[faq.id] ? "open" : ""}`}
                >
                  <FaChevronDown />
                </button>
              </div>
              <div
                className={`faq-answer ${openQuestions[faq.id] ? "open" : ""}`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;