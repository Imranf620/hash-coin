export interface User {
  _id?: string
  walletAddress: string
  username?: string
  hashBalance: number
  level: number
  tapCount: number
  referralCode: string
  referredBy?: string
  referralCount?: number
  businessCard?: {
    name?: string
    title?: string
    bio?: string
    website?: string
    twitter?: string
    telegram?: string
  }
  boostsPurchased?: {
    fastTap?: boolean
    multiplier?: boolean
    autoTap?: boolean
    xpBoost?: Date
    timeMultiplier?: Date
  }
  isConversionUnlocked: boolean
  createdAt: Date
  lastTap?: Date
}

export function calculateLevel(hashBalance: number): number {
  return Math.min(Math.floor(hashBalance / 1000) + 1, 10)
}

export function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}
