"use client";

interface MonsterTruckDetailsProps {
  data: Record<string, unknown>;
}

interface Truck {
  id: string;
  name: string;
  unlocked: boolean;
  color: string;
}

interface Upgrade {
  level: number;
  maxLevel: number;
}

interface Challenge {
  id: string;
  name: string;
  completed: boolean;
  reward: number;
}

/**
 * Detailed view of Monster Truck game progress.
 * Shows trucks, upgrades, challenges, and settings.
 */
export function MonsterTruckDetails({ data }: MonsterTruckDetailsProps) {
  // Defensive extraction
  const trucks = Array.isArray(data.trucks) ? (data.trucks as Truck[]) : [];
  const upgrades = (data.upgrades || {}) as Record<string, Record<string, Upgrade>>;
  const challenges = Array.isArray(data.challenges) ? (data.challenges as Challenge[]) : [];
  const coins = typeof data.coins === "number" ? data.coins : 0;
  const starsCollected = typeof data.starsCollected === "number" ? data.starsCollected : 0;
  const currentTruckId = typeof data.currentTruckId === "string" ? data.currentTruckId : "";
  const soundEnabled = data.soundEnabled === true;
  const musicEnabled = data.musicEnabled === true;

  const unlockedTrucks = trucks.filter((t) => t?.unlocked === true);
  const lockedTrucks = trucks.filter((t) => t?.unlocked !== true);
  const completedChallenges = challenges.filter((c) => c?.completed === true);

  // Don't show if no interesting data
  if (trucks.length === 0 && challenges.length === 0) {
    return (
      <div className="text-center text-white/60 py-4">
        Keep playing to unlock trucks and complete challenges!
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-3 border-t border-white/10">
      {/* Current Stats */}
      <div className="flex flex-wrap gap-3">
        <div className="bg-white/10 rounded-lg px-3 py-2">
          <span className="text-yellow-300">💰</span>{" "}
          <span className="font-bold text-white">{coins.toLocaleString()}</span>
        </div>
        <div className="bg-white/10 rounded-lg px-3 py-2">
          <span className="text-yellow-300">⭐</span>{" "}
          <span className="font-bold text-white">{starsCollected}</span>
        </div>
      </div>

      {/* Trucks Section */}
      {trucks.length > 0 && (
        <div>
          <h4 className="text-white/80 text-sm font-bold mb-2 flex items-center gap-1">
            <span>🚗</span> Trucks ({unlockedTrucks.length}/{trucks.length})
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {trucks.map((truck) => (
              <div
                key={truck.id}
                className={`rounded-lg p-2 text-center text-xs ${
                  truck.unlocked
                    ? truck.id === currentTruckId
                      ? "bg-white/30 ring-2 ring-white/50"
                      : "bg-white/15"
                    : "bg-white/5 opacity-50"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: truck.color || "#888" }}
                />
                <div className="text-white/80 truncate">{truck.name}</div>
                {truck.unlocked && truck.id === currentTruckId && (
                  <div className="text-[10px] text-white/50">Active</div>
                )}
                {!truck.unlocked && (
                  <div className="text-[10px] text-white/40">🔒</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrades for Current Truck */}
      {currentTruckId && upgrades[currentTruckId] && (
        <div>
          <h4 className="text-white/80 text-sm font-bold mb-2 flex items-center gap-1">
            <span>⬆️</span> Upgrades
          </h4>
          <div className="space-y-2">
            {Object.entries(upgrades[currentTruckId]).map(([stat, upgrade]) => (
              <div key={stat} className="flex items-center gap-2">
                <span className="text-white/60 text-xs w-20 capitalize">{stat}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400/80 rounded-full transition-all"
                    style={{
                      width: `${((upgrade?.level || 0) / (upgrade?.maxLevel || 5)) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-white/50 text-xs">
                  {upgrade?.level || 0}/{upgrade?.maxLevel || 5}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenges */}
      {challenges.length > 0 && (
        <div>
          <h4 className="text-white/80 text-sm font-bold mb-2 flex items-center gap-1">
            <span>🎯</span> Challenges ({completedChallenges.length}/{challenges.length})
          </h4>
          <div className="space-y-1">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
                  challenge.completed ? "bg-green-500/20" : "bg-white/5"
                }`}
              >
                <span>{challenge.completed ? "✅" : "⬜"}</span>
                <span className={challenge.completed ? "text-white/80" : "text-white/50"}>
                  {challenge.name}
                </span>
                {challenge.completed && (
                  <span className="ml-auto text-yellow-300/80">+{challenge.reward}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="flex gap-3 text-xs text-white/50">
        <span>🔊 {soundEnabled ? "On" : "Off"}</span>
        <span>🎵 {musicEnabled ? "On" : "Off"}</span>
      </div>
    </div>
  );
}
