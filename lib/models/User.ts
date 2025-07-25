// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose"
import type { BusinessCard, BoostsPurchased } from "@/types/User"

export interface IUser extends Document {
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

const BusinessCardSchema = new Schema<BusinessCard>(
  {
    name: String,
    title: String,
    bio: String,
    website: String,
    twitter: String,
    telegram: String,
  },
  { _id: false }
)

const BoostsPurchasedSchema = new Schema<BoostsPurchased>(
  {
    fastTap: Boolean,
    multiplier: Boolean,
    autoTap: Boolean,
    xpBoost: Date,
    timeMultiplier: Date,
  },
  { _id: false }
)

const UserSchema = new Schema<IUser>({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String },
  hashBalance: { type: Number, required: true, default: 0 },
  level: { type: Number, required: true, default: 1 },
  tapCount: { type: Number, required: true, default: 0 },
  referralCode: { type: String, required: true },
  referredBy: { type: String },
  referralCount: { type: Number, default: 0 },
  businessCard: BusinessCardSchema,
  boostsPurchased: BoostsPurchasedSchema,
  isConversionUnlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastTap: { type: Date },
})

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
export default UserModel
