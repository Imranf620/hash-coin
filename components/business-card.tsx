"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Edit, Save, Share, Wallet, User, LinkIcon } from "lucide-react"

interface BusinessCardProps {
  user: any
  onUserUpdate: (user: any) => void
}

export default function BusinessCard({ user, onUserUpdate }: BusinessCardProps) {
  const [editing, setEditing] = useState(false)
  const [cardData, setCardData] = useState({
    name: user.businessCard?.name || "",
    title: user.businessCard?.title || "",
    bio: user.businessCard?.bio || "",
    website: user.businessCard?.website || "",
    twitter: user.businessCard?.twitter || "",
    telegram: user.businessCard?.telegram || "",
  })

  const handleSave = async () => {
    try {
      const response = await fetch("/api/business-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: user.walletAddress,
          businessCard: cardData,
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        onUserUpdate(updatedUser)
        setEditing(false)
      }
    } catch (error) {
      console.error("Business card save error:", error)
    }
  }

  const shareCard = () => {
    const cardUrl = `${window.location.origin}/card/${user.walletAddress}`
    if (navigator.share) {
      navigator.share({
        title: `${cardData.name || "Hash Coin Player"}'s Business Card`,
        url: cardUrl,
      })
    } else {
      navigator.clipboard.writeText(cardUrl)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Business Card
          </CardTitle>
          <CardDescription className="text-white/70">Create and share your digital business card</CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-white/20">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="text-white">
              <div className="text-2xl font-bold mb-1">{cardData.name || "Your Name"}</div>
              <div className="text-purple-200 mb-2">{cardData.title || "Your Title"}</div>
              <div className="text-purple-100 text-sm mb-3">{cardData.bio || "Tell people about yourself..."}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-2">🪙</div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Level {user.level}
              </Badge>
            </div>
          </div>

          <div className="border-t border-white/20 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-purple-100">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="truncate">
                  {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{user.hashBalance.toLocaleString()} HASH</span>
              </div>
              {cardData.website && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  <span className="truncate">{cardData.website}</span>
                </div>
              )}
              {cardData.twitter && (
                <div className="flex items-center gap-2">
                  <span>🐦</span>
                  <span className="truncate">@{cardData.twitter}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          onClick={() => setEditing(!editing)}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Edit className="h-4 w-4 mr-2" />
          {editing ? "Cancel" : "Edit"}
        </Button>
        <Button
          onClick={shareCard}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {editing && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Edit Business Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="title" className="text-white">
                  Title
                </Label>
                <Input
                  id="title"
                  value={cardData.title}
                  onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Your job title"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio" className="text-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={cardData.bio}
                onChange={(e) => setCardData({ ...cardData, bio: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Tell people about yourself..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website" className="text-white">
                  Website
                </Label>
                <Input
                  id="website"
                  value={cardData.website}
                  onChange={(e) => setCardData({ ...cardData, website: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="https://yoursite.com"
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="text-white">
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  value={cardData.twitter}
                  onChange={(e) => setCardData({ ...cardData, twitter: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="username"
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full bg-yellow-500 hover:bg-yellow-600">
              <Save className="h-4 w-4 mr-2" />
              Save Business Card
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
