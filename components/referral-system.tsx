"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Copy, Gift, Share } from "lucide-react"

interface ReferralSystemProps {
  user: any
  onUserUpdate: (user: any) => void
}

export default function ReferralSystem({ user, onUserUpdate }: ReferralSystemProps) {
  const [referralCode, setReferralCode] = useState("")
  const [loading, setLoading] = useState(false)

  const referralLink = `${window.location.origin}?ref=${user.referralCode}`

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    // You could add a toast notification here
  }

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join Hash Coin!",
        text: "Start earning Hash Coins by tapping! Use my referral link to get bonus coins.",
        url: referralLink,
      })
    } else {
      copyReferralLink()
    }
  }

  const submitReferralCode = async () => {
    if (!referralCode.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: user.walletAddress,
          referralCode: referralCode.trim(),
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        onUserUpdate(updatedUser)
        setReferralCode("")
      }
    } catch (error) {
      console.error("Referral error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Referral Program
          </CardTitle>
          <CardDescription className="text-white/70">Invite friends and earn bonus Hash Coins together</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Your Referral Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{user?.referralCount || 0}</div>
                <div className="text-white/70 text-sm">Friends Referred</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{(user?.referralCount || 0) * 500}</div>
                <div className="text-white/70 text-sm">Bonus HASH Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Share Your Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="bg-white/10 border-white/20 text-white" />
              <Button
                onClick={copyReferralLink}
                size="icon"
                variant="outline"
                className="border-white/20 bg-transparent"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={shareReferralLink}
                size="icon"
                variant="outline"
                className="border-white/20 bg-transparent"
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                <Gift className="h-3 w-3 mr-1" />
                Both you and your friend get 500 HASH!
              </Badge>
            </div>
          </CardContent>
        </Card>

        {!user.referredBy && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Enter Referral Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Enter friend's referral code"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button
                  onClick={submitReferralCode}
                  disabled={loading || !referralCode.trim()}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  {loading ? "Applying..." : "Apply"}
                </Button>
              </div>
              <p className="text-white/70 text-sm">Get 500 bonus HASH coins by using a friend's referral code!</p>
            </CardContent>
          </Card>
        )}

        {user.referredBy && (
          <Card className="bg-green-500/20 backdrop-blur-sm border-green-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-green-300 font-semibold">✅ Referral Applied</div>
              <div className="text-green-200 text-sm">You were referred by: {user.referredBy}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
