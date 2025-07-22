import { useEffect } from 'react';

declare global {
  interface Window {
    Telegram?: any;
  }
}

export default function WebApp() {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      console.log("Telegram WebApp initialized", window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  return (
    <div>
      <h1>Welcome to HashCoin Web App!</h1>
      {/* Your app UI here */}
    </div>
  );
}
