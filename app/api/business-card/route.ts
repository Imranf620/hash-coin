import connectToDatabase from "@/lib/mongodb"
import UserModel from "@/lib/models/User"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, businessCard } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    await connectToDatabase()

    const updatedUser = await UserModel.findOneAndUpdate(
      { walletAddress },
      { $set: { businessCard } },
      { new: true } // return the updated document
    ).lean()

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Business card API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
