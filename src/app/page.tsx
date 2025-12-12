"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { TimerConfigForm } from "@/components/timer-config-form";
import { TimerDisplay } from "@/components/timer-display";
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
      className="fixed top-4 right-4 p-2 rounded-full bg-white/10 dark:bg-slate-800/80 backdrop-blur-md hover:bg-white/20 dark:hover:bg-slate-700/80 transition-colors"
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

export default function Home() {
  const { config, setConfig, state, startTimer, stopTimer, resetTimer } =
    useIntervalTimer();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <ThemeToggle />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-20"></div>

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
          />
        </div>
      )}
    </main>
  );
}
