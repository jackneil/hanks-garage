"use client";
import { useOregonTrailStore } from "../lib/store";
import { LANDMARKS, TOTAL_DISTANCE, PACES, WEATHER_CONDITIONS } from "../lib/constants";

export function Travel() {
  const st = useOregonTrailStore();
  const nextLm = LANDMARKS[st.currentLandmarkIndex + 1];
  const toNext = nextLm ? nextLm.milesFromStart - st.milesTraveled : 0;
  return (
    <div className="min-h-screen bg-green-800 text-green-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl mb-4">Day {st.currentDay} - {WEATHER_CONDITIONS[st.weather].name}</h2>
        <div className="bg-green-700 p-4 rounded mb-4">
          <p>Miles traveled: {st.milesTraveled} / {TOTAL_DISTANCE}</p>
          <p>Next: {nextLm?.name} ({toNext} miles)</p>
          <p>Pace: {PACES[st.pace].name}</p>
          <p>Food: {st.supplies.food} lbs | Oxen: {st.supplies.oxen}</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={st.travel} className="btn btn-primary btn-lg">Continue</button>
          <button onClick={st.rest} className="btn btn-secondary">Rest</button>
          <button onClick={() => st.setPhase("hunting")} className="btn btn-accent">Hunt</button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => st.setPace("steady")} className={"btn " + (st.pace === "steady" ? "btn-primary" : "btn-ghost")}>Steady</button>
          <button onClick={() => st.setPace("strenuous")} className={"btn " + (st.pace === "strenuous" ? "btn-primary" : "btn-ghost")}>Strenuous</button>
          <button onClick={() => st.setPace("grueling")} className={"btn " + (st.pace === "grueling" ? "btn-primary" : "btn-ghost")}>Grueling</button>
        </div>
        <div className="mt-4">
          <h3 className="text-xl mb-2">Party:</h3>
          {st.party.map(m => (<div key={m.id} className={"p-2 rounded " + (m.isSick ? "bg-red-700" : "bg-green-700")}>{m.name} - {m.health}{m.isSick && " (sick)"}</div>))}
        </div>
      </div>
    </div>
  );
}
