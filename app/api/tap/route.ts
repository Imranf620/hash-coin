import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { calculateLevel } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection("users")

    const user = await users.findOne({ walletAddress })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check tap rate limiting
    const now = new Date()
    const lastTap = user.lastTap ? new Date(user.lastTap) : new Date(0)
    const tapCooldown = user.boostsPurchased?.fastTap ? 500 : 1000

    if (now.getTime() - lastTap.getTime() < tapCooldown) {
      return NextResponse.json({ error: "Tap too fast" }, { status: 429 })
    }

    // Calculate coins per tap
    let coinsPerTap = 1
    if (user.boostsPurchased?.multiplier) coinsPerTap *= 2
    if (user.boostsPurchased?.timeMultiplier && new Date(user.boostsPurchased.timeMultiplier) > now) {
      coinsPerTap *= 3
    }

    const newBalance = user.hashBalance + coinsPerTap
    const newLevel = calculateLevel(newBalance)
    const newTapCount = user.tapCount + 1

    const updatedUser = await users.findOneAndUpdate(
      { walletAddress },
      {
        $set: {
          hashBalance: newBalance,
          level: newLevel,
          tapCount: newTapCount,
          lastTap: now,
        },
      },
      { returnDocument: "after" },
    )

    return NextResponse.json(updatedUser.value)
  } catch (error) {
    console.error("Tap API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
