import { NextRequest, NextResponse } from "next/server"
import UserModel from "@/lib/models/User"
import { calculateLevel, generateAuthToken, generateReferralCode } from "@/utils/helper"
import connectToDatabase from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    // Connect to Mongoose (this initializes connection once)
    await connectToDatabase()

    let user = await UserModel.findOne({ walletAddress })

    if (!user) {
      user = await UserModel.create({
        walletAddress,
        hashBalance: 0,
        level: 1,
        tapCount: 0,
        referralCode: generateReferralCode(),
        boostsPurchased: {},
        isConversionUnlocked: false,
        createdAt: new Date(),
      })
    } else {
      const newLevel = calculateLevel(user.hashBalance)
      if (newLevel !== user.level) {
        user.level = newLevel
        await user.save()
      }
    }

    const token = generateAuthToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // You can create a Token model or use Mongoose directly again for this
    // For now, just skip token storage if not using a model

    return NextResponse.json({
      token,
      user,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
