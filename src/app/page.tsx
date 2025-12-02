"use client";

import { TimerConfigForm } from "@/components/timer-config-form";
import { TimerDisplay } from "@/components/timer-display";
import { useIntervalTimer } from "@/hooks/use-interval-timer";

export default function Home() {
  const { config, setConfig, state, startTimer, stopTimer } = useIntervalTimer();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-20"></div>
      
      {state.phase === 'IDLE' ? (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TimerConfigForm 
            config={config} 
            onConfigChange={setConfig} 
            onStart={startTimer} 
          />
        </div>
      ) : (
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <TimerDisplay 
            state={state} 
            config={config} 
            onStop={stopTimer} 
          />
        </div>
      )}
    </main>
  );
}
