'use client';

import { useState } from 'react';

type Goal = 'ACCESS' | '';

export default function NewRequestPage() {
  const [company, setCompany] = useState('');
  const [goal, setGoal] = useState<Goal>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: company, goal }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 animate-fade-in">
        {/* Success header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your Request is Ready</h2>
          <p className="mt-2 text-gray-500">Review the details below, then send it to the company.</p>
        </div>

        {/* Request details card */}
        <div className="card space-y-6">
          {/* Company & Law */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Company</span>
              <p className="mt-0.5 text-lg font-semibold text-gray-900">{result.companyName}</p>
            </div>
            <span className="badge bg-blue-100 text-blue-700 border border-blue-200">
              {result.applicableLaw}
            </span>
          </div>

          <hr className="border-gray-100" />

          {/* Rights */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Your Legal Rights</span>
            <ul className="mt-3 space-y-2">
              {result.rights?.map((r: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-gray-100" />

          {/* Draft Letter */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Draft Letter</span>
              <button
                onClick={() => navigator.clipboard.writeText(result.draftLetter)}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </button>
            </div>
            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 font-sans">
                {result.draftLetter}
              </pre>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Contact */}
          <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-800">Send to</span>
              <p className="text-sm font-medium text-amber-900">{result.contactInfo}</p>
            </div>
          </div>
        </div>

        {/* Next step */}
        <div className="mt-8 text-center">
          <a href={`/request/${result.id}/verify`} className="btn-primary">
            I sent it — now upload the reply
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">New Data Request</h1>
        <p className="mt-2 text-sm text-gray-500">
          Tell us which company and what you want. We'll handle the rest.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company name
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Spotify, Amazon, TikTok"
            required
            className="input-field"
          />
        </div>

        {/* Goal */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What do you want?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGoal('ACCESS')}
              className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all duration-200 ${
                goal === 'ACCESS'
                  ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-500/10'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {goal === 'ACCESS' && (
                <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-xl">📄</div>
              <span className={`text-sm font-semibold ${goal === 'ACCESS' ? 'text-blue-700' : 'text-gray-700'}`}>
                See my data
              </span>
              <span className="text-xs text-gray-400">Subject Access Request</span>
            </button>
            <button
              type="button"
              disabled
              className="relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 border-gray-200 bg-gray-50 opacity-40 cursor-not-allowed"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">🗑️</div>
              <span className="text-sm font-semibold text-gray-400">Delete my data</span>
              <span className="text-xs text-gray-300">Coming soon</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!company || !goal || loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/></svg>
              Preparing your request…
            </>
          ) : (
            <>
              Generate My Request
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
