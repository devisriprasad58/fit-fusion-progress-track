
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Workout } from "@/types/fitness.types";
import { Clock, Dumbbell, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const { user } = useAuth();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{workout.name}</CardTitle>
            <CardDescription>{workout.description}</CardDescription>
          </div>
          <div className={`p-2 rounded-full ${
            workout.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
            workout.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            <Dumbbell className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {workout.duration} minutes
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs px-2 py-1 rounded-full bg-fit-primary/10 text-fit-primary">
              {workout.exercises.length} exercises
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-fit-primary/10 text-fit-primary">
              {workout.difficulty}
            </div>
          </div>
          {user?.role === 'trainer' ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Edit</Button>
              <Button variant="outline" size="sm" className="flex-1">Assign</Button>
            </div>
          ) : (
            <Button className="w-full bg-fit-primary hover:bg-fit-primary/90">
              Start Workout
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
