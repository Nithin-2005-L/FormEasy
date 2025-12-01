import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiX } from 'react-icons/fi';

const FormEditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Initialize title/description from navigation state so user doesn't need to re-enter them
  const initialTitle = location.state?.formTitle || '';
  const initialDescription = location.state?.formDescription || '';

  const [formTitle, setFormTitle] = useState(initialTitle);
  const [formDescription, setFormDescription] = useState(initialDescription);
  const [fields, setFields] = useState(location.state?.fields || []);
  const [isSaving, setIsSaving] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [showPreview, setShowPreview] = useState({});
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [savedFormId, setSavedFormId] = useState(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('default');

  // Theme definitions
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

  // Helper function to convert label to camelCase fieldName
  const labelToFieldName = (label) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
      .replace(/\s/g, '')
      .replace(/^(.)/, (_, c) => c.toLowerCase()) || 'field';
  };

  const handleAddField = () => {
    const newField = {
      fieldName: `field_${Date.now()}`,
      fieldLabel: 'New Field',
      fieldType: 'text',
      fieldRequired: false,
      fieldOptions: []
    };
    setFields([...fields, newField]);
  };

  const handleEditField = (index) => {
    setEditingFieldIndex(index);
    setEditingField({ ...fields[index] });
    setShowPreview({ ...showPreview, [index]: true });
  };

  // Auto-update fieldName when fieldLabel changes
  const handleFieldLabelChange = (value) => {
    const newFieldName = labelToFieldName(value);
    setEditingField({ 
      ...editingField, 
      fieldLabel: value,
      fieldName: newFieldName || editingField.fieldName
    });
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editingFieldIndex !== null) {
        if (e.key === 'Escape') {
          setEditingFieldIndex(null);
          setEditingField(null);
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          if (editingFieldIndex !== null && editingField) {
            const updatedFields = [...fields];
            updatedFields[editingFieldIndex] = editingField;
            setFields(updatedFields);
            setEditingFieldIndex(null);
            setEditingField(null);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingFieldIndex, editingField, fields]);

  const handleSaveFieldEdit = () => {
    if (editingFieldIndex !== null && editingField) {
      const updatedFields = [...fields];
      updatedFields[editingFieldIndex] = editingField;
      setFields(updatedFields);
      setEditingFieldIndex(null);
      setEditingField(null);
      // Show full preview after saving field
      setShowFullPreview(true);
    }
  };

  const handleDeleteField = (index) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      setFields(fields.filter((_, i) => i !== index));
      if (editingFieldIndex === index) {
        setEditingFieldIndex(null);
        setEditingField(null);
      }
    }
  };

  const handleDuplicateField = (index) => {
    const fieldToDuplicate = fields[index];
    const newField = {
      ...fieldToDuplicate,
      fieldName: `${fieldToDuplicate.fieldName}_copy_${Date.now()}`,
      fieldLabel: `${fieldToDuplicate.fieldLabel} (Copy)`
    };
    const newFields = [...fields];
    newFields.splice(index + 1, 0, newField);
    setFields(newFields);
  };

  const handleAddOption = (fieldIndex) => {
    const newOption = `Option ${(editingField.fieldOptions?.length || 0) + 1}`;
    setEditingField({
      ...editingField,
      fieldOptions: [...(editingField.fieldOptions || []), newOption]
    });
  };

  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const newOptions = editingField.fieldOptions.filter((_, i) => i !== optionIndex);
    setEditingField({
      ...editingField,
      fieldOptions: newOptions
    });
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const newOptions = [...editingField.fieldOptions];
    newOptions[optionIndex] = value;
    setEditingField({
      ...editingField,
      fieldOptions: newOptions
    });
  };

  const handleMoveField = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newFields = [...fields];
      [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
      setFields(newFields);
    } else if (direction === 'down' && index < fields.length - 1) {
      const newFields = [...fields];
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      setFields(newFields);
    }
  };

  // Render field preview with theme styling
  const renderFieldPreviewWithTheme = (field, themeKey) => {
    const theme = themes[themeKey] || themes.default;
    const baseClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${theme.inputClass}`;
    
    switch (field.fieldType) {
      case 'textarea':
        return (
          <textarea
            disabled
            placeholder="Preview of textarea field"
            className={`${baseClasses} bg-opacity-50`}
            rows="3"
          />
        );
      case 'select':
        return (
          <select disabled className={`${baseClasses} bg-opacity-50`}>
            <option>Select an option...</option>
            {field.fieldOptions?.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-1">
            {field.fieldOptions?.map((opt, i) => (
              <label key={i} className={`flex items-center space-x-2 text-sm ${theme.labelClass}`}>
                <input type="radio" disabled className="w-4 h-4" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-1">
            {field.fieldOptions?.map((opt, i) => (
              <label key={i} className={`flex items-center space-x-2 text-sm ${theme.labelClass}`}>
                <input type="checkbox" disabled className="w-4 h-4" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div className="flex space-x-1">
            {field.fieldOptions?.map((opt, i) => (
              <button key={i} disabled className={`px-2 py-1 border rounded text-sm ${theme.buttonClass} opacity-70`}>
                ⭐ {opt}
              </button>
            ))}
          </div>
        );
      case 'file':
        return (
          <input
            type="file"
            disabled
            className={`${baseClasses} bg-opacity-50`}
          />
        );
      case 'date':
      case 'time':
      case 'datetime-local':
        return (
          <input
            type={field.fieldType}
            disabled
            className={`${baseClasses} bg-opacity-50`}
          />
        );
      case 'color':
        return (
          <input
            type="color"
            disabled
            className={`${baseClasses} h-12 bg-opacity-50`}
          />
        );
      case 'range':
        return (
          <input
            type="range"
            disabled
            className="w-full"
          />
        );
      default:
        return (
          <input
            type={field.fieldType || 'text'}
            disabled
            placeholder="Preview of input field"
            className={`${baseClasses} bg-opacity-50`}
          />
        );
    }
  };

  // Render field preview for live preview (without theme)
  const renderFieldPreview = (field) => {
    const previewValue = field.fieldType === 'checkbox' ? [] : '';
    
    switch (field.fieldType) {
      case 'textarea':
        return (
          <textarea
            disabled
            placeholder="Preview of textarea field"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
            rows="3"
          />
        );
      case 'select':
        return (
          <select disabled className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50">
            <option>Select an option...</option>
            {field.fieldOptions?.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-1">
            {field.fieldOptions?.map((opt, i) => (
              <label key={i} className="flex items-center space-x-2 text-sm">
                <input type="radio" disabled className="w-4 h-4" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-1">
            {field.fieldOptions?.map((opt, i) => (
              <label key={i} className="flex items-center space-x-2 text-sm">
                <input type="checkbox" disabled className="w-4 h-4" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div className="flex space-x-1">
            {field.fieldOptions?.map((opt, i) => (
              <button key={i} disabled className="px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50">
                ⭐ {opt}
              </button>
            ))}
          </div>
        );
      case 'file':
        return (
          <input
            type="file"
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
          />
        );
      case 'date':
      case 'time':
      case 'datetime-local':
        return (
          <input
            type={field.fieldType}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
          />
        );
      case 'color':
        return (
          <input
            type="color"
            disabled
            className="w-full h-10 border border-gray-300 rounded bg-gray-50"
          />
        );
      case 'range':
        return (
          <input
            type="range"
            disabled
            className="w-full"
          />
        );
      default:
        return (
          <input
            type={field.fieldType || 'text'}
            disabled
            placeholder="Preview of input field"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
          />
        );
    }
  };

  const handleSaveForm = async () => {
    if (!formTitle.trim()) {
      alert('Please enter a form title');
      return;
    }
    if (fields.length === 0) {
      alert('Please add at least one field');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          fields: fields,
          userId: user?._id, // Use actual userId from authenticated user
          theme: selectedTheme
        })
      });

      if (!response.ok) throw new Error('Failed to save form');
      
      const savedForm = await response.json();
      setSavedFormId(savedForm._id);
      setShowFullPreview(false);
      
      // Show share modal after saving
      setTimeout(() => {
        setShowShareModal(true);
      }, 500);
    } catch (err) {
      console.error('Error saving form:', err);
      alert('Failed to save form. Please try again.');
    } finally {
      setIsSaving(false);
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
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Edit Form</h1>

          {/* Form Header */}
          <div className="mb-8 space-y-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Form Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter form title"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Form Description</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter form description (optional)"
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fields Editor */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Fields</h2>

            <div className="space-y-3 mb-4">
              {fields.map((field, index) => {
                const isEditing = editingFieldIndex === index && editingField;
                const currentField = isEditing ? editingField : field;

                return (
                  <div 
                    key={index} 
                    className={`border-2 rounded-lg p-4 transition-all ${
                      isEditing 
                        ? 'bg-blue-50 border-blue-400 shadow-lg' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                          <div>
                            <p className="text-sm font-semibold text-blue-900">✏️ Editing Field #{index + 1}</p>
                            <p className="text-xs text-blue-600 mt-0.5">Field Name: <code className="bg-blue-100 px-1 rounded">{currentField.fieldName}</code></p>
                          </div>
                          <button
                            onClick={() => setShowPreview({ ...showPreview, [index]: !showPreview[index] })}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            {showPreview[index] ? 'Hide Preview' : 'Show Preview'}
                          </button>
                        </div>

                        {/* Live Preview */}
                        {showPreview[index] && (
                          <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">📱 Live Preview:</p>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                {currentField.fieldLabel || 'Field Label'}
                                {currentField.fieldRequired && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              {renderFieldPreview(currentField)}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Field Label <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={currentField.fieldLabel}
                              onChange={(e) => handleFieldLabelChange(e.target.value)}
                              placeholder="e.g., Full Name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              autoFocus
                            />
                            {!currentField.fieldLabel.trim() && (
                              <p className="text-xs text-red-500 mt-1">Field label is required</p>
                            )}
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Field Type</label>
                            <select
                              value={currentField.fieldType}
                              onChange={(e) => setEditingField({ ...currentField, fieldType: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="text">📝 Text</option>
                              <option value="email">✉️ Email</option>
                              <option value="password">🔒 Password</option>
                              <option value="number">🔢 Number</option>
                              <option value="date">📅 Date</option>
                              <option value="time">⏰ Time</option>
                              <option value="datetime-local">📆 Date & Time</option>
                              <option value="textarea">📄 Text Area</option>
                              <option value="select">📋 Select Dropdown</option>
                              <option value="radio">🔘 Radio Buttons</option>
                              <option value="checkbox">☑️ Checkboxes</option>
                              <option value="file">📎 File Upload</option>
                              <option value="url">🔗 URL</option>
                              <option value="phone">📞 Phone</option>
                              <option value="color">🎨 Color Picker</option>
                              <option value="range">🎚️ Range Slider</option>
                              <option value="rating">⭐ Rating</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Field Type</label>
                          <select
                            value={currentField.fieldType}
                            onChange={(e) => setEditingField({ ...currentField, fieldType: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="password">Password</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="time">Time</option>
                            <option value="datetime-local">DateTime</option>
                            <option value="textarea">Text Area</option>
                            <option value="select">Select</option>
                            <option value="radio">Radio</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="file">File</option>
                            <option value="url">URL</option>
                            <option value="phone">Phone</option>
                            <option value="color">Color</option>
                            <option value="range">Range</option>
                            <option value="rating">Rating</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentField.fieldRequired || false}
                              onChange={(e) =>
                                setEditingField({ ...currentField, fieldRequired: e.target.checked })
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Required Field</span>
                          </label>
                        </div>

                        {['select', 'radio', 'checkbox', 'rating'].includes(currentField.fieldType) && (
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Options <span className="text-red-500">*</span>
                              </label>
                              <button
                                onClick={() => handleAddOption(index)}
                                className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                              >
                                + Add Option
                              </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {(!editingField.fieldOptions || editingField.fieldOptions.length === 0) ? (
                                <p className="text-xs text-gray-500 italic">No options yet. Click "Add Option" to add one.</p>
                              ) : (
                                editingField.fieldOptions.map((option, optIndex) => (
                                  <div key={optIndex} className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                      placeholder={`Option ${optIndex + 1}`}
                                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <button
                                      onClick={() => handleRemoveOption(index, optIndex)}
                                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                      title="Remove option"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                            {(!editingField.fieldOptions || editingField.fieldOptions.length === 0) && (
                              <p className="text-xs text-red-500 mt-1">At least one option is required for this field type</p>
                            )}
                          </div>
                        )}

                        <div className="flex space-x-2 pt-2 border-t border-blue-200">
                          <button
                            onClick={handleSaveFieldEdit}
                            disabled={!currentField.fieldLabel?.trim() || 
                              (['select', 'radio', 'checkbox', 'rating'].includes(currentField.fieldType) && 
                               (!editingField.fieldOptions || editingField.fieldOptions.length === 0))}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            ✓ Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setEditingFieldIndex(null);
                              setEditingField(null);
                            }}
                            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                          >
                            ✕ Cancel (ESC)
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center">💡 Tip: Press Ctrl+Enter to save, ESC to cancel</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-gray-900">{field.fieldLabel}</p>
                            {field.fieldRequired && (
                              <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Required</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 font-mono">{field.fieldName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                              {field.fieldType}
                            </span>
                            {field.fieldOptions && field.fieldOptions.length > 0 && (
                              <span className="text-xs text-gray-500">
                                {field.fieldOptions.length} option{field.fieldOptions.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleMoveField(index, 'up')}
                            disabled={index === 0}
                            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleMoveField(index, 'down')}
                            disabled={index === fields.length - 1}
                            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => handleDuplicateField(index)}
                            className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-xs transition-colors"
                            title="Duplicate field"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => handleEditField(index)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                            title="Edit field"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteField(index)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                            title="Delete field"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleAddField}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              + Add Field
            </button>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/generate-fields')}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowFullPreview(true)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Preview Form
            </button>
            <button
              onClick={handleSaveForm}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving ? 'Saving...' : 'Save Form'}
            </button>
          </div>
        </div>
      </div>

      {/* Full Form Preview Modal */}
      {showFullPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl my-8">
            {/* Preview Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">📱 Form Preview</h2>
              <button
                onClick={() => setShowFullPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Theme Selector */}
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎨 Select Theme
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTheme(key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTheme === key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Content with Theme */}
            <div className={`px-6 py-4 max-h-[70vh] overflow-y-auto ${themes[selectedTheme].bgClass}`}>
              <div className={`${themes[selectedTheme].containerClass} rounded-lg p-6 shadow-md`}>
                <div className="mb-4">
                  <h3 className={`text-2xl font-bold mb-2 ${themes[selectedTheme].labelClass}`}>
                    {formTitle || 'Form Title'}
                  </h3>
                  {formDescription && (
                    <p className={`${themes[selectedTheme].labelClass} opacity-70`}>{formDescription}</p>
                  )}
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <label className={`block text-sm font-medium ${themes[selectedTheme].labelClass}`}>
                        {field.fieldLabel}
                        {field.fieldRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderFieldPreviewWithTheme(field, selectedTheme)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Actions */}
            <div className="flex space-x-3 border-t border-gray-200 px-6 py-4 bg-gray-50">
              <button
                onClick={() => setShowFullPreview(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Close Preview
              </button>
              <button
                onClick={handleSaveForm}
                disabled={isSaving || !formTitle.trim() || fields.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {isSaving ? 'Saving...' : '💾 Save & Test Form'}
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
              <h2 className="text-lg font-semibold text-emerald-200">✅ Form saved successfully</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-emerald-100 hover:text-emerald-50"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Share Content */}
            <div className="px-6 py-5 text-sm text-slate-100">
              <p className="mb-4 text-slate-200">Your form is ready! Share the link below to start collecting responses.</p>
              
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

              {/* Tip */}
              <div className="mb-5 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-slate-300">
                <p>
                  <strong className="text-slate-100">💡 Tip:</strong> Share this link in email, chat or on your website.
                  Anyone with the link can open and submit the form from any device.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1 text-sm">
                <button
                  onClick={handleGoToForm}
                  className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400"
                >
                  🧪 Test Form
                </button>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    setSavedFormId(null);
                    navigate('/dashboard');
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
  );
};

export default FormEditorPage;
