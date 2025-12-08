"use client"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[#222222] px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-[#222222]/70">Last updated: Today</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Data We Collect</h2>
          <p>
            Account info (email), profile details you provide, and usage analytics to improve the app. We do not sell
            your data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. How We Use Data</h2>
          <p>
            To personalize recommendations, maintain your account, improve the product, and secure the platform. AI
            features may process your prompts to generate responses.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Sharing</h2>
          <p>
            We share data only with trusted processors (e.g., hosting, analytics). We do not share personal data for
            advertising without consent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Security</h2>
          <p>We use encryption and access controls, but no system is perfectly secure. Keep your credentials safe.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Your Choices</h2>
          <p>You may update or delete your profile data and request export or deletion. Contact support for help.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Updates</h2>
          <p>We may revise this policy. Continued use after changes means you accept the updated policy.</p>
        </section>
      </div>
    </div>
  )
}
