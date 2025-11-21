import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    const fetchForms = async () => {
      try {
        const res = await fetch(`/api/forms/${user._id}`);
        if (!res.ok) throw new Error('Failed to load forms');
        const data = await res.json();
        setForms(data);
      } catch (err) {
        console.error('Error loading forms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [user]);

  if (!isAuthenticated) {
    return (
      <PageLayout title="Dashboard" subtitle="Please log in to view your forms.">
        <div className="text-sm text-slate-200">
          <button
            onClick={() => navigate('/login')}
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
          >
            Go to login
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Your forms"
      subtitle="See the forms you’ve created and jump into responses or create a new one."
      action={
        <button
          type="button"
          onClick={() => navigate('/create-form')}
          className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400"
        >
          + New form
        </button>
      }
    >
      {loading ? (
        <div className="py-10 text-center text-sm text-slate-300">
          Loading your forms...
        </div>
      ) : forms.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-300">
          You haven’t created any forms yet.
          <div className="mt-3">
            <button
              onClick={() => navigate('/create-form')}
              className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400"
            >
              Create your first form
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-sm text-slate-100">
          {forms.map((form) => (
            <div
              key={form._id}
              className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-sm font-semibold text-slate-50">{form.title}</p>
                {form.description && (
                  <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                    {form.description}
                  </p>
                )}
                <p className="mt-1 text-[0.7rem] text-slate-500">
                  {new Date(form.createdAt).toLocaleDateString()} •{' '}
                  {form.submissions || 0} responses
                </p>
              </div>
              <div className="flex gap-2 sm:items-center">
                <button
                  onClick={() => navigate(`/form/${form._id}`)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-500"
                >
                  Open form
                </button>
                <button
                  onClick={() => navigate(`/submissions/${form._id}`)}
                  className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400"
                >
                  View responses
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default DashboardPage;


