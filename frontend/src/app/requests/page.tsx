'use client';

import { useEffect, useState } from 'react';

interface Request {
  id: string;
  companyName: string;
  goal: string;
  status: string;
  createdAt: string;
  applicableLaw: string;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft' },
  SENT: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent' },
  REPLY_RECEIVED: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Reply Received' },
  VERIFIED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/requests')
      .then((res) => res.json())
      .then(setRequests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
        <p className="mt-4 text-sm text-gray-500">Loading your requests…</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center animate-fade-in">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">No requests yet</h2>
        <p className="mt-2 text-gray-500">
          Start by picking a company and telling us what you want.
        </p>
        <a href="/request/new" className="btn-primary mt-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Start your first request
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="mt-1 text-sm text-gray-500">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <a href="/request/new" className="btn-primary text-sm px-4 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          New Request
        </a>
      </div>

      <div className="space-y-3">
        {requests.map((req) => {
          const status = statusConfig[req.status] || statusConfig.DRAFT;
          return (
            <a
              key={req.id}
              href={`/request/${req.id}/verify`}
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200"
            >
              {/* Icon */}
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                req.goal === 'ACCESS' ? 'bg-blue-100' : 'bg-red-100'
              }`}>
                {req.goal === 'ACCESS' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {req.companyName}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {req.goal === 'ACCESS' ? 'Data Access' : 'Data Deletion'} · {req.applicableLaw}
                </p>
              </div>

              {/* Status */}
              <span className={`badge ${status.bg} ${status.text}`}>
                {status.label}
              </span>

              {/* Arrow */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" className="shrink-0 group-hover:stroke-blue-500 group-hover:translate-x-0.5 transition-all">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}
