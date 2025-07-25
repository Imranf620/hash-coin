import { BoostsPurchased, BusinessCard, User } from "./User"

export interface LoginRequest {
  walletAddress: string
}

export interface LoginResponse {
  token: string
  user: User
  expiresAt: string
}

export interface UserUpdateRequest {
  hashBalance?: number
  tapCount?: number
  username?: string
  businessCard?: BusinessCard
  boostsPurchased?: BoostsPurchased
}