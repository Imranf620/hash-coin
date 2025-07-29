"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Coins, Zap, Users, Crown, Medal, Award } from "lucide-react"
import Loading from "./ui/loading"

export default function Leaderboard() {
  const [leaderboards, setLeaderboards] = useState({
    balance: [],
    taps: [],
    referrals: [],
    level: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboards()
  }, [])

  const fetchLeaderboards = async () => {
    try {
      const response = await fetch("/api/leaderboard")
      const data = await response.json()
      setLeaderboards(data)
    } catch (error) {
      console.error("Error fetching leaderboards:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-orange-400" />
      default:
        return <span className="text-white/70 font-bold">#{rank}</span>
    }
  }

  const LeaderboardList = ({ data, type }: { data: any[]; type: string }) => (
    <div className="space-y-2">
      {data.map((user, index) => (
        <Card key={user?._id} className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getRankIcon(index + 1)}
                <div>
                  <div className="text-white font-semibold">
                    {user?.username || `${user?.walletAddress.slice(0, 6)}...${user?.walletAddress.slice(-4)}`}
                  </div>
                  <div className="text-white/70 text-sm">Level {user?.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">
                  {type === "balance" && `${user?.hashBalance.toLocaleString()} HASH`}
                  {type === "taps" && `${user?.tapCount.toLocaleString()} taps`}
                  {type === "referrals" && `${user?.referralCount || 0} referrals`}
                  {type === "level" && `Level ${user?.level}`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (loading) {
    return (
     <Loading/>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboards
          </CardTitle>
          <CardDescription className="text-white/70">See who's leading the Hash Coin revolution</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="balance" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
          <TabsTrigger value="balance" className="data-[state=active]:bg-white/20">
            <Coins className="h-4 w-4 mr-1" />
            Balance
          </TabsTrigger>
          <TabsTrigger value="taps" className="data-[state=active]:bg-white/20">
            <Zap className="h-4 w-4 mr-1" />
            Taps
          </TabsTrigger>
          <TabsTrigger value="referrals" className="data-[state=active]:bg-white/20">
            <Users className="h-4 w-4 mr-1" />
            Referrals
          </TabsTrigger>
          <TabsTrigger value="level" className="data-[state=active]:bg-white/20">
            <Trophy className="h-4 w-4 mr-1" />
            Level
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="mt-4">
          <LeaderboardList data={leaderboards.balance} type="balance" />
        </TabsContent>

        <TabsContent value="taps" className="mt-4">
          <LeaderboardList data={leaderboards.taps} type="taps" />
        </TabsContent>

        <TabsContent value="referrals" className="mt-4">
          <LeaderboardList data={leaderboards.referrals} type="referrals" />
        </TabsContent>

        <TabsContent value="level" className="mt-4">
          <LeaderboardList data={leaderboards.level} type="level" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
