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
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <a href="/" className="text-xl font-bold text-primary-700">
              DataProof
            </a>
            <nav className="flex gap-6 text-sm font-medium text-gray-600">
              <a href="/request/new" className="hover:text-primary-600">
                New Request
              </a>
              <a href="/requests" className="hover:text-primary-600">
                My Requests
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
