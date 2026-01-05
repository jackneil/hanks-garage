"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Leaderboard } from "@/shared/components/Leaderboard";
import {
  getGameMetadata,
  GAME_METADATA,
} from "@/shared/lib/gameMetadata.generated";
import { LEADERBOARD_ENABLED_GAMES } from "@/lib/leaderboard-extractors";

interface MyRank {
  appId: string;
  gameName: string;
  icon: string;
  rank: number;
  score: number;
  scoreType: string;
  totalPlayers: number;
}

interface MyRanksData {
  handle: string | null;
  ranks: MyRank[];
}

// Get leaderboard games with their metadata
const LEADERBOARD_GAMES = LEADERBOARD_ENABLED_GAMES.map((appId) => {
  const meta = getGameMetadata(appId);
  return {
    appId,
    name: meta.name,
    icon: meta.icon,
  };
});

export function LeaderboardsPage() {
  const { data: session, status } = useSession();
  const [selectedGame, setSelectedGame] = useState<string>(
    LEADERBOARD_GAMES[0]?.appId || "2048"
  );
  const [myRanks, setMyRanks] = useState<MyRanksData | null>(null);
  const [myRanksLoading, setMyRanksLoading] = useState(false);

  // Fetch user's ranks
  useEffect(() => {
    if (status !== "authenticated") {
      setMyRanks(null);
      return;
    }

    const fetchMyRanks = async () => {
      setMyRanksLoading(true);
      try {
        const res = await fetch("/api/leaderboards/my-ranks");
        if (res.ok) {
          const data = await res.json();
          setMyRanks(data);
        }
      } catch (err) {
        console.error("Failed to fetch my ranks:", err);
      } finally {
        setMyRanksLoading(false);
      }
    };

    fetchMyRanks();
  }, [status]);

  const selectedGameMeta = getGameMetadata(selectedGame);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-600 to-orange-700 pb-8">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link
          href="/"
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center"
        >
          ← Home
        </Link>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🏆</span> Leaderboards
        </h1>
        <div className="w-20" />
      </header>

      {/* My Rankings Summary (Authenticated Only) */}
      {status === "authenticated" && (
        <section className="mx-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/20">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span>📊</span> My Rankings
            </h2>

            {myRanksLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin text-2xl">⏳</div>
              </div>
            ) : myRanks && myRanks.ranks.length > 0 ? (
              <div className="space-y-2">
                {/* Show top 3 ranks */}
                {myRanks.ranks.slice(0, 3).map((rank) => (
                  <button
                    key={rank.appId}
                    onClick={() => setSelectedGame(rank.appId)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl transition-all
                      ${selectedGame === rank.appId
                        ? "bg-white/30 ring-2 ring-white"
                        : "bg-white/10 hover:bg-white/20"
                      }
                    `}
                  >
                    <span className="text-2xl">{rank.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-white">{rank.gameName}</div>
                      <div className="text-sm text-white/60">
                        #{rank.rank} of {rank.totalPlayers.toLocaleString()}
                      </div>
                    </div>
                    <div className="font-bold text-white tabular-nums">
                      {rank.score.toLocaleString()}
                    </div>
                  </button>
                ))}

                {/* Show link to profile if more than 3 */}
                {myRanks.ranks.length > 3 && (
                  <Link
                    href="/profile#games"
                    className="block text-center text-white/70 hover:text-white text-sm py-2"
                  >
                    + {myRanks.ranks.length - 3} more games →
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🎮</div>
                <p className="text-white/70 text-sm">
                  Play some games to see your rankings here!
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Game Selector */}
      <section className="mx-4 mb-4">
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {LEADERBOARD_GAMES.map((game) => (
              <button
                key={game.appId}
                onClick={() => setSelectedGame(game.appId)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl font-medium
                  min-w-[44px] min-h-[44px] transition-all whitespace-nowrap
                  ${selectedGame === game.appId
                    ? "bg-white text-orange-700 shadow-lg scale-105"
                    : "bg-white/20 text-white hover:bg-white/30"
                  }
                `}
              >
                <span>{game.icon}</span>
                <span>{game.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Game Leaderboard */}
      <section className="mx-4">
        <div className="bg-slate-900/90 rounded-2xl p-4 shadow-2xl border border-slate-700">
          <Leaderboard
            appId={selectedGame}
            gameName={selectedGameMeta.name}
            icon={selectedGameMeta.icon}
            showPeriodSelector={true}
            compact={false}
          />
        </div>
      </section>

      {/* Play Button */}
      <section className="mx-4 mt-6">
        <Link
          href={`/games/${selectedGame}`}
          className="block w-full py-4 bg-green-500 hover:bg-green-400 text-white text-center font-bold rounded-2xl text-lg transition-colors shadow-lg"
        >
          <span className="mr-2">{selectedGameMeta.icon}</span>
          Play {selectedGameMeta.name}!
        </Link>
      </section>

      {/* Login prompt for guests */}
      {status === "unauthenticated" && (
        <section className="mx-4 mt-6">
          <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30 text-center">
            <p className="text-white mb-3">
              Sign in to see your rankings and compete on the leaderboards!
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-colors"
            >
              Sign In
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

export default LeaderboardsPage;
