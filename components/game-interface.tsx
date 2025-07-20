"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Zap, Star } from "lucide-react"

interface GameInterfaceProps {
  user: any
  onUserUpdate: (user: any) => void
}

export default function GameInterface({ user, onUserUpdate }: GameInterfaceProps) {
  const [tapping, setTapping] = useState(false)
  const [lastTap, setLastTap] = useState(0)
  const [tapAnimation, setTapAnimation] = useState(false)

  const handleTap = useCallback(async () => {
    const now = Date.now()
    const tapCooldown = user.boostsPurchased?.fastTap ? 500 : 1000 // 0.5s or 1s cooldown

    if (now - lastTap < tapCooldown) return

    setLastTap(now)
    setTapping(true)
    setTapAnimation(true)

    setTimeout(() => setTapAnimation(false), 200)

    try {
      const response = await fetch("/api/tap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: user.walletAddress }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        onUserUpdate(updatedUser)
      }
    } catch (error) {
      console.error("Tap error:", error)
    } finally {
      setTapping(false)
    }
  }, [user, lastTap, onUserUpdate])

  const coinsPerTap = user.boostsPurchased?.multiplier ? 2 : 1
  const tapRate = user.boostsPurchased?.fastTap ? "2 taps/sec" : "1 tap/sec"

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-4">
          <CardContent className="p-6">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Zap className="h-3 w-3 mr-1" />+{coinsPerTap} per tap
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Star className="h-3 w-3 mr-1" />
                {tapRate}
              </Badge>
            </div>

            <div className="relative">
              <Button
                onClick={handleTap}
                disabled={tapping}
                className={`w-48 h-48 rounded-full text-6xl bg-gradient-to-br from-yellow-300 to-orange-400 hover:from-yellow-200 hover:to-orange-300 border-4 border-white/30 shadow-2xl transition-all duration-200 ${
                  tapAnimation ? "scale-95 shadow-xl" : "scale-100"
                }`}
              >
                🪙
              </Button>

              {tapAnimation && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-2xl font-bold text-white animate-bounce">+{coinsPerTap}</div>
                </div>
              )}
            </div>

            <p className="text-white/80 mt-4">Tap the coin to earn Hash Coins!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 text-center">
            <Coins className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{user.hashBalance.toLocaleString()}</div>
            <div className="text-white/70 text-sm">Total HASH</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-blue-300 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{user.tapCount.toLocaleString()}</div>
            <div className="text-white/70 text-sm">Total Taps</div>
          </CardContent>
        </Card>
      </div>

      {user.boostsPurchased?.autoTap && (
        <Card className="bg-green-500/20 backdrop-blur-sm border-green-400/30">
          <CardContent className="p-4 text-center">
            <div className="text-green-300 font-semibold">🤖 Auto-Tap Active</div>
            <div className="text-green-200 text-sm">Earning +1 HASH every 5 seconds</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
