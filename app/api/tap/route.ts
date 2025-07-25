import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"
import { calculateLevel } from "@/utils/helper"
import connectToDatabase from "@/lib/mongodb"
import UserModel from "@/lib/models/User" 

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase() // ensures Mongoose is connected

    const { walletAddress } = await request.json()
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const user = await UserModel.findOne({ walletAddress })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const now = new Date()
    const lastTap = user.lastTap ? new Date(user.lastTap) : new Date(0)
    const tapCooldown = user.boostsPurchased?.fastTap ? 500 : 1000

    if (now.getTime() - lastTap.getTime() < tapCooldown) {
      return NextResponse.json({ error: "Tap too fast" }, { status: 429 })
    }

    let coinsPerTap = 1
    if (user.boostsPurchased?.multiplier) coinsPerTap *= 2
    if (
      user.boostsPurchased?.timeMultiplier &&
      new Date(user.boostsPurchased.timeMultiplier) > now
    ) {
      coinsPerTap *= 3
    }

    user.hashBalance += coinsPerTap
    user.level = calculateLevel(user.hashBalance)
    user.tapCount += 1
    user.lastTap = now

    await user.save()

    return NextResponse.json(user)
  } catch (error) {
    console.error("Tap API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
