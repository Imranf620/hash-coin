'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useTonWallet } from '@tonconnect/ui-react';
import AuthService from '@/lib/auth';
import { useEffect, useState } from 'react';
import { User } from '@/types/User';
import UserHeader from '@/components/user-header';
import Loading from '@/components/ui/loading';

type Game = {
  id: string;
  name: string;
  description: string;
  image: string;
  route: string;
};

const games: Game[] = [
  {
    id: '1',
    name: 'Candy Crypto',
    description: 'Match 3 to earn tokens!',
    image: '/games/candy-crypto.png',
    route: '/games/candy-crypto',
  },
];

const Games = () => {
  const router = useRouter();
  const wallet = useTonWallet();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authService] = useState(() => AuthService.getInstance());

  useEffect(() => {
    if (wallet?.account?.address) {
      authenticateUser(wallet.account.address);
    } else {
      setLoading(false);
      authService.logout();
    }
  }, [wallet]);

  const authenticateUser = async (walletAddress: string) => {
    try {
      const loginResult = await authService.login(walletAddress);
      if (loginResult.success && loginResult.data) {
        setUser(loginResult.data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const result = await authService.fetchUser();
      if (result.success && result.data) {
        setUser(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
     <Loading/>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 text-white">
      <div className="container mx-auto p-4">
        {user && <UserHeader user={user} onRefresh={refreshUser} />}

        <h1 className="text-3xl font-bold text-center mb-6">🎮 Play & Earn</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 cursor-pointer hover:scale-[1.03] transition-transform border border-white/20"
              onClick={() => router.push(game.route)}
            >
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-bold text-white">{game.name}</h2>
              <p className="text-sm text-white/80">{game.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
