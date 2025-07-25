import connectToDatabase from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"


export async function POST(request: NextRequest) {
  try {
    const { walletAddress, itemId, price } = await request.json()

    if (!walletAddress || !itemId || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const users = db.collection("users")

    const user = await users.findOne({ walletAddress })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.hashBalance < price) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Check if already owned (for permanent items)
    const permanentItems = ["fastTap", "multiplier", "autoTap"]
    if (permanentItems.includes(itemId) && user.boostsPurchased?.[itemId]) {
      return NextResponse.json({ error: "Item already owned" }, { status: 400 })
    }

    const newBalance = user.hashBalance - price
    const updateData: any = {
      hashBalance: newBalance,
      [`boostsPurchased.${itemId}`]:
        itemId === "xpBoost" || itemId === "timeMultiplier"
          ? new Date(Date.now() + (itemId === "xpBoost" ? 3600000 : 1800000)) // 1 hour or 30 minutes
          : true,
    }

    const updatedUser = await users.findOneAndUpdate(
      { walletAddress },
      { $set: updateData },
      { returnDocument: "after" },
    )

    return NextResponse.json(updatedUser.value)
  } catch (error) {
    console.error("Purchase API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
