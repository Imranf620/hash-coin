import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, referralCode } = await request.json()

    if (!walletAddress || !referralCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection("users")

    const user = await users.findOne({ walletAddress })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.referredBy) {
      return NextResponse.json({ error: "Already used a referral code" }, { status: 400 })
    }

    // Find referrer
    const referrer = await users.findOne({ referralCode })
    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 })
    }

    if (referrer.walletAddress === walletAddress) {
      return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 })
    }

    // Update both users
    const bonusAmount = 500

    // Update referee (current user)
    await users.updateOne(
      { walletAddress },
      {
        $set: { referredBy: referrer.walletAddress },
        $inc: { hashBalance: bonusAmount },
      },
    )

    // Update referrer
    await users.updateOne(
      { walletAddress: referrer.walletAddress },
      {
        $inc: {
          hashBalance: bonusAmount,
          referralCount: 1,
        },
      },
    )

    const updatedUser = await users.findOne({ walletAddress })
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Referral API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
