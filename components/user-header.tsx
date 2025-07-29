"use client";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User } from "@/types/User";

type Props = {
  user: User;
  onRefresh: () => void;
};

const UserHeader = ({ user, onRefresh }: Props) => {
  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="text-3xl">🪙</div>
          <h1 className="text-2xl font-bold text-white">Hash Coin</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="text-white hover:bg-white/10"
          >
            Refresh
          </Button>
          <TonConnectButton />
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl font-semibold flex items-center gap-2">
              <Coins className="h-5 w-5" />
              {user.hashBalance.toLocaleString()} HASH
            </h2>
            <p className="text-white/70">
              Level {user.level} • {user.tapCount} total taps
            </p>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {user.level < 10
              ? `${Math.floor((user.hashBalance % 1000) / 10)}% to Level ${user.level + 1}`
              : "Max Level"}
          </Badge>
        </div>
        <Progress
          value={user.level < 10 ? (user.hashBalance % 1000) / 10 : 100}
          className="h-2 bg-white/20 mt-4"
        />
      </div>
    </div>
  );
};

export default UserHeader;
