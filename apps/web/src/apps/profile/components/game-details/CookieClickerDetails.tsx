"use client";

interface CookieClickerDetailsProps {
  data: Record<string, unknown>;
}

interface BuildingCounts {
  cursor: number;
  grandma: number;
  bakery: number;
  factory: number;
  mine: number;
  bank: number;
  temple: number;
  wizardTower: number;
  spaceship: number;
  alchemyLab: number;
}

/**
 * Detailed view of Cookie Clicker game progress.
 * Shows buildings, upgrades, achievements, and stats.
 */
export function CookieClickerDetails({ data }: CookieClickerDetailsProps) {
  // Defensive extraction
  const cookies = typeof data.cookies === "number" ? data.cookies : 0;
  const totalCookiesBaked = typeof data.totalCookiesBaked === "number" ? data.totalCookiesBaked : 0;
  const totalClicks = typeof data.totalClicks === "number" ? data.totalClicks : 0;
  const buildings = (data.buildings || {}) as Partial<BuildingCounts>;
  const purchasedUpgrades = Array.isArray(data.purchasedUpgrades) ? (data.purchasedUpgrades as string[]) : [];
  const unlockedAchievements = Array.isArray(data.unlockedAchievements) ? (data.unlockedAchievements as string[]) : [];
  const soundEnabled = data.soundEnabled === true;

  // Building display info
  const buildingInfo: { id: keyof BuildingCounts; name: string; icon: string }[] = [
    { id: "cursor", name: "Cursor", icon: "👆" },
    { id: "grandma", name: "Grandma", icon: "👵" },
    { id: "bakery", name: "Bakery", icon: "🏪" },
    { id: "factory", name: "Factory", icon: "🏭" },
    { id: "mine", name: "Mine", icon: "⛏️" },
    { id: "bank", name: "Bank", icon: "🏦" },
    { id: "temple", name: "Temple", icon: "🛕" },
    { id: "wizardTower", name: "Wizard Tower", icon: "🧙" },
    { id: "spaceship", name: "Spaceship", icon: "🚀" },
    { id: "alchemyLab", name: "Alchemy Lab", icon: "⚗️" },
  ];

  // Count owned buildings
  const ownedBuildings = buildingInfo.filter((b) => (buildings[b.id] || 0) > 0);
  const totalBuildings = Object.values(buildings).reduce((sum, count) => sum + (count || 0), 0);

  // Don't show if no interesting data
  if (totalBuildings === 0 && unlockedAchievements.length === 0 && totalClicks < 10) {
    return (
      <div className="text-center text-white/60 py-4">
        Keep clicking to bake more cookies!
      </div>
    );
  }

  // Format large numbers
  const formatNumber = (n: number): string => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  return (
    <div className="space-y-4 pt-3 border-t border-white/10">
      {/* Cookie Stats */}
      <div className="flex flex-wrap gap-2">
        <div className="bg-white/10 rounded-lg px-2 py-1 text-xs">
          <span>🍪</span> {formatNumber(cookies)} banked
        </div>
        <div className="bg-white/10 rounded-lg px-2 py-1 text-xs">
          <span>📈</span> {formatNumber(totalCookiesBaked)} baked
        </div>
        <div className="bg-white/10 rounded-lg px-2 py-1 text-xs">
          <span>👆</span> {formatNumber(totalClicks)} clicks
        </div>
      </div>

      {/* Buildings */}
      {ownedBuildings.length > 0 && (
        <div>
          <h4 className="text-white/80 text-sm font-bold mb-2 flex items-center gap-1">
            <span>🏗️</span> Buildings ({totalBuildings} total)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {ownedBuildings.map((building) => {
              const count = buildings[building.id] || 0;
              return (
                <div
                  key={building.id}
                  className="bg-white/10 rounded-lg px-2 py-1.5 flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-1">
                    <span>{building.icon}</span>
                    <span className="text-white/80">{building.name}</span>
                  </span>
                  <span className="text-white font-medium">×{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upgrades */}
      {purchasedUpgrades.length > 0 && (
        <div>
          <h4 className="text-white/80 text-sm font-bold mb-2 flex items-center gap-1">
            <span>⬆️</span> Upgrades ({purchasedUpgrades.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {purchasedUpgrades.slice(0, 12).map((upgradeId, idx) => (
              <div
                key={idx}
                className="bg-yellow-500/20 text-yellow-200/80 rounded px-1.5 py-0.5 text-[10px]"
                title={upgradeId}
              >
                ✨
              </div>
            ))}
            {purchasedUpgrades.length > 12 && (
              <div className="text-white/40 text-[10px] px-1">
                +{purchasedUpgrades.length - 12} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h4 className="text-white/80 text-sm font-bold mb-2 flex items-center gap-1">
            <span>🏆</span> Achievements ({unlockedAchievements.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {unlockedAchievements.slice(0, 15).map((achievementId, idx) => (
              <div
                key={idx}
                className="bg-purple-500/20 text-purple-200/80 rounded px-1.5 py-0.5 text-[10px]"
                title={achievementId}
              >
                🎖️
              </div>
            ))}
            {unlockedAchievements.length > 15 && (
              <div className="text-white/40 text-[10px] px-1">
                +{unlockedAchievements.length - 15} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="flex gap-3 text-xs text-white/50">
        <span>🔊 {soundEnabled ? "On" : "Off"}</span>
      </div>
    </div>
  );
}
