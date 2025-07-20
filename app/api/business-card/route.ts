import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, businessCard } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection("users")

    const updatedUser = await users.findOneAndUpdate(
      { walletAddress },
      { $set: { businessCard } },
      { returnDocument: "after" },
    )

    if (!updatedUser.value) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser.value)
  } catch (error) {
    console.error("Business card API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
