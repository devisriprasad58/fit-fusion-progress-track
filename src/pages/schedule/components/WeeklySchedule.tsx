
import { Card, CardContent } from "@/components/ui/card";
import { WorkoutPlan } from "@/types/fitness.types";
import { format, startOfWeek, addDays } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface WeeklyScheduleProps {
  workoutPlans: WorkoutPlan[];
}

export function WeeklySchedule({ workoutPlans }: WeeklyScheduleProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getWorkoutsForDate = (date: Date) => {
    return workoutPlans.flatMap(plan => 
      plan.workouts.filter(workout => 
        format(new Date(workout.scheduledDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Week of {format(currentWeekStart, 'MMM d, yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
            >
              Previous Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
            >
              Next Week
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {days.map((day, index) => (
            <div key={index} className="space-y-2">
              <div className="text-sm font-medium text-center">
                {format(day, 'EEE')}
                <br />
                {format(day, 'd')}
              </div>
              <div className="min-h-[100px] border rounded-lg p-2 space-y-2">
                {getWorkoutsForDate(day).map((workout, wIndex) => (
                  <div
                    key={wIndex}
                    className="text-xs p-2 rounded bg-fit-primary/10 text-fit-primary flex items-center gap-1"
                  >
                    <Calendar className="h-3 w-3" />
                    <span>Workout</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
