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
  isPaused: boolean;
  onTogglePause: () => void;
}

export const getPhaseColor = (phase: string) => {
  switch (phase) {
    case "WORK":
      return {
        text: "text-green-600 dark:text-green-400",
        bg: "bg-green-600/10",
        progress: "bg-green-500/90",
      };
    case "REST":
      return {
        text: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-600/10",
        progress: "bg-amber-500/90",
      };
    case "ROUND_REST":
      return {
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-600/10",
        progress: "bg-blue-500/90",
      };
    case "COUNTDOWN":
      return {
        text: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-600/10",
        progress: "bg-purple-500/90",
      };
    default:
      return {
        text: "text-slate-600 dark:text-slate-400",
        bg: "bg-slate-600/10",
        progress: "bg-slate-500/90",
      };
  }
};

export const getProgress = (state: TimerState, config: TimerConfig) => {
  if (state.phase === "FINISHED") return 100;
  if (state.phase === "COUNTDOWN") return ((3 - state.timeLeft) / 3) * 100;

  let totalDuration = 0;
  if (state.phase === "WORK") totalDuration = config.workDuration;
  if (state.phase === "REST") totalDuration = config.restDuration;
  if (state.phase === "ROUND_REST") totalDuration = config.roundRestDuration;

  if (totalDuration === 0) return 0;

  return (state.timeLeft / totalDuration) * 100;
};

export function TimerDisplay({
  state,
  config,
  onStop,
  onReset,
  isPaused,
  onTogglePause,
}: TimerDisplayProps) {
  const phaseColors = getPhaseColor(state.phase);

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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full flex items-center justify-center p-4 h-dvh">
      <div className="relative z-10 bg-background/80 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md space-y-8 border border-border/50 shadow-lg">
        <div className="text-center space-y-2">
          <h2
            className={`text-4xl font-black tracking-tighter ${phaseColors.text} animate-in fade-in zoom-in duration-300`}
          >
            {getPhaseLabel()}
          </h2>
          <div className="text-8xl font-black tabular-nums tracking-tighter text-foreground font-mono">
            {state.phase === "FINISHED" ? "DONE" : formatTime(state.timeLeft)}
          </div>
        </div>

        <div className="w-full space-y-2">
          <Progress
            value={getProgress(state, config)}
            className="h-4 w-full bg-background/50"
          />
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
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-14 text-lg"
              onClick={onTogglePause}
            >
              {isPaused ? (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  RESUME
                </>
              ) : (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  PAUSE
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 text-lg"
              onClick={onStop}
            >
              <X className="h-5 w-5 mr-2" />
              STOP
            </Button>
          </div>
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
    </div>
  );
}
