// app/api/user/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import UserModel from "@/lib/models/User"
import { calculateLevel } from "@/utils/helper"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get wallet address from query params
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')
    
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const user = await UserModel.findOne({ walletAddress })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Get user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase()

    const { walletAddress, ...updates } = await request.json()
    
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    // Calculate new level if hashBalance is being updated
    if (updates.hashBalance !== undefined) {
      updates.level = calculateLevel(updates.hashBalance)
    }

    const user = await UserModel.findOneAndUpdate(
      { walletAddress },
      { 
        $set: { 
          ...updates, 
          lastUpdated: new Date() 
        } 
      },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validations
      }
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Update user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const userData = await request.json()
    
    if (!userData.walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ walletAddress: userData.walletAddress })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create new user with default values
    const newUser = new UserModel({
      walletAddress: userData.walletAddress,
      username: userData.username || '',
      hashBalance: 0,
      level: 1,
      tapCount: 0,
      referralCode: userData.referralCode || `REF_${Date.now()}`,
      referredBy: userData.referredBy,
      referralCount: 0,
      businessCard: userData.businessCard || {},
      boostsPurchased: userData.boostsPurchased || {
        fastTap: false,
        multiplier: false,
        autoTap: false,
      },
      isConversionUnlocked: false,
      createdAt: new Date(),
    })

    await newUser.save()

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Create user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}