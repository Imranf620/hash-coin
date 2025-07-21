"use client"

import { useState, useEffect } from "react"
import { TonConnectButton, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Zap, Users, Trophy, ShoppingBag, CreditCard, Lock } from "lucide-react"
import GameInterface from "@/components/game-interface"
import Store from "@/components/store"
import Leaderboard from "@/components/leaderboard"
import BusinessCard from "@/components/business-card"
import ReferralSystem from "@/components/referral-system"

export default function HomePage() {
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wallet?.account?.address) {
      fetchOrCreateUser(wallet.account.address)
    } else {
      setLoading(false)
    }
  }, [wallet])

  const fetchOrCreateUser = async (walletAddress: string) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      })
      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error("Error fetching user:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = (updatedUser: any) => {
    setUser(updatedUser)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading Hash Coin...</div>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🪙</div>
          <h1 className="text-4xl font-bold text-white mb-2">Hash Coin</h1>
          <p className="text-xl text-white/80 mb-8">Tap to Earn • Level Up • Get Rich</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Connect Your TON Wallet</h2>
            <p className="text-white/80 mb-6">Start earning Hash Coins by connecting your TON wallet</p>
            <TonConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600">
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="text-3xl">🪙</div>
            <h1 className="text-2xl font-bold text-white">Hash Coin</h1>
          </div>
          <TonConnectButton />
        </header>

        {user && (
          <div className="grid gap-4 mb-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Coins className="h-5 w-5" />
                      {user?.hashBalance?.toLocaleString()} HASH
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Level {user?.level} • {user?.tapCount} total taps
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {user?.level < 10
                      ? `${Math.floor((user?.hashBalance % 1000) / 10)}% to Level ${user?.level + 1}`
                      : "Max Level"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={user?.level < 10 ? (user?.hashBalance % 1000) / 10 : 100} className="h-2 bg-white/20" />
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="game" className="data-[state=active]:bg-white/20">
              <Zap className="h-4 w-4 mr-1" />
              Tap
            </TabsTrigger>
            <TabsTrigger value="store" className="data-[state=active]:bg-white/20">
              <ShoppingBag className="h-4 w-4 mr-1" />
              Store
            </TabsTrigger>
            <TabsTrigger value="referrals" className="data-[state=active]:bg-white/20">
              <Users className="h-4 w-4 mr-1" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white/20">
              <Trophy className="h-4 w-4 mr-1" />
              Leaders
            </TabsTrigger>
            <TabsTrigger value="card" className="data-[state=active]:bg-white/20">
              <CreditCard className="h-4 w-4 mr-1" />
              Card
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="mt-4">
            {user && <GameInterface user={user} onUserUpdate={updateUser} />}
          </TabsContent>

          <TabsContent value="store" className="mt-4">
            {user && <Store user={user} onUserUpdate={updateUser} />}
          </TabsContent>

          <TabsContent value="referrals" className="mt-4">
            {user && <ReferralSystem user={user} onUserUpdate={updateUser} />}
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="card" className="mt-4">
            {user && <BusinessCard user={user} onUserUpdate={updateUser} />}
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Button disabled className="bg-white/10 backdrop-blur-sm border-white/20 text-white/50 cursor-not-allowed">
            <Lock className="h-4 w-4 mr-2" />
            Convert to USD (Locked Until Launch)
          </Button>
          <p className="text-white/60 text-sm mt-2">Conversion will be available after official launch</p>
        </div>
      </div>
    </div>
  )
}
