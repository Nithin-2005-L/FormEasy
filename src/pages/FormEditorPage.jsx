import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
  };

  const handleSaveFieldEdit = () => {
    if (editingFieldIndex !== null && editingField) {
      const updatedFields = [...fields];
      updatedFields[editingFieldIndex] = editingField;
      setFields(updatedFields);
      setEditingFieldIndex(null);
      setEditingField(null);
    }
  };

  const handleDeleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
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
          userId: user?._id // Use actual userId from authenticated user
        })
      });

      if (!response.ok) throw new Error('Failed to save form');
      
      const savedForm = await response.json();
      alert('Form saved successfully!');
      
      // Navigate to the form response page
      navigate(`/form/${savedForm._id}`);
    } catch (err) {
      console.error('Error saving form:', err);
      alert('Failed to save form. Please try again.');
    } finally {
      setIsSaving(false);
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
                  <div key={index} className="bg-gray-50 border rounded-lg p-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-semibold text-gray-800">Editing field #{index + 1}</p>
                          <span className="text-xs text-gray-500">{currentField.fieldName}</span>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Field Label</label>
                          <input
                            type="text"
                            value={currentField.fieldLabel}
                            onChange={(e) => setEditingField({ ...currentField, fieldLabel: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
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
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={currentField.fieldRequired}
                            onChange={(e) =>
                              setEditingField({ ...currentField, fieldRequired: e.target.checked })
                            }
                            className="w-4 h-4"
                          />
                          <label className="text-sm font-medium text-gray-700">Required</label>
                        </div>
                        {['select', 'radio', 'checkbox', 'rating'].includes(currentField.fieldType) && (
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Options (comma-separated)
                            </label>
                            <textarea
                              value={currentField.fieldOptions.join(', ')}
                              onChange={(e) =>
                                setEditingField({
                                  ...currentField,
                                  fieldOptions: e.target.value
                                    .split(',')
                                    .map((o) => o.trim())
                                    .filter((o) => o)
                                })
                              }
                              rows="2"
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Option 1, Option 2, Option 3"
                            />
                          </div>
                        )}
                        <div className="flex space-x-2 pt-1">
                          <button
                            onClick={handleSaveFieldEdit}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingFieldIndex(null)}
                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1 pr-4">
                          <p className="font-semibold text-gray-900">{field.fieldLabel}</p>
                          <p className="text-xs text-gray-500 mt-1">{field.fieldName}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {field.fieldType} {field.fieldRequired ? '• Required' : '• Optional'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleMoveField(index, 'up')}
                              disabled={index === 0}
                              className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => handleMoveField(index, 'down')}
                              disabled={index === fields.length - 1}
                              className="px-2 py-1 bg-gray-200 rounded text-xs disabled:opacity-50"
                            >
                              ↓
                            </button>
                          </div>
                          <div className="flex space-x-1 pt-1">
                            <button
                              onClick={() => handleEditField(index)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteField(index)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
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
              onClick={handleSaveForm}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving ? 'Saving...' : 'Save Form'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditorPage;
