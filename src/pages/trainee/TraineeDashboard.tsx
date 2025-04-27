
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockGroups, mockProgressData, mockUsers, mockWorkoutPlans, mockWorkouts } from "@/data/mockData";
import { Dumbbell, CalendarCheck, Calendar, Activity, BarChart, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart as Chart } from "@/components/ui/chart";
import { useAuth } from "@/context/AuthContext";

export default function TraineeDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const traineeId = user.id;
  
  // Filter data for the current trainee
  const traineeGroups = mockGroups.filter(group => group.trainees.includes(traineeId));
  const traineePlans = mockWorkoutPlans.filter(plan => plan.trainees.includes(traineeId));
  
  // Get trainee progress data
  const traineeProgress = mockProgressData.filter(progress => progress.userId === traineeId);
  
  // Find upcoming workouts
  const upcomingWorkouts = traineePlans.flatMap(plan => 
    plan.workouts
      .filter(workout => !workout.completed && new Date(workout.scheduledDate) > new Date())
      .map(workout => ({
        ...workout,
        planId: plan.id,
        planName: plan.name,
        details: mockWorkouts.find(w => w.id === workout.workoutId)
      }))
  ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
   .slice(0, 3);
  
  // Calculate stats
  const totalWorkoutsCompleted = traineeProgress.length;
  const totalCaloriesBurned = traineeProgress.reduce((sum, progress) => sum + (progress.caloriesBurned || 0), 0);
  const totalMinutesWorkedOut = traineeProgress.reduce((sum, progress) => sum + progress.duration, 0);
  
  // Create chart data for last 7 days of activity
  const activityData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const dayProgress = traineeProgress.filter(progress => {
      const progressDate = new Date(progress.completedDate);
      return progressDate.toDateString() === date.toDateString();
    });
    
    const calories = dayProgress.reduce((sum, p) => sum + (p.caloriesBurned || 0), 0);
    const minutes = dayProgress.reduce((sum, p) => sum + p.duration, 0);
    
    return {
      name: dateString,
      minutes,
      calories: calories / 10 // Scale down calories to fit on the same chart
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkoutsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              {traineeProgress.filter(p => p.completedDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCaloriesBurned}</div>
            <p className="text-xs text-muted-foreground">
              {traineeProgress.filter(p => p.completedDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                .reduce((sum, p) => sum + (p.caloriesBurned || 0), 0)} this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minutes Active</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMinutesWorkedOut}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(totalMinutesWorkedOut / 60)} hours total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{traineePlans.length}</div>
            <p className="text-xs text-muted-foreground">
              From {traineeGroups.length} trainers
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Your Activity</CardTitle>
            <CardDescription>Minutes and calories over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Chart 
              data={activityData} 
              categories={["minutes", "calories"]}
              index="name"
              yAxisWidth={30}
              className="h-[300px]"
              colors={["#30B8B2", "#FF6B6B"]}
              valueFormatter={(value) => `${value}`}
            />
            <div className="flex justify-center gap-8 mt-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-fit-primary rounded-full mr-2"></div>
                <span>Minutes</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-fit-accent rounded-full mr-2"></div>
                <span>Calories (÷10)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Workouts</CardTitle>
            <CardDescription>Your scheduled training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingWorkouts.length > 0 ? (
                upcomingWorkouts.map((workout, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mr-4 rounded-full bg-fit-primary/20 p-2 mt-1">
                      <Calendar className="h-4 w-4 text-fit-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {workout.details?.name}
                      </p>
                      <p className="text-xs">
                        {new Date(workout.scheduledDate).toLocaleDateString()} • {workout.details?.duration} min
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Part of "{workout.planName}" plan
                      </p>
                    </div>
                    <Link 
                      to={`/my-workouts/${workout.workoutId}`}
                      className="text-xs text-fit-primary hover:underline"
                    >
                      Details
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming workouts scheduled.</p>
              )}
              
              {upcomingWorkouts.length > 0 && (
                <Link to="/my-workouts" className="block mt-6">
                  <button className="w-full py-2 border border-fit-primary text-fit-primary rounded-md hover:bg-fit-primary/5 text-sm">
                    View All Workouts
                  </button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Your Groups</CardTitle>
            <CardDescription>Groups you're a member of</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {traineeGroups.length > 0 ? (
                traineeGroups.map(group => {
                  const trainer = mockUsers.find(u => u.id === group.trainerId);
                  return (
                    <div key={group.id} className="p-2 border rounded">
                      <p className="font-medium">{group.name}</p>
                      <p className="text-xs text-muted-foreground">Trainer: {trainer?.name}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">You are not in any groups yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Progress</CardTitle>
            <CardDescription>Your recent workout completions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {traineeProgress.length > 0 ? (
                traineeProgress
                  .sort((a, b) => new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime())
                  .slice(0, 3)
                  .map((progress, i) => {
                    const workout = mockWorkouts.find(w => w.id === progress.workoutId);
                    return (
                      <div key={i} className="p-2 border rounded">
                        <p className="font-medium">{workout?.name}</p>
                        <div className="flex justify-between text-xs">
                          <span>{new Date(progress.completedDate).toLocaleDateString()}</span>
                          <span>{progress.duration} min • {progress.caloriesBurned} cal</span>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-sm text-muted-foreground">No workout progress recorded yet.</p>
              )}
            </div>
            
            {traineeProgress.length > 0 && (
              <Link to="/my-progress" className="block mt-4">
                <button className="w-full py-2 border border-fit-primary text-fit-primary rounded-md hover:bg-fit-primary/5 text-sm">
                  View Full History
                </button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link to="/my-workouts" className="block">
              <button className="w-full py-2 bg-fit-primary text-white rounded-md hover:bg-fit-primary/90 text-sm">
                Start Workout
              </button>
            </Link>
            <Link to="/my-progress" className="block">
              <button className="w-full py-2 border border-fit-primary text-fit-primary rounded-md hover:bg-fit-primary/5 text-sm">
                Track Progress
              </button>
            </Link>
            <Link to="/history" className="block">
              <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                View Workout History
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
