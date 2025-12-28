"use client";

interface HillClimbDetailsProps {
  data: Record<string, unknown>;
}

interface VehicleUpgrades {
  engine: number;
  suspension: number;
  tires: number;
  fuelTank: number;
  nitro: number;
}

/**
 * Detailed view of Hill Climb Racing game progress.
 * Shows vehicles, upgrades, stages, and best distances.
 */
export function HillClimbDetails({ data }: HillClimbDetailsProps) {
  // Defensive extraction
  const coins = typeof data.coins === "number" ? data.coins : 0;
  const totalCoinsEarned = typeof data.totalCoinsEarned === "number" ? data.totalCoinsEarned : 0;
  const bestDistance = typeof data.bestDistance === "number" ? data.bestDistance : 0;
  const currentVehicleId = typeof data.currentVehicleId === "string" ? data.currentVehicleId : "";
  const currentStageId = typeof data.currentStageId === "string" ? data.currentStageId : "";
  const unlockedVehicles = Array.isArray(data.unlockedVehicles) ? (data.unlockedVehicles as string[]) : [];
  const unlockedStages = Array.isArray(data.unlockedStages) ? (data.unlockedStages as string[]) : [];
  const vehicleUpgrades = (data.vehicleUpgrades || {}) as Record<string, VehicleUpgrades>;
  const bestDistancePerStage = (data.bestDistancePerStage || {}) as Record<string, number>;
  const soundEnabled = data.soundEnabled === true;
  const musicEnabled = data.musicEnabled === true;
  const leanSensitivity = typeof data.leanSensitivity === "number" ? data.leanSensitivity : 1;

  // Vehicle display names
  const vehicleNames: Record<string, string> = {
    jeep: "Jeep",
    motocross: "Motocross",
    monster: "Monster Truck",
    bus: "School Bus",
    tank: "Tank",
  };

  // Stage display names
  const stageNames: Record<string, string> = {
    countryside: "Countryside",
    desert: "Desert",
    arctic: "Arctic",
    moon: "Moon",
    mars: "Mars",
  };

  // Don't show if no interesting data
  if (unlockedVehicles.length <= 1 && Object.keys(bestDistancePerStage).length === 0) {
    return (
      <div className="text-center text-white/60 py-4">
        Keep racing to unlock vehicles and beat records!
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-3 border-t border-white/10">
      {/* Stats Row */}
      <div className="flex flex-wrap gap-3">
        <div className="bg-white/10 rounded-lg px-3 py-2">
          <span className="text-yellow-300">💰</span>{" "}
          <span className="font-bold text-white">{coins.toLocaleString()}</span>
        </div>
        <div className="bg-white/10 rounded-lg px-3 py-2">
          <span>🏆</span>{" "}
          <span className="font-bold text-white">{Math.round(bestDistance)}m</span>
        </div>
      </div>

      {/* Vehicles */}
      {unlockedVehicles.length > 0 && (
        <div>
          <h4 className="text-white/80 text-sm font-bold mb-2 flex items-center gap-1">
            <span>🚗</span> Vehicles ({unlockedVehicles.length})
          </h4>
          <div className="space-y-2">
            {unlockedVehicles.map((vehicleId) => {
              const upgrades = vehicleUpgrades[vehicleId];
              const isActive = vehicleId === currentVehicleId;
              const upgradeSum = upgrades
                ? upgrades.engine + upgrades.suspension + upgrades.tires + upgrades.fuelTank + upgrades.nitro
                : 0;
              const maxUpgradeSum = 25; // 5 upgrades × 5 levels

              return (
                <div
                  key={vehicleId}
                  className={`rounded-lg p-2 ${
                    isActive ? "bg-white/20 ring-1 ring-white/30" : "bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">
                      {vehicleNames[vehicleId] || vehicleId}
                    </span>
                    {isActive && <span className="text-[10px] text-white/50">Active</span>}
                  </div>
                  {upgrades && (
                    <div className="flex gap-1">
                      {Object.entries(upgrades).map(([stat, level]) => (
                        <div key={stat} className="flex-1">
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-400/80 rounded-full"
                              style={{ width: `${(level / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stages & Records */}
      {Object.keys(bestDistancePerStage).length > 0 && (
        <div>
          <h4 className="text-white/80 text-sm font-bold mb-2 flex items-center gap-1">
            <span>🗺️</span> Stage Records
          </h4>
          <div className="space-y-1">
            {Object.entries(bestDistancePerStage).map(([stageId, distance]) => (
              <div
                key={stageId}
                className={`flex items-center justify-between text-xs px-2 py-1 rounded ${
                  stageId === currentStageId ? "bg-white/15" : "bg-white/5"
                }`}
              >
                <span className="text-white/70">{stageNames[stageId] || stageId}</span>
                <span className="text-white font-medium">{Math.round(distance)}m</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="flex gap-3 text-xs text-white/50">
        <span>🔊 {soundEnabled ? "On" : "Off"}</span>
        <span>🎵 {musicEnabled ? "On" : "Off"}</span>
        <span>📐 Tilt: {leanSensitivity.toFixed(1)}x</span>
      </div>
    </div>
  );
}
