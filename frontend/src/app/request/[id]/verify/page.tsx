'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function VerifyPage() {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  }

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
    const scoreColor =
      report.completenessScore >= 80
        ? 'text-green-600'
        : report.completenessScore >= 50
        ? 'text-amber-600'
        : 'text-red-600';

    const scoreBg =
      report.completenessScore >= 80
        ? 'from-green-50 to-emerald-50 border-green-200'
        : report.completenessScore >= 50
        ? 'from-amber-50 to-yellow-50 border-amber-200'
        : 'from-red-50 to-rose-50 border-red-200';

    return (
      <div className="mx-auto max-w-2xl px-6 py-12 animate-fade-in">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Compliance Report</h2>
          <p className="mt-2 text-gray-500">Here's how well the company responded to your request.</p>
        </div>

        {/* Score Card */}
        <div className={`rounded-2xl border-2 bg-gradient-to-br ${scoreBg} p-8 text-center mb-8`}>
          <div className={`text-6xl font-extrabold ${scoreColor}`}>
            {report.completenessScore}%
          </div>
          <p className="mt-2 text-sm font-medium text-gray-600">Completeness Score</p>
          <p className="mt-1 text-xs text-gray-400">
            How much of what you were legally owed was actually provided
          </p>
        </div>

        <div className="space-y-5">
          {/* Missing items */}
          {report.missingItems?.length > 0 && (
            <div className="card border-red-100 bg-red-50/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
                </div>
                <h3 className="font-semibold text-red-800">Missing or Incomplete</h3>
                <span className="ml-auto badge bg-red-100 text-red-700">{report.missingItems.length}</span>
              </div>
              <ul className="space-y-2.5">
                {report.missingItems.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fulfilled items */}
          {report.fulfilledItems?.length > 0 && (
            <div className="card border-green-100 bg-green-50/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 className="font-semibold text-green-800">Properly Provided</h3>
                <span className="ml-auto badge bg-green-100 text-green-700">{report.fulfilledItems.length}</span>
              </div>
              <ul className="space-y-2.5">
                {report.fulfilledItems.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <h3 className="font-semibold text-gray-900">Plain-Language Summary</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
              {report.summary}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Upload the Company's Reply</h1>
        <p className="mt-2 text-sm text-gray-500">
          Upload the response you received — PDF, CSV, or email export.
          <br />DataProof will analyze it against your legal entitlements.
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        {/* Drop zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : file
              ? 'border-green-300 bg-green-50/50'
              : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-100/50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.csv,.txt,.eml,.html"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />

          {file ? (
            <div className="space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-400">
                {(file.size / 1024).toFixed(1)} KB · Click to change
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Drop your file here, or <span className="text-blue-600">browse</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  PDF, CSV, TXT, EML, or HTML — up to 20 MB
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/></svg>
              Analyzing for compliance…
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
              </svg>
              Verify Compliance
            </>
          )}
        </button>
      </form>
    </div>
  );
}
