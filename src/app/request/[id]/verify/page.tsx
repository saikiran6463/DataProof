'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function VerifyPage() {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/requests/${id}/verify`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (report) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Compliance Report</h2>

        {/* Overall score */}
        <div className="flex items-center gap-4 rounded-lg border bg-white p-5">
          <div
            className={`text-4xl font-bold ${
              report.completenessScore >= 80
                ? 'text-green-600'
                : report.completenessScore >= 50
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {report.completenessScore}%
          </div>
          <div>
            <p className="font-medium">Completeness Score</p>
            <p className="text-sm text-gray-500">
              How much of what you were legally owed was actually provided
            </p>
          </div>
        </div>

        {/* Missing items */}
        {report.missingItems?.length > 0 && (
          <div className="rounded-lg border bg-white p-5 space-y-3">
            <h3 className="font-semibold text-red-700">
              ⚠️ Missing or Incomplete
            </h3>
            <ul className="space-y-2">
              {report.missingItems.map((item: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="text-red-500">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Fulfilled items */}
        {report.fulfilledItems?.length > 0 && (
          <div className="rounded-lg border bg-white p-5 space-y-3">
            <h3 className="font-semibold text-green-700">✓ Provided</h3>
            <ul className="space-y-2">
              {report.fulfilledItems.map((item: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Plain-language summary */}
        <div className="rounded-lg border bg-white p-5">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {report.summary}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Upload the Company's Reply</h1>
      <p className="text-gray-600 mb-6">
        Upload the response you received — PDF, CSV, or email export. DataProof
        will read it and check what's missing.
      </p>

      <form onSubmit={handleUpload} className="space-y-5">
        <div className="rounded-lg border-2 border-dashed p-8 text-center">
          <input
            type="file"
            accept=".pdf,.csv,.txt,.eml,.html"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mx-auto"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-500">{file.name}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className="w-full rounded-lg bg-primary-600 py-3 text-white font-medium hover:bg-primary-700 disabled:opacity-50 transition"
        >
          {loading ? 'Analyzing…' : 'Verify Compliance'}
        </button>
      </form>
    </div>
  );
}
