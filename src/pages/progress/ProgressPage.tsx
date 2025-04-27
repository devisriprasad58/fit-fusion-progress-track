
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProgressData, mockUsers, mockWorkouts } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { CalendarDays, Activity } from "lucide-react";
import { ProgressStats } from "./components/ProgressStats";
import { RecentWorkouts } from "./components/RecentWorkouts";

export default function ProgressPage() {
  const { user } = useAuth();
  if (!user) return null;

  const userProgress = mockProgressData.filter(progress => progress.userId === user.id);

  // Prepare data for the weekly activity chart
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayProgress = userProgress.filter(progress => {
      const progressDate = new Date(progress.completedDate);
      return progressDate.toDateString() === date.toDateString();
    });

    return {
      date: format(date, "EEE"),
      minutes: dayProgress.reduce((sum, p) => sum + p.duration, 0),
      calories: dayProgress.reduce((sum, p) => sum + (p.caloriesBurned || 0), 0) / 10 // Divided by 10 for better scale
    };
  }).reverse();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progress</h1>
        <p className="text-muted-foreground">Track your fitness journey</p>
      </div>

      <ProgressStats progress={userProgress} />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                minutes: { label: "Minutes", color: "#30B8B2" },
                calories: { label: "Calories (÷10)", color: "#FF6B6B" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis width={30} />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#30B8B2" />
                  <Bar dataKey="calories" fill="#FF6B6B" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <RecentWorkouts progress={userProgress} />
      </div>
    </div>
  );
}
