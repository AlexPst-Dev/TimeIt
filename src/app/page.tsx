"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { TimerConfigForm } from "@/components/timer-config-form";
import {
  TimerDisplay,
  getPhaseColor,
  getProgress,
} from "@/components/timer-display";
import { useIntervalTimer } from "@/hooks/use-interval-timer";
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed z-10 top-4 right-4 p-2 rounded-full bg-white/10 dark:bg-slate-800/80 backdrop-blur-md hover:bg-white/20 dark:hover:bg-slate-700/80 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </button>
  );
}

// Convert Tailwind color to CSS color
const getCssColor = (tailwindColor: string): string => {
  const colorMap: Record<string, string> = {
    "green-500": "#10b981",
    "amber-500": "#f59e0b",
    "blue-500": "#3b82f6",
    "purple-500": "#8b5cf6",
    "slate-500": "#64748b",
  };

  // Extract base color from the Tailwind class
  const baseColor = tailwindColor
    .replace("bg-", "")
    .replace("/90", "")
    .replace("bg-", "");

  return colorMap[baseColor] || "#000000";
};

export default function Home() {
  const {
    config,
    setConfig,
    state,
    startTimer,
    stopTimer,
    resetTimer,
    isPaused,
    togglePause,
  } = useIntervalTimer();

  // Get phase colors and progress
  const phaseColors = getPhaseColor(state.phase);
  const progress = getProgress(state, config);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <ThemeToggle />

      {/* Animated background */}
      <>
        {/* Solid background color */}
        <div
          className="absolute inset-0 transition-colors duration-300 ease-in-out"
          style={{
            backgroundColor: getCssColor(phaseColors.progress),
            clipPath: `polygon(0% ${100 - progress}%, 100% ${
              100 - progress
            }%, 100% 100%, 0% 100%)`,
          }}
        />
      </>

      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 h-full w-full bg-linear-to-b from-white/80 to-white/20 dark:from-slate-950/90 dark:to-slate-950/30"></div>

      {state.phase === "IDLE" ? (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TimerConfigForm
            config={config}
            onConfigChange={setConfig}
            onStart={startTimer}
          />
        </div>
      ) : (
        <div className="w-full animate-in fade-in zoom-in duration-500">
          <TimerDisplay
            state={state}
            config={config}
            onStop={stopTimer}
            onReset={resetTimer}
            isPaused={isPaused}
            onTogglePause={togglePause}
          />
        </div>
      )}
    </main>
  );
}
