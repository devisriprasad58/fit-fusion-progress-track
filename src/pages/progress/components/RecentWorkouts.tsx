
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutProgress } from "@/types/fitness.types";
import { mockWorkouts } from "@/data/mockData";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface RecentWorkoutsProps {
  progress: WorkoutProgress[];
}

export function RecentWorkouts({ progress }: RecentWorkoutsProps) {
  const recentProgress = [...progress]
    .sort((a, b) => new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Recent Workouts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentProgress.map((p, i) => {
            const workout = mockWorkouts.find(w => w.id === p.workoutId);
            return (
              <div key={i} className="flex items-center space-x-4 rounded-lg border p-3">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{workout?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(p.completedDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p>{p.duration} min</p>
                  <p className="text-muted-foreground">{p.caloriesBurned} cal</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
