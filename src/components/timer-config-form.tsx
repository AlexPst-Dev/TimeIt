import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimerConfig } from "@/hooks/use-interval-timer";
import { Play } from "lucide-react";

interface TimerConfigFormProps {
  config: TimerConfig;
  onConfigChange: (config: TimerConfig) => void;
  onStart: () => void;
}

// Les champs du formulaire avec leur valeur minimale
const FIELDS: {
  name: keyof TimerConfig;
  label: string;
  min: number;
}[] = [
  { name: "workDuration", label: "WORK DURATION (sec)", min: 1 },
  { name: "restDuration", label: "REST DURATION (sec)", min: 0 },
  { name: "roundRestDuration", label: "ROUND REST (sec)", min: 0 },
];

export function TimerConfigForm({
  config,
  onConfigChange,
  onStart,
}: TimerConfigFormProps) {
  // State local en string pour chaque champ, initialisé depuis config
  const [localValues, setLocalValues] = useState<
    Record<keyof TimerConfig, string>
  >({
    rounds: String(config.rounds),
    exercises: String(config.exercises),
    workDuration: String(config.workDuration),
    restDuration: String(config.restDuration),
    roundRestDuration: String(config.roundRestDuration),
  });

  // Sync si config change depuis l'extérieur (ex: reset)
  useEffect(() => {
    setLocalValues({
      rounds: String(config.rounds),
      exercises: String(config.exercises),
      workDuration: String(config.workDuration),
      restDuration: String(config.restDuration),
      roundRestDuration: String(config.roundRestDuration),
    });
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Autorise uniquement les chiffres (pas de signe, pas de décimal)
    if (value === "" || /^\d+$/.test(value)) {
      setLocalValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const key = name as keyof TimerConfig;
    const fieldMeta = FIELDS.find((f) => f.name === key);
    const min = fieldMeta?.min ?? 1;

    const parsed = parseInt(localValues[key], 10);
    // Si vide ou invalide, on remet la valeur minimale
    const clamped = isNaN(parsed) ? min : Math.max(parsed, min);

    setLocalValues((prev) => ({ ...prev, [key]: String(clamped) }));
    onConfigChange({ ...config, [key]: clamped });
  };

  // Sélectionne tout le contenu au focus pour faciliter le remplacement
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const calculateTotalDuration = () => {
    let total = 0;
    for (let r = 1; r <= config.rounds; r++) {
      for (let e = 1; e <= config.exercises; e++) {
        total += config.workDuration;
        if (e < config.exercises) {
          total += config.restDuration;
        } else if (r < config.rounds) {
          total += config.roundRestDuration;
        }
      }
    }
    return formatTime(total);
  };

  return (
    <div className="w-full flex flex-col space-y-6 p-6 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TIME IT
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure your interval circuit
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rounds">ROUNDS</Label>
            <Input
              id="rounds"
              name="rounds"
              type="number"
              inputMode="numeric"
              min="1"
              value={localValues.rounds}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className="text-center text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exercises">EXERCISES</Label>
            <Input
              id="exercises"
              name="exercises"
              type="number"
              inputMode="numeric"
              min="1"
              value={localValues.exercises}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className="text-center text-lg"
            />
          </div>
        </div>

        {FIELDS.map(({ name, label, min }) => (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
              id={name}
              name={name}
              type="number"
              inputMode="numeric"
              min={min}
              value={localValues[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className="text-center text-lg"
            />
          </div>
        ))}

        <div className="pt-4 w-full flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">TOTAL DURATION</p>
          <p className="text-3xl text-center font-bold text-slate-800 dark:text-slate-100">
            {calculateTotalDuration()}
          </p>
        </div>

        <Button
          className="flex items-center justify-center w-full h-12 text-lg font-bold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all shadow-md hover:shadow-lg"
          onClick={onStart}
        >
          START WORKOUT
          <Play className="ml-2 h-5 w-5 fill-current" />
        </Button>
      </div>
    </div>
  );
}
