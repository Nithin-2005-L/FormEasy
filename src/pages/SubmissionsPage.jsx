import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SubmissionsPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch form details
        const formResponse = await fetch(`/api/form/${formId}`);
        if (formResponse.ok) {
          setForm(await formResponse.json());
        }

        // Fetch submissions
        const submissionsResponse = await fetch(`/api/submissions/${formId}`);
        if (submissionsResponse.ok) {
          setSubmissions(await submissionsResponse.json());
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (formId) fetchData();
  }, [formId]);

  const exportToCSV = () => {
    if (!form || submissions.length === 0) return;

    const headers = form.fields.map(f => f.fieldLabel);
    const rows = submissions.map(sub =>
      form.fields.map(f => {
        const value = sub.responses[f.fieldName];
        return Array.isArray(value) ? value.join('; ') : value || '';
      })
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title}_submissions.csv`;
    a.click();
  };

  const exportToPDF = () => {
    if (!form || submissions.length === 0) return;

    let pdfContent = `${form.title}\n${new Date().toLocaleDateString()}\n\n`;
    
    submissions.forEach((sub, idx) => {
      pdfContent += `\n--- Submission ${idx + 1} (${new Date(sub.submittedAt).toLocaleDateString()}) ---\n`;
      form.fields.forEach(field => {
        const value = sub.responses[field.fieldName];
        const displayValue = Array.isArray(value) ? value.join(', ') : value || '(empty)';
        pdfContent += `${field.fieldLabel}: ${displayValue}\n`;
      });
    });

    // For a basic implementation, create a text file (proper PDF requires a library)
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title}_submissions.txt`;
    a.click();

    alert('Note: For production, consider using a library like jsPDF or react-pdf for better PDF generation.');
  };

  const filteredAndSortedSubmissions = submissions
    .filter(sub => {
      if (!searchTerm) return true;
      return form?.fields.some(field => {
        const value = sub.responses[field.fieldName];
        const searchValue = Array.isArray(value) ? value.join(' ') : String(value || '');
        return searchValue.toLowerCase().includes(searchTerm.toLowerCase());
      });
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{form?.title || 'Form'} - Submissions</h1>
            <p className="text-gray-600 mt-1">Total: {filteredAndSortedSubmissions.length} responses</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Home
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No submissions yet.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search submissions..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Most Recent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Export</label>
                  <div className="flex gap-2">
                    <button
                      onClick={exportToCSV}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      CSV
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {selectedSubmission ? (
              <div className="bg-white rounded-lg shadow p-8">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  ← Back to List
                </button>
                <h2 className="text-2xl font-bold mb-4">Submission Details</h2>
                <p className="text-gray-600 mb-6">
                  Submitted on: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </p>
                <div className="space-y-4">
                  {form?.fields.map(field => (
                    <div key={field.fieldName} className="border-b pb-4">
                      <h3 className="font-semibold text-gray-800">{field.fieldLabel}</h3>
                      <p className="text-gray-600 mt-1">
                        {Array.isArray(selectedSubmission.responses[field.fieldName])
                          ? selectedSubmission.responses[field.fieldName].join(', ')
                          : selectedSubmission.responses[field.fieldName] || '(empty)'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedSubmissions.map((sub, idx) => (
                  <div
                    key={sub._id}
                    onClick={() => setSelectedSubmission(sub)}
                    className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">Submission #{filteredAndSortedSubmissions.length - idx}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {new Date(sub.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-blue-600 font-semibold">View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage;
