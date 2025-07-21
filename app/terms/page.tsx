// app/terms/page.tsx
export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 text-white p-8">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
        <p className="mb-4">
          Welcome to Hash Coin. By using our game, you agree to the following terms. If you do not agree, please do not use our service.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. Use of Service</h2>
        <p className="mb-4">You may use Hash Coin only for personal, non-commercial purposes and according to these terms.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. Wallet Connection</h2>
        <p className="mb-4">By connecting your TON wallet, you acknowledge that you are responsible for managing your wallet security.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Game Rules</h2>
        <p className="mb-4">We reserve the right to modify game rules, rewards, and mechanics at any time without notice.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Termination</h2>
        <p className="mb-4">We may suspend or terminate access for any user who violates our rules or engages in malicious activity.</p>

        <p className="text-sm mt-8 opacity-75">Last updated: July 21, 2025</p>
      </div>
    </div>
  );
}
