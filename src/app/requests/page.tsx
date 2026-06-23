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
    return <p className="text-gray-500">Loading your requests…</p>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No requests yet.</p>
        <a
          href="/request/new"
          className="inline-block rounded-lg bg-primary-600 px-5 py-2.5 text-white font-medium hover:bg-primary-700"
        >
          Start your first request
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Requests</h1>
      <div className="space-y-3">
        {requests.map((req) => (
          <a
            key={req.id}
            href={`/request/${req.id}/verify`}
            className="flex items-center justify-between rounded-lg border bg-white p-4 hover:shadow-sm transition"
          >
            <div>
              <p className="font-medium">{req.companyName}</p>
              <p className="text-sm text-gray-500">
                {req.goal === 'ACCESS' ? '📄 Access' : '🗑️ Deletion'} ·{' '}
                {req.applicableLaw}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  req.status === 'VERIFIED'
                    ? 'bg-green-100 text-green-700'
                    : req.status === 'SENT'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {req.status}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
