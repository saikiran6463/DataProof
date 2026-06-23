'use client';

import { useState } from 'react';

type Goal = 'ACCESS' | 'DELETE' | '';

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
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Your Request is Ready</h2>

        <div className="rounded-lg border bg-white p-6 space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Company</span>
            <p className="font-semibold">{result.companyName}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">
              Applicable Law
            </span>
            <p>{result.applicableLaw}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">
              Your Rights
            </span>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {result.rights?.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">
              Draft Letter
            </span>
            <pre className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-4 text-sm border">
              {result.draftLetter}
            </pre>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Send To</span>
            <p className="text-sm">{result.contactInfo}</p>
          </div>
        </div>

        <a
          href={`/request/${result.id}/verify`}
          className="inline-block rounded-lg bg-primary-600 px-5 py-2.5 text-white font-medium hover:bg-primary-700"
        >
          I sent it — now upload the reply →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Data Request</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Company name
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Spotify, Amazon, TikTok"
            required
            className="w-full rounded-lg border px-4 py-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Goal */}
        <div>
          <label className="block text-sm font-medium mb-1">
            What do you want?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGoal('ACCESS')}
              className={`rounded-lg border p-3 text-sm font-medium transition ${
                goal === 'ACCESS'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'hover:border-gray-400'
              }`}
            >
              📄 See my data
            </button>
            <button
              type="button"
              onClick={() => setGoal('DELETE')}
              className={`rounded-lg border p-3 text-sm font-medium transition ${
                goal === 'DELETE'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'hover:border-gray-400'
              }`}
            >
              🗑️ Delete my data
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!company || !goal || loading}
          className="w-full rounded-lg bg-primary-600 py-3 text-white font-medium hover:bg-primary-700 disabled:opacity-50 transition"
        >
          {loading ? 'Preparing…' : 'Generate My Request'}
        </button>
      </form>
    </div>
  );
}
