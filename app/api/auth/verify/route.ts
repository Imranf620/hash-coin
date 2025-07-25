// app/api/auth/verify/route.ts
import connectToDatabase from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    const db = await connectToDatabase()
    const tokens = db.collection("tokens")
    
    const tokenDoc = await tokens.findOne({ token })
    
    if (!tokenDoc) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    
    if (new Date() > tokenDoc.expiresAt) {
      await tokens.deleteOne({ token })
      return NextResponse.json({ error: "Token expired" }, { status: 401 })
    }
    
    return NextResponse.json({ 
      valid: true, 
      walletAddress: tokenDoc.walletAddress 
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}