import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiTrash2, FiEye, FiX } from 'react-icons/fi';

const FieldGenerationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialDetails = location.state?.initialDetails; // Get data from previous page

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState([]); // This will hold the generated fields
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [savedFormId, setSavedFormId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const themes = {
    default: {
      name: 'Default',
      containerClass: 'bg-white',
      labelClass: 'text-gray-700',
      inputClass: 'border-gray-300 focus:ring-blue-500',
      buttonClass: 'bg-blue-600 hover:bg-blue-700',
      bgClass: 'bg-gray-50'
    },
    dark: {
      name: 'Dark',
      containerClass: 'bg-gray-800',
      labelClass: 'text-gray-200',
      inputClass: 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400',
      buttonClass: 'bg-gray-700 hover:bg-gray-600 text-white',
      bgClass: 'bg-gray-900'
    },
    minimal: {
      name: 'Minimal',
      containerClass: 'bg-white',
      labelClass: 'text-gray-600 text-sm',
      inputClass: 'border-b border-gray-300 focus:border-gray-600 focus:ring-0',
      buttonClass: 'bg-gray-900 hover:bg-black text-white',
      bgClass: 'bg-white'
    },
    vibrant: {
      name: 'Vibrant',
      containerClass: 'bg-gradient-to-br from-purple-50 to-pink-50',
      labelClass: 'text-purple-900 font-semibold',
      inputClass: 'border-purple-300 focus:ring-purple-500 focus:border-purple-500',
      buttonClass: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
      bgClass: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    corporate: {
      name: 'Corporate',
      containerClass: 'bg-slate-50',
      labelClass: 'text-slate-700 font-medium',
      inputClass: 'border-slate-300 focus:ring-slate-500 focus:border-slate-500',
      buttonClass: 'bg-slate-800 hover:bg-slate-900 text-white',
      bgClass: 'bg-slate-100'
    }
  };

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
      const response = await fetch('/api/generate-fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We send the user's input in the request body
        body: JSON.stringify({
          formDescription: formDescription,
          title: formTitle,
          purpose: initialDetails?.purpose || '',
          audience: initialDetails?.audience || ''
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
      const response = await fetch('/api/forms', {
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
          userId: user?._id, // Use actual userId from authenticated user
          theme: selectedTheme // Save the selected theme
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedForm = await response.json();
      setShowSuccess(true);
      setSavedFormId(savedForm._id);
      
      // Show share modal instead of immediate redirect
      setTimeout(() => {
        setShowShareModal(true);
      }, 1000);

    } catch (error) {
      console.error("Failed to save form:", error);
      alert("There was an error saving the form. Please check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditForm = () => {
    // Navigate to form editor with fields
    navigate('/edit-form', { state: { fields } });
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dropEffect = 'move';
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      return;
    }

    const newFields = [...fields];
    const draggedField = newFields[draggedIndex];
    
    // Remove dragged field
    newFields.splice(draggedIndex, 1);
    
    // Insert at new position
    newFields.splice(index, 0, draggedField);
    
    setFields(newFields);
    setDraggedIndex(null);
  };

  const handleDeleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newFields = [...fields];
      [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
      setFields(newFields);
    }
  };

  const handleMoveDown = (index) => {
    if (index < fields.length - 1) {
      const newFields = [...fields];
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      setFields(newFields);
    }
  };

  const handleCopyShareLink = () => {
    if (!savedFormId) return;
    
    const shareUrl = `${window.location.origin}/form/${savedFormId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    });
  };

  const handleGoToForm = () => {
    if (savedFormId) {
      navigate(`/form/${savedFormId}`);
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
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">Generated Fields (Drag to Reorder)</h3>
        <div className="space-y-2 mb-6">
          {fields.length > 0 ? (
            fields.map((field, index) => (
              <div 
                key={index} 
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`flex items-center justify-between p-4 bg-gray-100 border rounded-lg cursor-move transition-all ${
                  draggedIndex === index ? 'opacity-50 bg-gray-200' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center flex-1 gap-3">
                  <span className="text-gray-400 cursor-grab text-lg">≡</span>
                  <div>
                    <p className="font-medium">{field.fieldLabel} {field.fieldRequired && <span className="text-red-500">*</span>}</p>
                    <p className="text-xs text-gray-500 mt-1">{field.fieldName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 capitalize bg-white px-2 py-1 rounded-full">{field.fieldType}</span>
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="px-2 py-1 text-sm text-gray-600 bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === fields.length - 1}
                    className="px-2 py-1 text-sm text-gray-600 bg-white border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleDeleteField(index)}
                    className="px-2 py-1 text-red-600 bg-white border border-red-300 rounded hover:bg-red-50"
                    title="Delete field"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">Your generated fields will appear here. Drag to reorder or use arrow buttons.</p>
          )}
        </div>

        {/* Save Button */}
        {fields.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowPreview(true)}
                className="px-8 py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <FiEye size={18} />
                Preview Form
              </button>
              <button 
                onClick={handleEditForm}
                className="px-8 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Edit Fields
              </button>
              <button 
                onClick={handleSaveForm} 
                disabled={isSaving || !formTitle}
                className="px-8 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save & Test Form'}
              </button>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Preview Header */}
              <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                <h2 className="text-2xl font-bold">Preview Form</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Theme Selector */}
              <div className="p-6 border-b">
                <p className="text-sm font-medium text-gray-700 mb-3">Select Theme:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedTheme === key
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-xs font-medium">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Preview */}
              <div className={`p-8 ${themes[selectedTheme].bgClass}`}>
                <div className={`${themes[selectedTheme].containerClass} p-8 rounded-lg shadow-md max-w-md mx-auto`}>
                  <h3 className={`text-2xl font-bold mb-2 ${themes[selectedTheme].labelClass}`}>
                    {formTitle || 'Form Title'}
                  </h3>
                  <p className={`text-sm mb-6 ${themes[selectedTheme].labelClass} opacity-70`}>
                    {formDescription || 'Form description'}
                  </p>

                  {/* Form Fields Preview */}
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={index}>
                        <label className={`block mb-2 font-medium ${themes[selectedTheme].labelClass}`}>
                          {field.fieldLabel}
                          {field.fieldRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {field.fieldType === 'textarea' && (
                          <textarea
                            className={`w-full px-3 py-2 border rounded-md ${themes[selectedTheme].inputClass}`}
                            placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
                            disabled
                          />
                        )}
                        {field.fieldType === 'select' && (
                          <select className={`w-full px-3 py-2 border rounded-md ${themes[selectedTheme].inputClass}`} disabled>
                            <option>Select an option</option>
                          </select>
                        )}
                        {field.fieldType === 'radio' && (
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input type="radio" disabled /> Option 1
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="radio" disabled /> Option 2
                            </label>
                          </div>
                        )}
                        {field.fieldType === 'checkbox' && (
                          <label className="flex items-center gap-2">
                            <input type="checkbox" disabled />
                            {field.fieldLabel}
                          </label>
                        )}
                        {field.fieldType === 'rating' && (
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <span key={star} className="text-2xl cursor-pointer">☆</span>
                            ))}
                          </div>
                        )}
                        {(field.fieldType === 'text' || field.fieldType === 'email' || field.fieldType === 'number' || field.fieldType === 'phone' || field.fieldType === 'url' || field.fieldType === 'password') && (
                          <input
                            type={field.fieldType}
                            className={`w-full px-3 py-2 border rounded-md ${themes[selectedTheme].inputClass}`}
                            placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
                            disabled
                          />
                        )}
                        {(field.fieldType === 'date' || field.fieldType === 'time' || field.fieldType === 'datetime-local') && (
                          <input
                            type={field.fieldType}
                            className={`w-full px-3 py-2 border rounded-md ${themes[selectedTheme].inputClass}`}
                            disabled
                          />
                        )}
                        {field.fieldType === 'file' && (
                          <input
                            type="file"
                            className={`w-full px-3 py-2 border rounded-md ${themes[selectedTheme].inputClass}`}
                            disabled
                          />
                        )}
                        {field.fieldType === 'range' && (
                          <input
                            type="range"
                            className="w-full"
                            disabled
                          />
                        )}
                        {field.fieldType === 'color' && (
                          <input
                            type="color"
                            className={`w-full px-3 py-2 border rounded-md ${themes[selectedTheme].inputClass}`}
                            disabled
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Submit Button Preview */}
                  <button
                    className={`w-full mt-6 px-4 py-2 rounded-lg font-medium text-white ${themes[selectedTheme].buttonClass}`}
                    disabled
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && savedFormId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Share Header */}
              <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-500 to-blue-500">
                <h2 className="text-2xl font-bold text-white">Form Saved Successfully! 🎉</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Share Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">Your form has been created and is ready to share!</p>
                
                {/* Share Link */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Share this link:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/form/${savedFormId}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={handleCopyShareLink}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        copiedToClipboard
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {copiedToClipboard ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* QR Code Info */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>💡 Tip:</strong> Share this link with anyone to let them fill out your form. They can access it from any device!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleGoToForm}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    View Form
                  </button>
                  <button
                    onClick={() => {
                      setShowShareModal(false);
                      setSavedFormId(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldGenerationPage;
