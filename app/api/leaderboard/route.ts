import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()
    const users = db.collection("users")

    const [balance, taps, referrals, level] = await Promise.all([
      users.find({}).sort({ hashBalance: -1 }).limit(10).toArray(),
      users.find({}).sort({ tapCount: -1 }).limit(10).toArray(),
      users.find({}).sort({ referralCount: -1 }).limit(10).toArray(),
      users.find({}).sort({ level: -1, hashBalance: -1 }).limit(10).toArray(),
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
