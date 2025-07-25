import  connectToDatabase  from "@/lib/mongodb"
import UserModel from "@/lib/models/User"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, referralCode } = await request.json()

    if (!walletAddress || !referralCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    const user = await UserModel.findOne({ walletAddress })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.referredBy) {
      return NextResponse.json({ error: "Already used a referral code" }, { status: 400 })
    }

    const referrer = await UserModel.findOne({ referralCode })
    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 })
    }

    if (referrer.walletAddress === walletAddress) {
      return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 })
    }

    const bonusAmount = 500

    // Update both users
    await UserModel.updateOne(
      { walletAddress },
      {
        $set: { referredBy: referrer.walletAddress },
        $inc: { hashBalance: bonusAmount },
      }
    )

    await UserModel.updateOne(
      { walletAddress: referrer.walletAddress },
      {
        $inc: {
          hashBalance: bonusAmount,
          referralCount: 1,
        },
      }
    )

    const updatedUser = await UserModel.findOne({ walletAddress })
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Referral API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
