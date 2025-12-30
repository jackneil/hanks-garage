"use client";

import { useDrawingStore } from "../lib/store";
import { TOOLS, type DrawingTool } from "../lib/constants";

/**
 * Toolbar Component - Tool selection
 * Big touch-friendly buttons for kids
 */
export function Toolbar() {
  const { tool, setTool } = useDrawingStore();

  const tools: DrawingTool[] = ["pencil", "brush", "eraser"];

  return (
    <div className="flex gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
      {tools.map((t) => {
        const toolInfo = TOOLS[t];
        const isActive = tool === t;

        return (
          <button
            key={t}
            onClick={() => setTool(t)}
            className={`
              w-14 h-14 md:w-16 md:h-16 rounded-xl flex flex-col items-center justify-center
              transition-all touch-manipulation
              ${
                isActive
                  ? "bg-blue-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }
            `}
            aria-label={toolInfo.name}
            title={toolInfo.description}
          >
            <span className="text-2xl md:text-3xl">{toolInfo.icon}</span>
            <span className="text-[10px] md:text-xs font-medium mt-0.5">
              {toolInfo.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
