"use client"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-[#222222] px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-[#222222]/70">Last updated: Today</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Acceptance</h2>
          <p>By using Bachat Saathi you agree to these terms and our privacy policy.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Use of the Service</h2>
          <p>
            You must be 18+ and provide accurate information. Do not misuse, reverse engineer, or interfere with the
            platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Accounts</h2>
          <p>
            You are responsible for safeguarding your account. Notify us of any unauthorized use. We may suspend
            accounts for abuse.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Content & Data</h2>
          <p>
            You own your data. We may process it to deliver features. Do not upload unlawful or harmful content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Disclaimers</h2>
          <p>
            Bachat Saathi provides guidance only and does not offer regulated financial advice. Use at your own risk.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Changes</h2>
          <p>We may update these terms. Continued use means you accept the changes.</p>
        </section>
      </div>
    </div>
  )
}
