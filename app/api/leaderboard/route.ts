// app/api/leaderboard/route.ts
import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import UserModel from "@/lib/models/User"

export async function GET() {
  try {
    await connectToDatabase() // ensure mongoose is connected

    const [balance, taps, referrals, level] = await Promise.all([
      UserModel.find({}).sort({ hashBalance: -1 }).limit(10).lean(),
      UserModel.find({}).sort({ tapCount: -1 }).limit(10).lean(),
      UserModel.find({}).sort({ referralCount: -1 }).limit(10).lean(),
      UserModel.find({}).sort({ level: -1, hashBalance: -1 }).limit(10).lean(),
    ])

    return NextResponse.json({
      balance,
      taps,
      referrals,
      level,
    })
  } catch (error) {
    console.error("Leaderboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
