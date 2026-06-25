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
    const score: number = report.completeness;
    const verdict: string = report.verdict;

    const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
    const scoreBg = score >= 80
      ? 'from-green-50 to-emerald-50 border-green-200'
      : score >= 50
      ? 'from-amber-50 to-yellow-50 border-amber-200'
      : 'from-red-50 to-rose-50 border-red-200';

    const statusStyle: Record<string, { badge: string; dot: string }> = {
      provided: { badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
      unclear:  { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
      missing:  { badge: 'bg-red-100 text-red-700',     dot: 'bg-red-500'   },
    };

    return (
      <div className="mx-auto max-w-2xl px-6 py-12 animate-fade-in">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Compliance Report</h2>
          <p className="mt-2 text-gray-500">{report.summary}</p>
        </div>

        {/* Score Card */}
        <div className={`rounded-2xl border-2 bg-gradient-to-br ${scoreBg} p-8 text-center mb-8`}>
          <div className={`text-6xl font-extrabold ${scoreColor}`}>{score}%</div>
          <p className="mt-2 text-sm font-medium text-gray-600">Completeness Score</p>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            verdict === 'complete' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {verdict}
          </span>
        </div>

        {/* Per-obligation checks */}
        <div className="card mb-5">
          <h3 className="font-semibold text-gray-900 mb-4">Obligation Breakdown</h3>
          <div className="space-y-4">
            {report.checks?.map((check: any) => {
              const style = statusStyle[check.status] ?? statusStyle.missing;
              return (
                <div key={check.id} className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">{check.obligation}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style.badge}`}>
                        {check.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{check.note}</p>
                    {check.citation && (
                      <p className="mt-0.5 text-xs text-blue-600 font-medium">{check.citation}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended next step */}
        {report.recommendedNextStep && (
          <div className="card border-blue-100 bg-blue-50/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="font-semibold text-gray-900">Recommended Next Step</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">{report.recommendedNextStep}</p>
          </div>
        )}
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
