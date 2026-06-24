import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DataProof — Claim & Verify Your Data Rights',
  description:
    'Ask any company for the data they hold on you, then check whether they actually gave it all.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#fafbff] text-gray-900 antialiased">
        {/* Navigation */}
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Data<span className="text-blue-600">Proof</span>
              </span>
            </a>
            <nav className="flex items-center gap-2">
              <a
                href="/request/new"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                New Request
              </a>
              <a
                href="/requests"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                My Requests
              </a>
              <a
                href="/request/new"
                className="ml-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Get Started
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white mt-20">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-gray-500">
                © 2026 DataProof. Privacy by design.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <span>GDPR</span>
                <span>·</span>
                <span>CCPA</span>
                <span>·</span>
                <span>Your data, your rights</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
