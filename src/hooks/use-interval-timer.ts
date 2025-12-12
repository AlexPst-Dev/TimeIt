import { useState, useEffect, useRef, useCallback } from "react";

export type TimerPhase =
  | "IDLE"
  | "COUNTDOWN"
  | "WORK"
  | "REST"
  | "ROUND_REST"
  | "FINISHED";

export interface TimerConfig {
  rounds: number;
  exercises: number;
  workDuration: number;
  restDuration: number;
  roundRestDuration: number;
}

export interface TimerState {
  phase: TimerPhase;
  timeLeft: number;
  currentRound: number;
  currentExercise: number;
  totalTime: number;
  elapsedTime: number;
}

export function useIntervalTimer() {
  const [config, setConfig] = useState<TimerConfig>({
    rounds: 2,
    exercises: 8,
    workDuration: 40,
    restDuration: 20,
    roundRestDuration: 60,
  });

  const [state, setState] = useState<TimerState>({
    phase: "IDLE",
    timeLeft: 0,
    currentRound: 1,
    currentExercise: 1,
    totalTime: 0,
    elapsedTime: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const calculateTotalTime = useCallback((cfg: TimerConfig) => {
    const oneRound =
      cfg.exercises * (cfg.workDuration + cfg.restDuration) - cfg.restDuration; // Last rest of round is roundRest
    const total =
      oneRound * cfg.rounds + (cfg.rounds - 1) * cfg.roundRestDuration;
    // Actually, usually the last exercise of a round is followed by round rest instead of normal rest.
    // Let's simplify:
    // Round = (Exercise + Rest) * (Exercises - 1) + Exercise + RoundRest
    // Total = Round * (Rounds - 1) + (Exercise + Rest) * (Exercises - 1) + Exercise

    // Let's stick to a simpler logic flow:
    // For each round:
    //   For each exercise:
    //     Work
    //     Rest (unless last exercise AND last round -> Finish)
    //     (if last exercise AND NOT last round -> Round Rest)

    let t = 0;
    for (let r = 1; r <= cfg.rounds; r++) {
      for (let e = 1; e <= cfg.exercises; e++) {
        t += cfg.workDuration;
        if (e < cfg.exercises) {
          t += cfg.restDuration;
        } else if (r < cfg.rounds) {
          t += cfg.roundRestDuration;
        }
      }
    }
    return t;
  }, []);

  const startTimer = () => {
    setState((prev) => ({
      ...prev,
      phase: "COUNTDOWN",
      timeLeft: 3,
      currentRound: 1,
      currentExercise: 1,
      totalTime: calculateTotalTime(config),
      elapsedTime: 0,
    }));
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState((prev) => ({ ...prev, phase: "IDLE", timeLeft: 0 }));
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setState({
      phase: "IDLE",
      timeLeft: 0,
      currentRound: 1,
      currentExercise: 1,
      totalTime: 0,
      elapsedTime: 0,
    });
  };

  const tick = useCallback(() => {
    setState((prev) => {
      if (prev.timeLeft > 1) {
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
          elapsedTime:
            prev.phase !== "COUNTDOWN"
              ? prev.elapsedTime + 1
              : prev.elapsedTime,
        };
      }

      // Time left is 0 (or 1 going to 0), transition phase
      const { phase, currentRound, currentExercise } = prev;
      const {
        rounds,
        exercises,
        workDuration,
        restDuration,
        roundRestDuration,
      } = config;

      let nextPhase = phase;
      let nextTime = 0;
      let nextRound = currentRound;
      let nextExercise = currentExercise;

      if (phase === "COUNTDOWN") {
        nextPhase = "WORK";
        nextTime = workDuration;
      } else if (phase === "WORK") {
        if (currentExercise < exercises) {
          nextPhase = "REST";
          nextTime = restDuration;
        } else if (currentRound < rounds) {
          nextPhase = "ROUND_REST";
          nextTime = roundRestDuration;
        } else {
          nextPhase = "FINISHED";
          nextTime = 0;
        }
      } else if (phase === "REST") {
        nextPhase = "WORK";
        nextTime = workDuration;
        nextExercise = currentExercise + 1;
      } else if (phase === "ROUND_REST") {
        nextPhase = "WORK";
        nextTime = workDuration;
        nextRound = currentRound + 1;
        nextExercise = 1;
      }

      // If we're transitioning to FINISHED, we'll let the effect cleanup handle the timer

      return {
        ...prev,
        phase: nextPhase,
        timeLeft: nextTime,
        currentRound: nextRound,
        currentExercise: nextExercise,
        elapsedTime:
          prev.phase !== "COUNTDOWN" ? prev.elapsedTime + 1 : prev.elapsedTime,
      };
    });
  }, [config]);

  useEffect(() => {
    if (state.phase === "FINISHED") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (state.phase !== "IDLE") {
      timerRef.current = setInterval(tick, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.phase, tick]);

  return {
    config,
    setConfig,
    state,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
