import React from 'react';
import { Link } from 'react-router-dom';

const floatingForms = [
  {
    title: "Contact Form",
    fields: [
      { label: "Name", type: "text" },
      { label: "Email", type: "email" },
      { label: "Message", type: "textarea" }
    ]
  },
  {
    title: "Event Registration",
    fields: [
      { label: "Full Name", type: "text" },
      { label: "Email", type: "email" },
      { label: "Attendees", type: "number" }
    ]
  },
  {
    title: "Customer Survey",
    fields: [
      { label: "Satisfaction", type: "rating" },
      { label: "Comments", type: "textarea" }
    ]
  },
  {
    title: "Job Application",
    fields: [
      { label: "Full Name", type: "text" },
      { label: "Email", type: "email" },
      { label: "Resume", type: "file" }
    ]
  },
  {
    title: "Feedback Form",
    fields: [
      { label: "Rating", type: "rating" },
      { label: "Feedback", type: "textarea" }
    ]
  },
  {
    title: "Quiz Form",
    fields: [
      { label: "Question 1", type: "radio" },
      { label: "Question 2", type: "radio" }
    ]
  },
  {
    title: "Order Form",
    fields: [
      { label: "Product", type: "select" },
      { label: "Quantity", type: "number" },
      { label: "Delivery Date", type: "date" }
    ]
  },
  {
    title: "Newsletter",
    fields: [
      { label: "Email", type: "email" },
      { label: "Frequency", type: "select" }
    ]
  },
  {
    title: "Support Ticket",
    fields: [
      { label: "Issue Type", type: "select" },
      { label: "Description", type: "textarea" },
      { label: "Priority", type: "radio" }
    ]
  },
  {
    title: "Product Review",
    fields: [
      { label: "Product", type: "select" },
      { label: "Rating", type: "rating" },
      { label: "Review", type: "textarea" }
    ]
  },
  {
    title: "Appointment",
    fields: [
      { label: "Date", type: "date" },
      { label: "Time", type: "time" },
      { label: "Service", type: "select" }
    ]
  },
  {
    title: "User Profile",
    fields: [
      { label: "Username", type: "text" },
      { label: "Avatar", type: "file" },
      { label: "Bio", type: "textarea" }
    ]
  }
];

const FloatingFormCard = ({ form, index }) => {
  // Distribute cards evenly around the entire page perimeter
  const totalCards = 12;
  const angle = (index / totalCards) * Math.PI * 2;
  const distance = 35; // Distance from center as percentage
  const centerOffsetX = 50;
  const centerOffsetY = 50;
  
  const baseX = centerOffsetX + distance * Math.cos(angle);
  const baseY = centerOffsetY + distance * Math.sin(angle);
  
  // Add randomness to prevent perfect circles
  const randomOffsetX = (Math.random() - 0.5) * 20;
  const randomOffsetY = (Math.random() - 0.5) * 20;
  
  const posX = Math.max(5, Math.min(95, baseX + randomOffsetX));
  const posY = Math.max(5, Math.min(95, baseY + randomOffsetY));
  
  return (
    <div
      className="absolute w-40 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg shadow-xl p-3 animate-float border border-blue-500 opacity-70 hover:opacity-90 transition-opacity"
      style={{
        top: `${posY}%`,
        left: `${posX}%`,
        animationDuration: `${8 + Math.random() * 8}s`,
        animationDelay: `${Math.random() * 3}s`,
      }}
    >
      <h3 className="text-xs font-bold text-blue-300 mb-2">{form.title}</h3>
      <div className="space-y-1">
        {form.fields.map((field, idx) => (
          <div key={idx} className="text-xs">
            <label className="block text-gray-300 font-medium mb-0.5 text-xs">{field.label}</label>
            {field.type === 'textarea' && (
              <div className="bg-gray-800 rounded h-5 border border-gray-600"></div>
            )}
            {field.type === 'file' && (
              <div className="bg-gray-800 rounded h-5 border border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-xs">
                file
              </div>
            )}
            {field.type === 'rating' && (
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="text-yellow-400 text-xs">★</span>
                ))}
              </div>
            )}
            {field.type === 'radio' && (
              <div className="flex gap-1">
                <input type="radio" className="w-2 h-2" disabled />
                <input type="radio" className="w-2 h-2" disabled />
              </div>
            )}
            {field.type === 'select' && (
              <select className="w-full bg-gray-800 rounded h-5 border border-gray-600 text-gray-300 text-xs" disabled>
                <option>Select</option>
              </select>
            )}
            {field.type === 'date' && (
              <input type="date" className="w-full bg-gray-800 rounded h-5 border border-gray-600 text-gray-300 text-xs" disabled />
            )}
            {field.type === 'time' && (
              <input type="time" className="w-full bg-gray-800 rounded h-5 border border-gray-600 text-gray-300 text-xs" disabled />
            )}
            {(field.type === 'text' || field.type === 'email' || field.type === 'number') && (
              <input
                type={field.type}
                placeholder={field.label}
                className="w-full bg-gray-800 rounded h-5 border border-gray-600 text-gray-300 text-xs px-1"
                disabled
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gray-900 text-white">
      {floatingForms.map((form, index) => (
        <FloatingFormCard key={index} form={form} index={index} />
      ))}
      <div className="z-10 text-center p-4">
        <h1 className="text-7xl md:text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          FormEasy
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Build powerful, elegant forms in minutes.
        </p>
        <Link to="/login">
          <button className="mt-8 px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
