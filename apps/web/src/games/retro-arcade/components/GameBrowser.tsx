"use client";

import { useState, useMemo } from "react";
import {
  type CatalogGame,
  type GameGenre,
  SNES_CATALOG,
  getRomUrl,
  searchSnesGames,
} from "../lib/snes-catalog";

interface GameBrowserProps {
  onGameSelect: (game: CatalogGame, romUrl: string) => void;
  onUploadClick: () => void;
}

// Genre colors for visual variety
const GENRE_COLORS: Record<GameGenre, string> = {
  rpg: "from-purple-600 to-purple-800",
  platformer: "from-blue-600 to-blue-800",
  action: "from-red-600 to-red-800",
  fighting: "from-orange-600 to-orange-800",
  adventure: "from-green-600 to-green-800",
  racing: "from-yellow-500 to-yellow-700",
  puzzle: "from-pink-600 to-pink-800",
  sports: "from-emerald-600 to-emerald-800",
  shooter: "from-cyan-600 to-cyan-800",
  strategy: "from-indigo-600 to-indigo-800",
};

const GENRE_LABELS: Record<GameGenre, string> = {
  rpg: "RPG",
  platformer: "Platformer",
  action: "Action",
  fighting: "Fighting",
  adventure: "Adventure",
  racing: "Racing",
  puzzle: "Puzzle",
  sports: "Sports",
  shooter: "Shooter",
  strategy: "Strategy",
};

// Individual game card - big and clickable for kids
function GameCard({
  game,
  onClick,
  isLoading,
}: {
  game: CatalogGame;
  onClick: () => void;
  isLoading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        relative bg-gradient-to-br ${GENRE_COLORS[game.genre]}
        p-4 rounded-xl shadow-lg
        hover:scale-105 active:scale-95
        transition-all duration-150 cursor-pointer
        border-2 border-white/20 hover:border-white/40
        flex flex-col items-center text-center
        min-h-[120px] sm:min-h-[130px]
        disabled:opacity-50 disabled:cursor-wait
        touch-manipulation
      `}
    >
      {/* Favorite star */}
      {game.favorite && (
        <span className="absolute top-1 right-1 text-yellow-300 text-lg">
          ★
        </span>
      )}

      {/* Loading spinner */}
      {isLoading ? (
        <div className="text-3xl mb-2 animate-spin">⏳</div>
      ) : (
        <div className="text-3xl mb-2">🎮</div>
      )}

      {/* Game name */}
      <h3 className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
        {game.displayName}
      </h3>

      {/* Genre badge */}
      <span className="mt-auto pt-1 text-[10px] sm:text-xs text-white/60 capitalize">
        {GENRE_LABELS[game.genre]}
      </span>
    </button>
  );
}

export function GameBrowser({ onGameSelect, onUploadClick }: GameBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<GameGenre | "all">("all");
  const [loadingGameId, setLoadingGameId] = useState<string | null>(null);

  // Get all unique genres from catalog
  const genres = useMemo(() => {
    const genreSet = new Set(SNES_CATALOG.map((g) => g.genre));
    return Array.from(genreSet).sort() as GameGenre[];
  }, []);

  // Filter games
  const filteredGames = useMemo(() => {
    let result = searchQuery ? searchSnesGames(searchQuery) : SNES_CATALOG;

    if (selectedGenre !== "all") {
      result = result.filter((g) => g.genre === selectedGenre);
    }

    // Sort: favorites first, then alphabetical
    return result.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return a.displayName.localeCompare(b.displayName);
    });
  }, [searchQuery, selectedGenre]);

  const handleGameClick = (game: CatalogGame) => {
    setLoadingGameId(game.id);
    const romUrl = getRomUrl(game);
    // Small delay to show loading state
    setTimeout(() => {
      onGameSelect(game, romUrl);
    }, 100);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
      {/* Search bar - BIG for kids */}
      <div className="mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            w-full px-4 py-3 text-lg rounded-xl
            bg-white/10 border-2 border-white/20
            text-white placeholder-white/50
            focus:border-white/40 focus:outline-none
            transition-colors
          "
        />
      </div>

      {/* Genre filter - scrollable on mobile */}
      <div className="mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedGenre("all")}
            className={`
              px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base
              transition-colors whitespace-nowrap
              ${
                selectedGenre === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }
            `}
          >
            All ({SNES_CATALOG.length})
          </button>
          {genres.map((genre) => {
            const count = SNES_CATALOG.filter((g) => g.genre === genre).length;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`
                  px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base
                  transition-colors whitespace-nowrap
                  ${
                    selectedGenre === genre
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }
                `}
              >
                {GENRE_LABELS[genre]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload your own button */}
      <button
        onClick={onUploadClick}
        className="
          mb-4 sm:mb-6 w-full p-3 sm:p-4
          border-2 border-dashed border-white/30
          rounded-xl text-white/70
          hover:border-white/50 hover:text-white
          transition-colors flex items-center justify-center gap-2
        "
      >
        <span className="text-xl sm:text-2xl">+</span>
        <span className="text-sm sm:text-base">Upload Your Own ROM</span>
      </button>

      {/* Games grid - responsive columns (2 on tiny screens for bigger touch targets) */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onClick={() => handleGameClick(game)}
            isLoading={loadingGameId === game.id}
          />
        ))}
      </div>

      {/* No results */}
      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-white/60 text-xl">No games found</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre("all");
            }}
            className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Game count */}
      <div className="mt-6 text-center text-white/40 text-sm">
        {filteredGames.length} of {SNES_CATALOG.length} games
      </div>
    </div>
  );
}

export default GameBrowser;
