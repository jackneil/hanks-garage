"use client";
import { useOregonTrailStore } from "../lib/store";
import { LANDMARKS } from "../lib/constants";
export function StatusBar() {
  const st = useOregonTrailStore();
  const lm = LANDMARKS[st.currentLandmarkIndex];
  return <div className="bg-amber-800 text-amber-100 p-2 flex justify-between"><span>Day {st.currentDay}</span><span>{lm?.name}</span><span>{st.milesTraveled} mi</span></div>;
}
