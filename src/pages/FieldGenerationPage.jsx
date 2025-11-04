import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FieldGenerationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialDetails = location.state?.initialDetails; // Get data from previous page

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState([]); // This will hold the generated fields
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGenerate = async () => {
    // Basic validation to ensure the input isn't empty
    if (!formDescription) {
      alert("Please describe the form you want to create.");
      return;
    }
    setIsLoading(true);
    setFields([]); // Clear any previous results

    try {
      // --- The API Call ---
      // This sends a POST request to our backend server
      const response = await fetch('http://localhost:8080/api/generate-fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We send the user's input in the request body
        body: JSON.stringify({
          formDescription: formDescription,
          initialDetails: initialDetails // Pass along context from the previous page
        }),
      });

      // Check if the server responded with an error (e.g., status 500)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON data (the array of fields) from the response
      const generatedFields = await response.json();
      
      // Update our component's state with the fields from the backend
      setFields(generatedFields);

    } catch (error) {
      // If anything goes wrong, log the error and show an alert
      console.error("Failed to fetch generated fields:", error);
      alert("There was an error generating the form fields. Please check the console for details.");
    } finally {
      // This runs whether the request succeeded or failed
      setIsLoading(false); // Stop the loading indicator
    }
  };

  const handleSaveForm = async () => {
    if (!formTitle || !formDescription || fields.length === 0) {
      alert("Please provide a title, description, and generate fields before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:8080/api/generate-fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formTitle,
          purpose: initialDetails?.purpose || '',
          audience: initialDetails?.audience || '',
          description: formDescription,
          fields: fields,
          userId: 'user_123' // In production, get from authentication
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedForm = await response.json();
      setShowSuccess(true);
      
      // Redirect to a new page showing the saved form or dashboard
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error("Failed to save form:", error);
      alert("There was an error saving the form. Please check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-2">Generate Your Form</h2>
        <p className="mb-6 text-gray-600">Create and save your AI-generated form.</p>
        
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✓ Form saved successfully! Redirecting...
          </div>
        )}

        {/* Form Title */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Form Title</label>
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Customer Feedback Form"
          />
        </div>

        {/* Form Description and Generate */}
        <div className="mb-8">
          <label className="block mb-2 font-medium text-gray-700">Form Description</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="flex-grow w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., A dance class feedback form"
            />
            <button 
              onClick={handleGenerate} 
              disabled={isLoading} 
              className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 whitespace-nowrap"
            >
              {isLoading ? 'Generating...' : 'Generate Fields'}
            </button>
          </div>
        </div>

        {/* Generated Fields */}
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">Generated Fields</h3>
        <div className="space-y-4 mb-6">
          {fields.length > 0 ? (
            fields.map((field, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-100 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{field.fieldLabel} {field.fieldRequired && <span className="text-red-500">*</span>}</p>
                  <p className="text-xs text-gray-500 mt-1">{field.fieldName}</p>
                </div>
                <span className="text-sm text-gray-500 capitalize bg-white px-2 py-1 rounded-full">{field.fieldType}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">Your generated fields will appear here.</p>
          )}
        </div>

        {/* Save Button */}
        {fields.length > 0 && (
          <div className="flex justify-end">
            <button 
              onClick={handleSaveForm} 
              disabled={isSaving || !formTitle}
              className="px-8 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Form'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldGenerationPage;