// types/User.ts

export interface BusinessCard {
  name?: string
  title?: string
  bio?: string
  website?: string
  twitter?: string
  telegram?: string
}

export interface BoostsPurchased {
  fastTap?: boolean
  multiplier?: boolean
  autoTap?: boolean
  xpBoost?: Date
  timeMultiplier?: Date
}

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
  businessCard?: BusinessCard
  boostsPurchased?: BoostsPurchased
  isConversionUnlocked: boolean
  createdAt: Date
  lastTap?: Date
}

export interface AuthToken {
  token: string
}

// Returned from login endpoint
export interface LoginResponse {
  token: string
  user: User
}

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}