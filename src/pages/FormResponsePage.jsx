import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FormResponsePage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('default');

  // Theme definitions
  const themes = {
    default: {
      containerClass: 'bg-white',
      labelClass: 'text-gray-700',
      inputClass: 'border-gray-300 focus:ring-blue-500',
      buttonClass: 'bg-blue-600 hover:bg-blue-700',
      bgClass: 'bg-gray-50'
    },
    dark: {
      containerClass: 'bg-gray-800',
      labelClass: 'text-gray-200',
      inputClass: 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400',
      buttonClass: 'bg-gray-700 hover:bg-gray-600 text-white',
      bgClass: 'bg-gray-900'
    },
    minimal: {
      containerClass: 'bg-white',
      labelClass: 'text-gray-600 text-sm',
      inputClass: 'border-b border-gray-300 focus:border-gray-600 focus:ring-0',
      buttonClass: 'bg-gray-900 hover:bg-black text-white',
      bgClass: 'bg-white'
    },
    vibrant: {
      containerClass: 'bg-gradient-to-br from-purple-50 to-pink-50',
      labelClass: 'text-purple-900 font-semibold',
      inputClass: 'border-purple-300 focus:ring-purple-500 focus:border-purple-500',
      buttonClass: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
      bgClass: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    corporate: {
      containerClass: 'bg-slate-50',
      labelClass: 'text-slate-700 font-medium',
      inputClass: 'border-slate-300 focus:ring-slate-500 focus:border-slate-500',
      buttonClass: 'bg-slate-800 hover:bg-slate-900 text-white',
      bgClass: 'bg-slate-100'
    }
  };

  useEffect(() => {
    // Fetch the form details
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/form/${formId}`);
        if (!response.ok) throw new Error('Failed to load form');
        const data = await response.json();
        setForm(data);
        
        // Set the theme from the form data
        if (data.theme) {
          setSelectedTheme(data.theme);
        }
        
        // Initialize responses object
        const initialResponses = {};
        data.fields.forEach(field => {
          initialResponses[field.fieldName] = field.fieldType === 'checkbox' ? [] : '';
        });
        setResponses(initialResponses);
      } catch (err) {
        console.error('Error fetching form:', err);
        setForm(null);
      } finally {
        setLoading(false);
      }
    };

    if (formId) fetchForm();
  }, [formId]);

  const handleInputChange = (fieldName, value, fieldType) => {
    if (fieldType === 'checkbox') {
      setResponses(prev => {
        const currentValues = prev[fieldName] || [];
        if (currentValues.includes(value)) {
          return { ...prev, [fieldName]: currentValues.filter(v => v !== value) };
        } else {
          return { ...prev, [fieldName]: [...currentValues, value] };
        }
      });
    } else {
      setResponses(prev => ({ ...prev, [fieldName]: value }));
    }
    // Clear error for this field when user starts typing
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form) return newErrors;

    form.fields.forEach(field => {
      if (field.fieldRequired) {
        const value = responses[field.fieldName];
        if (!value || (Array.isArray(value) && value.length === 0) || value.toString().trim() === '') {
          newErrors[field.fieldName] = `${field.fieldLabel} is required`;
        }
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/submit/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          submittedBy: 'Anonymous'
        })
      });

      if (!response.ok) throw new Error('Failed to submit form');
      
      setSubmitSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const value = responses[field.fieldName] || '';
    const error = errors[field.fieldName];
    const themeClasses = themes[selectedTheme].inputClass;
    const baseClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${themeClasses}`;
    const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';

    switch (field.htmlType || field.fieldType) {
      case 'textarea':
        return (
          <textarea
            key={field.fieldName}
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value, field.fieldType)}
            placeholder={field.fieldLabel}
            rows="4"
            className={`${baseClasses} ${errorClasses}`}
            required={field.fieldRequired}
          />
        );

      case 'input-radio':
      case 'radio':
        return (
          <div key={field.fieldName} className="space-y-2">
            {field.fieldOptions.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.fieldName}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(field.fieldName, e.target.value, field.fieldType)}
                  className="w-4 h-4"
                  required={field.fieldRequired}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'input-checkbox':
      case 'checkbox':
        return (
          <div key={field.fieldName} className="space-y-2">
            {field.fieldOptions.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={(Array.isArray(value) && value.includes(option)) || false}
                  onChange={() => handleInputChange(field.fieldName, option, field.fieldType)}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            key={field.fieldName}
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value, field.fieldType)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.fieldRequired}
          >
            <option value="">-- Select {field.fieldLabel} --</option>
            {field.fieldOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'input-file':
      case 'file':
        return (
          <input
            key={field.fieldName}
            type="file"
            onChange={(e) => handleInputChange(field.fieldName, e.target.files[0]?.name || '', field.fieldType)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.fieldRequired}
          />
        );

      case 'input-date':
      case 'date':
        return (
          <input
            key={field.fieldName}
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value, field.fieldType)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.fieldRequired}
          />
        );

      case 'input-time':
      case 'time':
        return (
          <input
            key={field.fieldName}
            type="time"
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value, field.fieldType)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.fieldRequired}
          />
        );

      case 'input-datetime-local':
      case 'datetime-local':
        return (
          <input
            key={field.fieldName}
            type="datetime-local"
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value, field.fieldType)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.fieldRequired}
          />
        );

      case 'input-color':
      case 'color':
        return (
          <input
            key={field.fieldName}
            type="color"
            value={value || '#000000'}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value, field.fieldType)}
            className={`${baseClasses} h-12 cursor-pointer`}
            required={field.fieldRequired}
          />
        );

      case 'input-range':
      case 'range':
        return (
          <input
            key={field.fieldName}
            type="range"
            min="0"
            max="100"
            value={value || 50}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value, field.fieldType)}
            className="w-full h-2 cursor-pointer"
          />
        );

      case 'rating':
        return (
          <div key={field.fieldName} className="flex space-x-2">
            {field.fieldOptions.map(option => (
              <button
                key={option}
                onClick={() => handleInputChange(field.fieldName, option, field.fieldType)}
                className={`px-3 py-2 rounded border-2 transition ${
                  value === option
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500'
                }`}
              >
                ⭐ {option}
              </button>
            ))}
          </div>
        );

      default:
        return (
          <input
            key={field.fieldName}
            type={field.htmlType?.replace('input-', '') || 'text'}
            value={value}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value, field.fieldType)}
            placeholder={field.fieldLabel}
            className={`${baseClasses} ${errorClasses}`}
            required={field.fieldRequired}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${themes[selectedTheme].bgClass}`}>
        <div className="text-center">
          <p className="text-red-600 text-lg">Form not found</p>
          <button onClick={() => navigate('/')} className={`mt-4 px-4 py-2 text-white rounded ${themes[selectedTheme].buttonClass}`}>Back to Home</button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-green-600 mb-2">✓ Form Submitted Successfully!</h2>
          <p className="text-gray-600">Thank you for your response. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 bg-slate-950`}>
      <div className="max-w-2xl mx-auto">
        <div className={`${themes[selectedTheme].containerClass} rounded-lg shadow-md p-8`}>
          <div className="mb-6">
            <h1 className={`text-3xl font-bold ${themes[selectedTheme].labelClass}`}>{form.title || 'Form'}</h1>
            {form.description && <p className={`${themes[selectedTheme].labelClass} opacity-70 mt-2`}>{form.description}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map(field => (
              <div key={field.fieldName}>
                <label className={`block mb-2 font-medium ${themes[selectedTheme].labelClass}`}>
                  {field.fieldLabel}
                  {field.fieldRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.fieldName] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.fieldName]}</p>
                )}
              </div>
            ))}

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold ${themes[selectedTheme].labelClass} bg-opacity-20`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-4 py-2 text-white rounded-lg font-semibold disabled:opacity-50 ${themes[selectedTheme].buttonClass}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormResponsePage;
