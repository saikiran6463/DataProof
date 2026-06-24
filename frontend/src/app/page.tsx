export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-pattern">
        <div className="absolute inset-0 bg-grid-pattern bg-grid" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            Consumer Data Rights Tool
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Claim your data.
            <br />
            <span className="gradient-text">Check the reply.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Companies hold your data. Laws give you the right to see it — or delete it.
            DataProof helps you make the request, then{' '}
            <span className="font-semibold text-gray-900">verifies the company actually complied</span>.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="/request/new" className="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Start a Request
            </a>
            <a href="#how-it-works" className="btn-secondary">
              See how it works
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Privacy by design
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              GDPR & CCPA
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Tracks legal deadlines
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
          <p className="mt-3 text-gray-500">Five steps. You stay in control the whole time.</p>
        </div>

        {/* Steps with connecting line */}
        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-1/2 top-8 hidden h-0.5 w-[75%] -translate-x-1/2 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 md:block" />

          <div className="grid gap-8 md:grid-cols-5">
            {[
              { step: 1, title: 'Pick company & goal', desc: 'Choose who and what', icon: '🏢', color: 'bg-blue-50 border-blue-200' },
              { step: 2, title: 'Know your rights', desc: 'AI finds the law', icon: '⚖️', color: 'bg-indigo-50 border-indigo-200' },
              { step: 3, title: 'Draft & send', desc: 'Legal-ready letter', icon: '✉️', color: 'bg-violet-50 border-violet-200' },
              { step: 4, title: 'Get the reply', desc: 'Upload their response', icon: '📥', color: 'bg-purple-50 border-purple-200' },
              { step: 5, title: 'Verify compliance', desc: 'AI checks for gaps', icon: '🔍', color: 'bg-fuchsia-50 border-fuchsia-200' },
            ].map(({ step, title, desc, icon, color }) => (
              <div
                key={step}
                className="group relative flex flex-col items-center text-center animate-slide-up"
                style={{ animationDelay: `${step * 100}ms`, animationFillMode: 'both' }}
              >
                {/* Step circle */}
                <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 ${color} text-2xl shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-200`}>
                  {icon}
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-600">
                  Step {step}
                </div>
                <h3 className="mt-1.5 text-sm font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-xs text-gray-500">{desc}</p>
                {step === 5 && (
                  <span className="mt-2 badge bg-amber-100 text-amber-700 border border-amber-200">
                    ★ Key step
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-white border-y border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Why DataProof is different</h2>
            <p className="mt-3 text-gray-500">We don't just send the request — we check the answer.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <div className="card group">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Not data-broker cleanup</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Tools like Incogni remove you from broker sites. DataProof works with the companies you actually use — and checks what they send back.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card group">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Not enterprise software</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                OneTrust and Transcend are built for companies. DataProof stands on the person's side — your side.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card group">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Privacy by design</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                You send the request. You pass their identity check. The reply comes to you. The app never pretends to be you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-12 text-center shadow-2xl">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white">
              Ready to claim your data?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-blue-200">
              Pick a company, and we'll handle the legal language, find the right contact, and check the reply when it comes.
            </p>
            <a href="/request/new" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-gray-900 shadow-lg hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-200">
              Start your first request
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
