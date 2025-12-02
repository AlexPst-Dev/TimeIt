import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TimerConfig } from "@/hooks/use-interval-timer"
import { Play } from "lucide-react"

interface TimerConfigFormProps {
  config: TimerConfig;
  onConfigChange: (config: TimerConfig) => void;
  onStart: () => void;
}

export function TimerConfigForm({ config, onConfigChange, onStart }: TimerConfigFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onConfigChange({
      ...config,
      [name]: parseInt(value) || 0,
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const calculateTotalDuration = () => {
    // Simple calculation for display purposes
    // (Work + Rest) * Exercises * Rounds - Rest + (RoundRest * (Rounds - 1))
    // Logic should match hook but let's keep it simple estimation here or duplicate logic
    // Let's duplicate the simple logic from hook for now or just trust the user sees the result
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
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/50 backdrop-blur-sm dark:bg-slate-950/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TimeIt</CardTitle>
        <CardDescription className="text-center">Configure your interval circuit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rounds">Rounds</Label>
            <Input
              id="rounds"
              name="rounds"
              type="number"
              min="1"
              value={config.rounds}
              onChange={handleChange}
              className="text-center text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exercises">Exercises</Label>
            <Input
              id="exercises"
              name="exercises"
              type="number"
              min="1"
              value={config.exercises}
              onChange={handleChange}
              className="text-center text-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workDuration">Work Duration (sec)</Label>
          <Input
            id="workDuration"
            name="workDuration"
            type="number"
            min="5"
            step="5"
            value={config.workDuration}
            onChange={handleChange}
            className="text-center text-lg font-medium text-green-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="restDuration">Rest Duration (sec)</Label>
          <Input
            id="restDuration"
            name="restDuration"
            type="number"
            min="0"
            step="5"
            value={config.restDuration}
            onChange={handleChange}
            className="text-center text-lg font-medium text-amber-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roundRestDuration">Round Rest (sec)</Label>
          <Input
            id="roundRestDuration"
            name="roundRestDuration"
            type="number"
            min="0"
            step="10"
            value={config.roundRestDuration}
            onChange={handleChange}
            className="text-center text-lg font-medium text-blue-600"
          />
        </div>

        <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Total Duration</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{calculateTotalDuration()}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg" onClick={onStart}>
          <Play className="mr-2 h-5 w-5 fill-current" /> Start Workout
        </Button>
      </CardFooter>
    </Card>
  )
}
