import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiTrash2, FiEye, FiX } from 'react-icons/fi';
import PageLayout from '../components/PageLayout';

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
    // Navigate to form editor with fields and current form metadata
    navigate('/edit-form', { state: { fields, formTitle, formDescription } });
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
      navigate(`/form/${savedFormId}`, { 
        state: { fromFormCreation: true, formId: savedFormId } 
      });
    }
  };

  return (
    <PageLayout
      title="Generate your form"
      subtitle="Describe your form in one sentence and let Gemini suggest fields. You can reorder and refine everything before saving."
    >
      <div className="space-y-6 text-slate-100">
        {/* Form Title */}
        <div>
          <label className="block mb-1 text-sm font-medium text-slate-100">
            Form title
          </label>
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="e.g. Dance class feedback"
          />
        </div>
        
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✓ Form saved successfully! Redirecting...
          </div>
        )}

        {/* Form Description and Generate */}
        <div>
          <label className="block mb-1 text-sm font-medium text-slate-100">
            Form description
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="flex-grow w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. Short feedback form for students after each dance class"
            />
            <button 
              onClick={handleGenerate} 
              disabled={isLoading} 
              className="whitespace-nowrap rounded-lg bg-sky-500 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-700/50"
            >
              {isLoading ? 'Generating...' : 'Generate Fields'}
            </button>
          </div>
        </div>

        {/* Generated Fields */}
        <h3 className="border-b border-slate-800 pb-2 text-lg font-semibold">
          Generated fields
          <span className="ml-2 text-xs font-normal text-slate-400">
            drag to reorder or use arrows
          </span>
        </h3>
        <div className="mb-4 space-y-2">
          {fields.length > 0 ? (
            fields.map((field, index) => (
              <div 
                key={index} 
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm cursor-move transition-all ${
                  draggedIndex === index ? 'opacity-60 bg-slate-800' : 'hover:border-sky-500/70 hover:shadow-md'
                }`}
              >
                <div className="flex items-center flex-1 gap-3">
                  <span className="cursor-grab text-lg text-slate-500">≡</span>
                  <div>
                    <p className="font-medium text-slate-50">
                      {field.fieldLabel}{' '}
                      {field.fieldRequired && <span className="text-red-400">*</span>}
                    </p>
                    <p className="mt-1 text-[0.7rem] text-slate-400">{field.fieldName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-xs capitalize text-slate-300">
                    {field.fieldType}
                  </span>
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs text-slate-200 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === fields.length - 1}
                    className="px-2 py-1 text-xs text-slate-200 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleDeleteField(index)}
                    className="px-2 py-1 text-xs text-red-300 bg-slate-900 border border-red-500/40 rounded hover:bg-red-950 hover:text-red-200"
                    title="Delete field"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">
              Your generated fields will appear here after you click{' '}
              <span className="font-semibold text-slate-200">Generate fields</span>.
            </p>
          )}
        </div>

        {/* Save Button */}
        {fields.length > 0 && (
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button 
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
              >
                <FiEye size={18} />
                Preview Form
              </button>
              <button 
                onClick={handleEditForm}
                className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-medium text-slate-100 border border-slate-700 hover:border-slate-400"
              >
                Edit Fields
              </button>
              <button 
                onClick={handleSaveForm} 
                disabled={isSaving || !formTitle}
                className="rounded-lg bg-sky-500 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
              >
                {isSaving ? 'Saving...' : 'Save & Test Form'}
              </button>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-950 shadow-2xl shadow-slate-900/90 border border-slate-800">
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-50">Form preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Theme Selector */}
              <div className="border-b border-slate-800 px-6 py-4">
                <p className="mb-2 text-xs font-medium text-slate-300 uppercase tracking-wide">Select theme</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`p-3 rounded-lg border text-xs transition-all ${
                        selectedTheme === key
                          ? 'border-sky-500 bg-sky-500/10'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <p className="text-xs font-medium text-slate-100">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Preview */}
              <div className={`p-6 ${themes[selectedTheme].bgClass}`}>
                <div className={`${themes[selectedTheme].containerClass} max-w-md mx-auto rounded-lg p-6 shadow-md`}>
                  <h3 className={`mb-1 text-xl font-semibold ${themes[selectedTheme].labelClass}`}>
                    {formTitle || 'Form Title'}
                  </h3>
                  <p className={`mb-4 text-xs ${themes[selectedTheme].labelClass} opacity-70`}>
                    {formDescription || 'Form description'}
                  </p>

                  {/* Form Fields Preview */}
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={index}>
                        <label className={`mb-1 block text-sm font-medium ${themes[selectedTheme].labelClass}`}>
                          {field.fieldLabel}
                          {field.fieldRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {field.fieldType === 'textarea' && (
                          <textarea
                            className={`w-full rounded-md border px-3 py-2 text-sm ${themes[selectedTheme].inputClass}`}
                            placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
                            disabled
                          />
                        )}
                        {field.fieldType === 'select' && (
                          <select className={`w-full rounded-md border px-3 py-2 text-sm ${themes[selectedTheme].inputClass}`} disabled>
                            <option>Select an option</option>
                          </select>
                        )}
                        {field.fieldType === 'radio' && (
                          <div className="flex gap-3 text-xs">
                            <label className="flex items-center gap-2">
                              <input type="radio" disabled className="h-3 w-3" /> Option 1
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="radio" disabled className="h-3 w-3" /> Option 2
                            </label>
                          </div>
                        )}
                        {field.fieldType === 'checkbox' && (
                          <label className="flex items-center gap-2 text-xs">
                            <input type="checkbox" disabled className="h-3 w-3" />
                            {field.fieldLabel}
                          </label>
                        )}
                        {field.fieldType === 'rating' && (
                          <div className="flex gap-1 text-base">
                            {[1, 2, 3, 4, 5].map(star => (
                              <span key={star} className="text-2xl cursor-pointer">☆</span>
                            ))}
                          </div>
                        )}
                        {(field.fieldType === 'text' || field.fieldType === 'email' || field.fieldType === 'number' || field.fieldType === 'phone' || field.fieldType === 'url' || field.fieldType === 'password') && (
                          <input
                            type={field.fieldType}
                            className={`w-full rounded-md border px-3 py-2 text-sm ${themes[selectedTheme].inputClass}`}
                            placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
                            disabled
                          />
                        )}
                        {(field.fieldType === 'date' || field.fieldType === 'time' || field.fieldType === 'datetime-local') && (
                          <input
                            type={field.fieldType}
                            className={`w-full rounded-md border px-3 py-2 text-sm ${themes[selectedTheme].inputClass}`}
                            disabled
                          />
                        )}
                        {field.fieldType === 'file' && (
                          <input
                            type="file"
                            className={`w-full rounded-md border px-3 py-2 text-sm ${themes[selectedTheme].inputClass}`}
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
                            className={`w-full rounded-md border px-3 py-2 ${themes[selectedTheme].inputClass}`}
                            disabled
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Submit Button Preview */}
                  <button
                    className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium text-white ${themes[selectedTheme].buttonClass}`}
                    disabled
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end gap-4 border-t border-slate-800 bg-slate-900 px-6 py-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && savedFormId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-slate-900/80">
              {/* Share Header */}
              <div className="flex items-center justify-between border-b border-emerald-500/40 bg-gradient-to-r from-emerald-500/20 to-sky-500/10 px-6 py-4">
                <h2 className="text-lg font-semibold text-emerald-200">Form saved successfully</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-emerald-100 hover:text-emerald-50"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Share Content */}
              <div className="px-6 py-5 text-sm text-slate-100">
                <p className="mb-4 text-slate-200">Your form is ready. Share the link below to start collecting responses.</p>
                
                {/* Share Link */}
                <div className="mb-6">
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                    Share this link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/form/${savedFormId}`}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                    />
                    <button
                      onClick={handleCopyShareLink}
                      className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                        copiedToClipboard
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-sky-500 text-slate-950 hover:bg-sky-400'
                      }`}
                    >
                      {copiedToClipboard ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* QR Code Info */}
                <div className="mb-5 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-slate-300">
                  <p>
                    <strong className="text-slate-100">Tip:</strong> share this link in email, chat or on your website.
                    Anyone with the link can open and submit the form from any device.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-1 text-sm">
                  <button
                    onClick={handleGoToForm}
                    className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400"
                  >
                    View Form
                  </button>
                  <button
                    onClick={() => {
                      setShowShareModal(false);
                      setSavedFormId(null);
                    }}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 font-medium text-slate-100 hover:border-slate-500"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default FieldGenerationPage;
