export function calculateLevel(hashBalance: number): number {
  return Math.min(Math.floor(hashBalance / 1000) + 1, 10)
}

export function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function generateAuthToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}