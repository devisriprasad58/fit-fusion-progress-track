
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutProgress } from "@/types/fitness.types";
import { Dumbbell, Flame, Clock, Trophy } from "lucide-react";

interface ProgressStatsProps {
  progress: WorkoutProgress[];
}

export function ProgressStats({ progress }: ProgressStatsProps) {
  const totalWorkouts = progress.length;
  const totalMinutes = progress.reduce((sum, p) => sum + p.duration, 0);
  const totalCalories = progress.reduce((sum, p) => sum + (p.caloriesBurned || 0), 0);
  const avgHeartRate = Math.round(
    progress.reduce((sum, p) => sum + (p.heartRate?.average || 0), 0) / 
    progress.filter(p => p.heartRate?.average).length
  ) || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWorkouts}</div>
          <p className="text-xs text-muted-foreground">
            Completed sessions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMinutes}</div>
          <p className="text-xs text-muted-foreground">
            Minutes active
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCalories}</div>
          <p className="text-xs text-muted-foreground">
            Total calories
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Heart Rate</CardTitle>
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgHeartRate}</div>
          <p className="text-xs text-muted-foreground">
            BPM during workouts
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
