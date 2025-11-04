import React from 'react';
import { Link } from 'react-router-dom';

const floatingForms = [
  "Contact Form", "Event Registration", "Customer Survey", "Job Application", "Feedback Form", "Quiz Form", "Order Form"
];

const LandingPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gray-900 text-white">
      {floatingForms.map((form, index) => (
        <span
          key={index}
          className="absolute text-lg text-gray-600 animate-float"
          style={{
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
            animationDuration: `${15 + Math.random() * 15}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {form}
        </span>
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