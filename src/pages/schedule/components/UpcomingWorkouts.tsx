
import { Card, CardContent } from "@/components/ui/card";
import { WorkoutPlan } from "@/types/fitness.types";
import { format, isAfter } from "date-fns";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

interface UpcomingWorkoutsProps {
  workoutPlans: WorkoutPlan[];
}

export function UpcomingWorkouts({ workoutPlans }: UpcomingWorkoutsProps) {
  const upcomingWorkouts = workoutPlans
    .flatMap(plan => 
      plan.workouts.map(workout => ({
        ...workout,
        planName: plan.name
      }))
    )
    .filter(workout => isAfter(new Date(workout.scheduledDate), new Date()))
    .sort((a, b) => 
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    )
    .slice(0, 5);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {upcomingWorkouts.map((workout, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-fit-primary" />
                <div>
                  <p className="font-medium">{workout.planName}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(workout.scheduledDate), 'PPP')}
                  </p>
                </div>
              </div>
              {workout.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
