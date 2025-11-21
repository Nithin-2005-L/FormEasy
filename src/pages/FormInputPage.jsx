import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

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
    <PageLayout
      title="Describe your form"
      subtitle="Give FormEasy a bit of context so Gemini can suggest better questions. You can also skip and describe it later."
    >
      <div className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium text-slate-100">
            Form title
          </label>
          <input
            name="title"
            value={formDetails.title}
            onChange={handleChange}
            placeholder="e.g. Monthly customer feedback"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-slate-100">
            Purpose
          </label>
          <textarea
            name="purpose"
            value={formDetails.purpose}
            onChange={handleChange}
            rows="3"
            placeholder="e.g. Understand how satisfied students are with our dance classes and where to improve."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-slate-100">
            Target audience
          </label>
          <input
            name="audience"
            value={formDetails.audience}
            onChange={handleChange}
            placeholder="e.g. Students who attended at least one class in the last month"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:justify-end">
          <button
            onClick={() => handleSubmit(true)}
            className="rounded-lg border border-slate-600 px-5 py-2 text-sm font-medium text-slate-100 hover:border-slate-400"
          >
            Skip for now
          </button>
          <button
            onClick={() => handleSubmit(false)}
            className="rounded-lg bg-sky-500 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
          >
            Continue to AI fields
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default FormInputPage;