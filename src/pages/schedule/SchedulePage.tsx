
import { mockWorkoutPlans } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklySchedule } from "./components/WeeklySchedule";
import { UpcomingWorkouts } from "./components/UpcomingWorkouts";
import { CalendarClock } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-8 w-8 text-fit-primary" />
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Manage your workout schedule</p>
        </div>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Workouts</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <WeeklySchedule workoutPlans={mockWorkoutPlans} />
        </TabsContent>
        <TabsContent value="upcoming">
          <UpcomingWorkouts workoutPlans={mockWorkoutPlans} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
