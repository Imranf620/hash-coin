import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { generateReferralCode, calculateLevel } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection("users")

    // Check if user exists
    let user = await users.findOne({ walletAddress })

    if (!user) {
      // Create new user
      const newUser = {
        walletAddress,
        hashBalance: 0,
        level: 1,
        tapCount: 0,
        referralCode: generateReferralCode(),
        boostsPurchased: {},
        isConversionUnlocked: false,
        createdAt: new Date(),
      }

      const result = await users.insertOne(newUser)
      user = { ...newUser, _id: result.insertedId }
    } else {
      // Update level based on current balance
      const newLevel = calculateLevel(user.hashBalance)
      if (newLevel !== user.level) {
        await users.updateOne({ walletAddress }, { $set: { level: newLevel } })
        user.level = newLevel
      }
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("User API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
