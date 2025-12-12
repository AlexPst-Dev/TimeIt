import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TimerState, TimerConfig } from "@/hooks/use-interval-timer";
import { Pause, Play, RotateCcw, X } from "lucide-react";

interface TimerDisplayProps {
  state: TimerState;
  config: TimerConfig;
  onStop: () => void;
}

interface TimerDisplayProps {
  state: TimerState;
  config: TimerConfig;
  onStop: () => void;
  onReset: () => void;
}

export function TimerDisplay({
  state,
  config,
  onStop,
  onReset,
}: TimerDisplayProps) {
  const getPhaseColor = () => {
    switch (state.phase) {
      case "WORK":
        return "text-green-600 dark:text-green-400";
      case "REST":
        return "text-amber-600 dark:text-amber-400";
      case "ROUND_REST":
        return "text-blue-600 dark:text-blue-400";
      case "COUNTDOWN":
        return "text-purple-600 dark:text-purple-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  const getPhaseLabel = () => {
    switch (state.phase) {
      case "WORK":
        return "GO!";
      case "REST":
        return "REST";
      case "ROUND_REST":
        return "ROUND REST";
      case "COUNTDOWN":
        return "GET READY";
      case "FINISHED":
        return "WELL DONE!";
      default:
        return "";
    }
  };

  const getProgress = () => {
    if (state.phase === "FINISHED") return 100;
    if (state.phase === "COUNTDOWN") return ((3 - state.timeLeft) / 3) * 100;

    let totalDuration = 0;
    if (state.phase === "WORK") totalDuration = config.workDuration;
    if (state.phase === "REST") totalDuration = config.restDuration;
    if (state.phase === "ROUND_REST") totalDuration = config.roundRestDuration;

    if (totalDuration === 0) return 0;
    // Progress should go from 100 to 0 or 0 to 100? Usually timers go down.
    // Let's make the bar fill up as time passes? Or empty?
    // Let's make it empty as time passes (countdown style).
    return (state.timeLeft / totalDuration) * 100;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2
          className={`text-4xl font-black tracking-tighter ${getPhaseColor()} animate-in fade-in zoom-in duration-300`}
        >
          {getPhaseLabel()}
        </h2>
        <div className="text-8xl font-black tabular-nums tracking-tighter text-slate-900 dark:text-slate-50 font-mono">
          {state.phase === "FINISHED" ? "DONE" : formatTime(state.timeLeft)}
        </div>
      </div>

      <div className="w-full space-y-2">
        <Progress value={getProgress()} className="h-4 w-full" />
        <div className="flex justify-between text-sm text-muted-foreground font-medium">
          <span>
            Round {state.currentRound} / {config.rounds}
          </span>
          <span>
            Exercise {state.currentExercise} / {config.exercises}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full mt-8">
        {/* Placeholder for Pause/Resume if we implement it later */}
        <Button
          variant="outline"
          size="lg"
          className="w-full h-14 text-lg"
          onClick={onStop}
        >
          STOP
          <X className="ml-2 h-5 w-5" />
        </Button>
        {state.phase === "FINISHED" && (
          <Button
            size="lg"
            className="w-full h-14 text-lg text-green-700 bg-green-300 hover:bg-green-500"
            onClick={onReset}
          >
            NEW WORKOUT
            <RotateCcw className="mr-2 h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
