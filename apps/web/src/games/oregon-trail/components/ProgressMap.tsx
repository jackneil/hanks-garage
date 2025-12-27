"use client";

import { useMemo } from "react";
import { useOregonTrailStore } from "../lib/store";
import { LANDMARKS, TOTAL_DISTANCE } from "../lib/constants";

export function ProgressMap() {
  const { milesTraveled, currentLandmarkIndex } = useOregonTrailStore();

  const progress = (milesTraveled / TOTAL_DISTANCE) * 100;

  // Calculate landmark positions as percentages
  const landmarkPositions = useMemo(() => {
    return LANDMARKS.map((lm, idx) => ({
      ...lm,
      position: (lm.milesFromStart / TOTAL_DISTANCE) * 100,
      passed: idx <= currentLandmarkIndex,
      isCurrent: idx === currentLandmarkIndex,
      isNext: idx === currentLandmarkIndex + 1,
    }));
  }, [currentLandmarkIndex]);

  return (
    <div className="w-full bg-amber-900/30 rounded-lg p-3 md:p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 text-xs md:text-sm">
        <span className="font-bold text-amber-200">Independence, MO</span>
        <span className="text-amber-100">{milesTraveled} / {TOTAL_DISTANCE} miles</span>
        <span className="font-bold text-amber-200">Oregon City</span>
      </div>

      {/* Progress bar container */}
      <div className="relative h-8 md:h-10">
        {/* Trail background */}
        <div className="absolute inset-y-3 md:inset-y-4 left-0 right-0 bg-amber-800/50 rounded-full h-2 md:h-3" />

        {/* Traveled path */}
        <div
          className="absolute inset-y-3 md:inset-y-4 left-0 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full h-2 md:h-3 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />

        {/* Landmarks */}
        {landmarkPositions.map((lm, idx) => (
          <div
            key={idx}
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${lm.position}%` }}
          >
            {/* Landmark marker */}
            <div
              className={`
                w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all
                ${lm.passed
                  ? "bg-green-500 border-green-300"
                  : lm.isNext
                    ? "bg-amber-500 border-amber-300 animate-pulse"
                    : "bg-gray-600 border-gray-400"
                }
                ${lm.hasRiver ? "ring-2 ring-blue-400 ring-offset-1 ring-offset-amber-900" : ""}
              `}
              title={lm.name}
            />

            {/* River indicator */}
            {lm.hasRiver && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs">
                <span className="text-blue-400">~</span>
              </div>
            )}
          </div>
        ))}

        {/* Wagon position */}
        <div
          className="absolute top-0 -translate-x-1/2 transition-all duration-500"
          style={{ left: `${progress}%` }}
        >
          <div className="text-xl md:text-2xl animate-bounce">
            🚗
          </div>
        </div>
      </div>

      {/* Next landmark info */}
      {currentLandmarkIndex < LANDMARKS.length - 1 && (
        <div className="mt-3 text-center">
          <span className="text-amber-100 text-xs md:text-sm">
            Next: <span className="font-bold text-amber-200">
              {LANDMARKS[currentLandmarkIndex + 1]?.name}
            </span>
            {" "}({LANDMARKS[currentLandmarkIndex + 1]?.milesFromStart - milesTraveled} miles)
            {LANDMARKS[currentLandmarkIndex + 1]?.hasRiver && (
              <span className="text-blue-300 ml-2">🌊 River Crossing</span>
            )}
          </span>
        </div>
      )}

      {/* Landmark legend */}
      <div className="mt-2 flex justify-center gap-4 text-xs text-amber-200/70">
        <span><span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1" /> Passed</span>
        <span><span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1 animate-pulse" /> Next</span>
        <span><span className="inline-block w-2 h-2 bg-gray-600 rounded-full mr-1" /> Ahead</span>
        <span className="text-blue-300">~ River</span>
      </div>
    </div>
  );
}
