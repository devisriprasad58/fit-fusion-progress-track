
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockGroups, mockProgressData, mockUsers, mockWorkoutPlans, mockWorkouts } from "@/data/mockData";
import { Dumbbell, UserIcon, Users, Calendar, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart as Chart } from "@/components/ui/chart";
import { useAuth } from "@/context/AuthContext";

export default function TrainerDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const trainerId = user.id;
  
  // Filter data for the current trainer
  const trainerWorkouts = mockWorkouts.filter(workout => workout.createdBy === trainerId);
  const trainerPlans = mockWorkoutPlans.filter(plan => plan.trainerId === trainerId);
  const trainerGroups = mockGroups.filter(group => group.trainerId === trainerId);
  
  // Get all trainee IDs for this trainer
  const traineeIds = Array.from(new Set(
    trainerGroups.flatMap(group => group.trainees)
      .concat(trainerPlans.flatMap(plan => plan.trainees))
  ));
  
  const trainees = mockUsers.filter(user => traineeIds.includes(user.id));
  
  // Get recent progress data
  const recentProgress = mockProgressData
    .filter(progress => {
      const plan = mockWorkoutPlans.find(p => p.id === progress.planId);
      return plan && plan.trainerId === trainerId;
    })
    .sort((a, b) => b.completedDate.getTime() - a.completedDate.getTime())
    .slice(0, 5);
  
  // Create chart data
  const workoutCompletionData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const completed = mockProgressData.filter(progress => {
      const progressDate = new Date(progress.completedDate);
      return progressDate.toDateString() === date.toDateString() &&
             traineeIds.includes(progress.userId);
    }).length;
    
    return {
      name: dateString,
      total: completed
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trainees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainees.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {trainerGroups.length} groups
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts Created</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainerWorkouts.length}</div>
            <p className="text-xs text-muted-foreground">
              {trainerWorkouts.filter(w => w.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainerPlans.length}</div>
            <p className="text-xs text-muted-foreground">
              For {Array.from(new Set(trainerPlans.flatMap(p => p.trainees))).length} trainees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Workout Completions</CardTitle>
            <CardDescription>Workouts completed over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Chart 
              data={workoutCompletionData} 
              categories={["total"]}
              index="name"
              yAxisWidth={30}
              className="h-[300px]"
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest trainee workout completions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProgress.map((progress, i) => {
                const trainee = mockUsers.find(u => u.id === progress.userId);
                const workout = mockWorkouts.find(w => w.id === progress.workoutId);
                
                return (
                  <div key={i} className="flex items-center">
                    <div className="mr-4 rounded-full bg-fit-primary/20 p-2">
                      <UserIcon className="h-4 w-4 text-fit-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {trainee?.name} completed {workout?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {progress.completedDate.toLocaleDateString()} • {progress.duration} min • {progress.caloriesBurned} cal
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Your Groups</CardTitle>
            <CardDescription>Manage your trainee groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {trainerGroups.length > 0 ? (
                trainerGroups.map(group => (
                  <div key={group.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-xs text-muted-foreground">{group.trainees.length} trainees</p>
                    </div>
                    <Link 
                      to={`/trainees?groupId=${group.id}`}
                      className="text-xs text-fit-primary hover:underline"
                    >
                      View
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No groups created yet.</p>
              )}
            </div>
            <Link to="/trainees" className="block mt-4">
              <button className="w-full py-2 text-fit-primary border border-fit-primary rounded-md hover:bg-fit-primary/5 text-sm">
                Manage Groups
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workout Plans</CardTitle>
            <CardDescription>Your active training plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {trainerPlans.length > 0 ? (
                trainerPlans.map(plan => (
                  <div key={plan.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {plan.workouts.length} workouts • {plan.trainees.length} trainees
                      </p>
                    </div>
                    <Link 
                      to={`/workouts?planId=${plan.id}`}
                      className="text-xs text-fit-primary hover:underline"
                    >
                      View
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No plans created yet.</p>
              )}
            </div>
            <Link to="/workouts" className="block mt-4">
              <button className="w-full py-2 text-fit-primary border border-fit-primary rounded-md hover:bg-fit-primary/5 text-sm">
                Manage Plans
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link to="/workouts/create" className="block">
              <button className="w-full py-2 bg-fit-primary text-white rounded-md hover:bg-fit-primary/90 text-sm">
                Create New Workout
              </button>
            </Link>
            <Link to="/trainees/invite" className="block">
              <button className="w-full py-2 border border-fit-primary text-fit-primary rounded-md hover:bg-fit-primary/5 text-sm">
                Invite Trainee
              </button>
            </Link>
            <Link to="/progress" className="block">
              <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                View All Progress Data
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
