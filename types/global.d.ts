declare global {
  interface Window {
    initGame?: () => void;
    cleanupGame?:()=>void
  }
}

export {};
