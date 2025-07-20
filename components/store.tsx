"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Clock, Coins, Bot, Star, Sparkles } from "lucide-react"

interface StoreProps {
  user: any
  onUserUpdate: (user: any) => void
}

const storeItems = [
  {
    id: "fastTap",
    name: "Fast Tap",
    description: "Reduce tap cooldown to 0.5 seconds",
    price: 1000,
    icon: Zap,
    color: "text-blue-400",
  },
  {
    id: "multiplier",
    name: "Tap Multiplier",
    description: "Earn 2x coins per tap",
    price: 2500,
    icon: Star,
    color: "text-yellow-400",
  },
  {
    id: "autoTap",
    name: "Auto Tap",
    description: "Automatically earn 1 coin every 5 seconds",
    price: 5000,
    icon: Bot,
    color: "text-green-400",
  },
  {
    id: "xpBoost",
    name: "XP Boost",
    description: "Double XP gain for 1 hour",
    price: 500,
    icon: Sparkles,
    color: "text-purple-400",
    temporary: true,
  },
  {
    id: "timeMultiplier",
    name: "Time Multiplier",
    description: "3x coins for 30 minutes",
    price: 1500,
    icon: Clock,
    color: "text-orange-400",
    temporary: true,
  },
]

export default function Store({ user, onUserUpdate }: StoreProps) {
  const handlePurchase = async (itemId: string, price: number) => {
    if (user.hashBalance < price) return

    try {
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: user.walletAddress,
          itemId,
          price,
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        onUserUpdate(updatedUser)
      }
    } catch (error) {
      console.error("Purchase error:", error)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Hash Coin Store
          </CardTitle>
          <CardDescription className="text-white/70">Spend your HASH coins on powerful upgrades</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {storeItems.map((item) => {
          const Icon = item.icon
          const owned = user.boostsPurchased?.[item.id]
          const canAfford = user.hashBalance >= item.price

          return (
            <Card key={item.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-8 w-8 ${item.color}`} />
                    <div>
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        {item.name}
                        {owned && !item.temporary && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                            Owned
                          </Badge>
                        )}
                      </h3>
                      <p className="text-white/70 text-sm">{item.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-white font-bold mb-2">{item.price.toLocaleString()} HASH</div>
                    <Button
                      onClick={() => handlePurchase(item.id, item.price)}
                      disabled={!canAfford || (owned && !item.temporary)}
                      size="sm"
                      className={canAfford ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-500"}
                    >
                      {owned && !item.temporary ? "Owned" : "Buy"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
