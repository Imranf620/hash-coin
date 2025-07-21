// app/privacy/page.tsx
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 text-white p-8">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">Your privacy is important to us. This policy outlines what data we collect and how it is used.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. Wallet Address</h2>
        <p className="mb-4">We store your TON wallet address to enable gameplay, progression, and reward tracking.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. Usage Data</h2>
        <p className="mb-4">We collect basic usage data (taps, levels, referrals) to improve game experience. No personal information is collected.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Data Security</h2>
        <p className="mb-4">Your data is securely stored and never shared with third parties without your consent.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Changes to Policy</h2>
        <p className="mb-4">We may update this policy from time to time. Any changes will be reflected on this page.</p>

        <p className="text-sm mt-8 opacity-75">Last updated: July 21, 2025</p>
      </div>
    </div>
  );
}
