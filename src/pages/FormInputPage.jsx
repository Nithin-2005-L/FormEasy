import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormInputPage = () => {
  const [formDetails, setFormDetails] = useState({ title: '', purpose: '', audience: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (skipped = false) => {
    const dataToPass = skipped ? {} : formDetails;
    // Pass the data to the next page via route state
    navigate('/generate-fields', { state: { initialDetails: dataToPass } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Describe Your Form</h2>
          <p className="text-gray-500">Give us some context, or skip ahead!</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Form Title</label>
            <input name="title" value={formDetails.title} onChange={handleChange} placeholder="e.g., Monthly Customer Feedback" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Purpose</label>
            <textarea name="purpose" value={formDetails.purpose} onChange={handleChange} rows="3" placeholder="e.g., To gather feedback to improve our services" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Target Audience</label>
            <input name="audience" value={formDetails.audience} onChange={handleChange} placeholder="e.g., Customers who bought a product in the last 3 months" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button onClick={() => handleSubmit(true)} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Skip</button>
          <button onClick={() => handleSubmit(false)} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Next</button>
        </div>
      </div>
    </div>
  );
};

export default FormInputPage;