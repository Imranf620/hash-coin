
// lib/auth-utils.ts
import connectToDatabase from "./mongodb"

export async function verifyAuthToken(token: string): Promise<string | null> {
  try {
    const db = await connectToDatabase()
    const tokens = db.collection("tokens")
    
    const tokenDoc = await tokens.findOne({ token })
    
    if (!tokenDoc) {
      return null
    }
    
    if (new Date() > tokenDoc.expiresAt) {
      // Clean up expired token
      await tokens.deleteOne({ token })
      return null
    }
    
    return tokenDoc.walletAddress
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export async function extractWalletFromRequest(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return await verifyAuthToken(token)
}

