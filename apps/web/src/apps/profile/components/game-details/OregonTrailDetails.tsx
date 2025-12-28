"use client";

interface OregonTrailDetailsProps {
  data: Record<string, unknown>;
}

interface PartyMember {
  name: string;
  health: "good" | "fair" | "poor" | "dead";
  isSick: boolean;
  leftBehind: boolean;
}

interface Supplies {
  food: number;
  oxen: number;
  clothing: number;
  ammunition: number;
  money: number;
  spareParts: {
    wheels: number;
    axles: number;
    tongues: number;
  };
}

/**
 * Detailed view of Oregon Trail game progress.
 * Shows party, supplies, and journey stats.
 */
export function OregonTrailDetails({ data }: OregonTrailDetailsProps) {
  // Defensive extraction
  const leaderName = typeof data.leaderName === "string" ? data.leaderName : "";
  const party = Array.isArray(data.party) ? (data.party as PartyMember[]) : [];
  const supplies = (data.supplies || {}) as Partial<Supplies>;
  const milesTraveled = typeof data.milesTraveled === "number" ? data.milesTraveled : 0;
  const currentDay = typeof data.currentDay === "number" ? data.currentDay : 1;
  const riversCrossed = typeof data.riversCrossed === "number" ? data.riversCrossed : 0;
  const foodHunted = typeof data.foodHunted === "number" ? data.foodHunted : 0;
  const eventsEncountered = typeof data.eventsEncountered === "number" ? data.eventsEncountered : 0;
  const pace = typeof data.pace === "string" ? data.pace : "steady";
  const weather = typeof data.weather === "string" ? data.weather : "clear";
  const gamePhase = typeof data.gamePhase === "string" ? data.gamePhase : "";

  // Health emoji
  const healthEmoji: Record<string, string> = {
    good: "💚",
    fair: "💛",
    poor: "🧡",
    dead: "💀",
  };

  // Weather emoji
  const weatherEmoji: Record<string, string> = {
    clear: "☀️",
    rain: "🌧️",
    snow: "❄️",
    storm: "⛈️",
    fog: "🌫️",
  };

  // Don't show if game not started
  if (!leaderName && party.length === 0) {
    return (
      <div className="text-center text-white/60 py-4">
        Start your journey on the Oregon Trail!
      </div>
    );
  }

  const aliveParty = party.filter((m) => m.health !== "dead" && !m.leftBehind);
  const sickParty = party.filter((m) => m.isSick && m.health !== "dead");

  return (
    <div className="space-y-4 pt-3 border-t border-white/10">
      {/* Journey Stats */}
      <div className="flex flex-wrap gap-2">
        <div className="bg-white/10 rounded-lg px-2 py-1 text-xs">
          <span>📍</span> {milesTraveled} miles
        </div>
        <div className="bg-white/10 rounded-lg px-2 py-1 text-xs">
          <span>📅</span> Day {currentDay}
        </div>
        <div className="bg-white/10 rounded-lg px-2 py-1 text-xs">
          {weatherEmoji[weather] || "🌤️"} {weather}
        </div>
        <div className="bg-white/10 rounded-lg px-2 py-1 text-xs">
          <span>🏃</span> {pace}
        </div>
      </div>

      {/* Party Members */}
      {party.length > 0 && (
        <div>
          <h4 className="text-white/80 text-sm font-bold mb-2 flex items-center gap-1">
            <span>👥</span> Party ({aliveParty.length}/{party.length} alive)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {party.map((member, idx) => (
              <div
                key={idx}
                className={`rounded-lg px-2 py-1.5 text-xs ${
                  member.health === "dead" || member.leftBehind
                    ? "bg-white/5 opacity-50"
                    : member.isSick
                    ? "bg-orange-500/20"
                    : "bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white/80 truncate">{member.name}</span>
                  <span>{healthEmoji[member.health] || "❓"}</span>
                </div>
                {member.isSick && member.health !== "dead" && (
                  <div className="text-[10px] text-orange-300/80">🤒 Sick</div>
                )}
                {member.leftBehind && (
                  <div className="text-[10px] text-white/40">Left behind</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supplies */}
      {supplies && (
        <div>
          <h4 className="text-white/80 text-sm font-bold mb-2 flex items-center gap-1">
            <span>🎒</span> Supplies
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white/10 rounded px-2 py-1">
              <span>🍖</span> {supplies.food || 0} lbs
            </div>
            <div className="bg-white/10 rounded px-2 py-1">
              <span>🐂</span> {supplies.oxen || 0}
            </div>
            <div className="bg-white/10 rounded px-2 py-1">
              <span>👔</span> {supplies.clothing || 0}
            </div>
            <div className="bg-white/10 rounded px-2 py-1">
              <span>🔫</span> {supplies.ammunition || 0}
            </div>
            <div className="bg-white/10 rounded px-2 py-1">
              <span>💵</span> ${supplies.money || 0}
            </div>
            {supplies.spareParts && (
              <div className="bg-white/10 rounded px-2 py-1">
                <span>🔧</span> {supplies.spareParts.wheels || 0}W/{supplies.spareParts.axles || 0}A/{supplies.spareParts.tongues || 0}T
              </div>
            )}
          </div>
        </div>
      )}

      {/* Journey Achievements */}
      <div className="flex flex-wrap gap-2 text-xs text-white/60">
        <span>🌊 {riversCrossed} rivers</span>
        <span>🍖 {foodHunted} lbs hunted</span>
        <span>📜 {eventsEncountered} events</span>
      </div>
    </div>
  );
}
