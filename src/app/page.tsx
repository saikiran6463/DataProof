export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Claim your data.{' '}
          <span className="text-primary-600">Check the reply.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          DataProof helps you ask any company for the data they hold on you —
          then verifies whether they actually gave it all.
        </p>
        <a
          href="/request/new"
          className="inline-block rounded-lg bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-700 transition"
        >
          Start a Request
        </a>
      </section>

      {/* Steps */}
      <section className="grid gap-6 md:grid-cols-5">
        {[
          { step: 1, title: 'Pick company & goal', icon: '🏢' },
          { step: 2, title: 'Know your rights', icon: '⚖️' },
          { step: 3, title: 'Draft & send', icon: '✉️' },
          { step: 4, title: 'Get the reply', icon: '📥' },
          { step: 5, title: 'Verify gaps & dodges', icon: '🔍' },
        ].map(({ step, title, icon }) => (
          <div
            key={step}
            className="rounded-lg border bg-white p-4 text-center shadow-sm"
          >
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-xs font-semibold text-primary-600 uppercase">
              Step {step}
            </div>
            <div className="mt-1 text-sm font-medium">{title}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
