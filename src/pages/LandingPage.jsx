import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const floatingForms = [
  {
    title: "Contact Form",
    fields: [
      { label: "Name", type: "text" },
      { label: "Email", type: "email" },
      { label: "Message", type: "textarea" }
    ]
  },
  {
    title: "Event Registration",
    fields: [
      { label: "Full Name", type: "text" },
      { label: "Email", type: "email" },
      { label: "Attendees", type: "number" }
    ]
  },
  {
    title: "Customer Survey",
    fields: [
      { label: "Satisfaction", type: "rating" },
      { label: "Comments", type: "textarea" }
    ]
  },
  {
    title: "Job Application",
    fields: [
      { label: "Full Name", type: "text" },
      { label: "Email", type: "email" },
      { label: "Resume", type: "file" }
    ]
  },
  {
    title: "Feedback Form",
    fields: [
      { label: "Rating", type: "rating" },
      { label: "Feedback", type: "textarea" }
    ]
  },
  {
    title: "Quiz Form",
    fields: [
      { label: "Question 1", type: "radio" },
      { label: "Question 2", type: "radio" }
    ]
  },
  {
    title: "Order Form",
    fields: [
      { label: "Product", type: "select" },
      { label: "Quantity", type: "number" },
      { label: "Delivery Date", type: "date" }
    ]
  },
  {
    title: "Newsletter",
    fields: [
      { label: "Email", type: "email" },
      { label: "Frequency", type: "select" }
    ]
  },
  {
    title: "Support Ticket",
    fields: [
      { label: "Issue Type", type: "select" },
      { label: "Description", type: "textarea" },
      { label: "Priority", type: "radio" }
    ]
  },
  {
    title: "Product Review",
    fields: [
      { label: "Product", type: "select" },
      { label: "Rating", type: "rating" },
      { label: "Review", type: "textarea" }
    ]
  },
  {
    title: "Appointment",
    fields: [
      { label: "Date", type: "date" },
      { label: "Time", type: "time" },
      { label: "Service", type: "select" }
    ]
  },
  {
    title: "User Profile",
    fields: [
      { label: "Username", type: "text" },
      { label: "Avatar", type: "file" },
      { label: "Bio", type: "textarea" }
    ]
  }
];

const FloatingFormCard = ({ form, index }) => {
  // Distribute cards evenly around the entire page perimeter
  const totalCards = 12;
  const angle = (index / totalCards) * Math.PI * 2;
  const distance = 35; // Distance from center as percentage
  const centerOffsetX = 50;
  const centerOffsetY = 50;
  
  const baseX = centerOffsetX + distance * Math.cos(angle);
  const baseY = centerOffsetY + distance * Math.sin(angle);
  
  // Add randomness to prevent perfect circles
  const randomOffsetX = (Math.random() - 0.5) * 20;
  const randomOffsetY = (Math.random() - 0.5) * 20;
  
  const posX = Math.max(5, Math.min(95, baseX + randomOffsetX));
  const posY = Math.max(5, Math.min(95, baseY + randomOffsetY));
  
  return (
    <div
      className="absolute w-40 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg shadow-xl p-3 animate-float border border-blue-500 opacity-70 hover:opacity-90 transition-opacity"
      style={{
        top: `${posY}%`,
        left: `${posX}%`,
        animationDuration: `${8 + Math.random() * 8}s`,
        animationDelay: `${Math.random() * 3}s`,
      }}
    >
      <h3 className="text-xs font-bold text-blue-300 mb-2">{form.title}</h3>
      <div className="space-y-1">
        {form.fields.map((field, idx) => (
          <div key={idx} className="text-xs">
            <label className="block text-gray-300 font-medium mb-0.5 text-xs">{field.label}</label>
            {field.type === 'textarea' && (
              <div className="bg-gray-800 rounded h-5 border border-gray-600"></div>
            )}
            {field.type === 'file' && (
              <div className="bg-gray-800 rounded h-5 border border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-xs">
                file
              </div>
            )}
            {field.type === 'rating' && (
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="text-yellow-400 text-xs">★</span>
                ))}
              </div>
            )}
            {field.type === 'radio' && (
              <div className="flex gap-1">
                <input type="radio" className="w-2 h-2" disabled />
                <input type="radio" className="w-2 h-2" disabled />
              </div>
            )}
            {field.type === 'select' && (
              <select className="w-full bg-gray-800 rounded h-5 border border-gray-600 text-gray-300 text-xs" disabled>
                <option>Select</option>
              </select>
            )}
            {field.type === 'date' && (
              <input type="date" className="w-full bg-gray-800 rounded h-5 border border-gray-600 text-gray-300 text-xs" disabled />
            )}
            {field.type === 'time' && (
              <input type="time" className="w-full bg-gray-800 rounded h-5 border border-gray-600 text-gray-300 text-xs" disabled />
            )}
            {(field.type === 'text' || field.type === 'email' || field.type === 'number') && (
              <input
                type={field.type}
                placeholder={field.label}
                className="w-full bg-gray-800 rounded h-5 border border-gray-600 text-gray-300 text-xs px-1"
                disabled
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('features');

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    // Small timeout to ensure section is rendered before scrolling
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.28),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.18),_transparent_55%)]" />

      {/* Page layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top navigation */}
        <header className="border-b border-white/5 backdrop-blur bg-slate-950/60">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-lg shadow-sky-500/30">
                <span className="text-lg font-bold">F</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">FormEasy</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200/80">
              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-white transition-colors"
              >
                How it works
              </button>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden text-sm font-medium text-slate-100/80 hover:text-white md:inline-block"
              >
                Log in
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-sky-500/40 hover:bg-sky-400 transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero section */}
        <main className="flex-1">
          <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:py-20 lg:px-8">
            {/* Left – text */}
            <div className="max-w-xl space-y-6">
              <p className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                AI-powered form builder
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.8rem]">
                Design professional forms,
                <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  in seconds not hours.
                </span>
              </h1>
              <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
                Type a short description and let FormEasy generate complete, ready‑to‑share forms
                tailored to your title, purpose and audience – powered by Gemini.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-sm shadow-sky-500/40 hover:bg-sky-400 transition-colors"
                >
                  Start for free
                </Link>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="inline-flex items-center rounded-full border border-slate-600/70 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-slate-400 hover:text-white transition-colors"
                >
                  See how it works
                </button>
              </div>

              <div className="flex flex-wrap gap-6 pt-4 text-xs text-slate-300/80">
                <div>
                  <p className="font-semibold text-slate-100">No coding needed</p>
                  <p>Just describe your form and share the link.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Smart field suggestions</p>
                  <p>Gemini suggests relevant questions for you.</p>
                </div>
              </div>
            </div>

            {/* Right – preview card */}
            <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-sky-900/40 backdrop-blur lg:ml-auto">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Live preview</p>
                  <p className="text-sm font-semibold text-slate-50">Customer feedback form</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  Generated by AI
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="mb-1 block text-[0.7rem] font-medium text-slate-300">
                    Full name
                  </label>
                  <input
                    disabled
                    placeholder="Enter your full name"
                    className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[0.7rem] font-medium text-slate-300">
                    Email address
                  </label>
                  <input
                    disabled
                    type="email"
                    placeholder="you@company.com"
                    className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[0.7rem] font-medium text-slate-300">
                    Overall satisfaction
                  </label>
                  <div className="flex gap-1 text-lg text-amber-300">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>★</span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[0.7rem] font-medium text-slate-300">
                    Additional comments
                  </label>
                  <textarea
                    disabled
                    rows={3}
                    placeholder="Tell us a bit more about your experience..."
                    className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500 resize-none"
                  />
                </div>
                <button
                  disabled
                  className="mt-2 w-full rounded-md bg-sky-500/90 px-4 py-2 text-xs font-semibold text-slate-950 opacity-70"
                >
                  Submit feedback
                </button>
              </div>
            </div>
          </section>

          {/* Simple features strip */}
          {activeSection === 'features' && (
            <section id="features" className="border-t border-slate-800/80 bg-slate-950/80">
              <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6 md:grid-cols-3 text-xs sm:text-sm text-slate-300">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="mb-1 text-sm font-semibold text-slate-50">AI field generation</p>
                    <p>Gemini suggests at least 8 relevant fields from your title, purpose and description.</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="mb-1 text-sm font-semibold text-slate-50">Drag‑and‑drop editor</p>
                    <p>Reorder and refine fields before publishing your form.</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="mb-1 text-sm font-semibold text-slate-50">Share & collect</p>
                    <p>Share a single link and review submissions in a clean dashboard.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* How it works */}
          {activeSection === 'how-it-works' && (
            <section
              id="how-it-works"
              className="border-t border-slate-800/80 bg-slate-950/95"
            >
              <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <h2 className="text-center text-xl font-semibold text-slate-50 sm:text-2xl">
                  How FormEasy works
                </h2>
                <p className="mt-2 text-center text-xs sm:text-sm text-slate-300">
                  From idea to shareable form in four quick steps.
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-4 text-xs sm:text-sm text-slate-300">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
                    <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-sky-300">
                      Step 1
                    </p>
                    <p className="mb-1 text-sm font-semibold text-slate-50">Sign in & start</p>
                    <p>
                      Log in with email or Google from the landing page. After you’re in, click
                      <span className="font-semibold"> “Create form”</span> to open the form creator.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
                    <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-sky-300">
                      Step 2
                    </p>
                    <p className="mb-1 text-sm font-semibold text-slate-50">Describe your form</p>
                    <p>
                      On the <span className="font-semibold">“Describe Your Form”</span> screen, enter a
                      title, purpose and target audience (or skip) and add a short description like
                      “dance class feedback form”.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
                    <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-sky-300">
                      Step 3
                    </p>
                    <p className="mb-1 text-sm font-semibold text-slate-50">Let Gemini generate fields</p>
                    <p>
                      On the <span className="font-semibold">“Generate Your Form”</span> page, click
                      <span className="font-semibold"> “Generate fields”</span>. Gemini reads your title,
                      purpose, audience and description to create at least eight relevant questions you
                      can reorder or edit.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
                    <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-sky-300">
                      Step 4
                    </p>
                    <p className="mb-1 text-sm font-semibold text-slate-50">Save, share & collect</p>
                    <p>
                      Save your form to get a unique link. Share it with anyone to collect responses,
                      then review submissions and export them from the
                      <span className="font-semibold"> submissions</span> view.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/90">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} FormEasy. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#features" className="hover:text-slate-300">Features</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
