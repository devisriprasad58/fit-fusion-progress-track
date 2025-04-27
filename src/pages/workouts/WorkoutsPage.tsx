
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockWorkouts } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dumbbell, Search, Filter } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { WorkoutCard } from './components/WorkoutCard';

export default function WorkoutsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkouts = mockWorkouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.description?.toLowerCase().includes(searchQuery.toLowerCase());
    if (user?.role === 'trainer') {
      return matchesSearch && workout.createdBy === user.id;
    }
    return matchesSearch;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-muted-foreground">Manage your workout catalog</p>
        </div>
        {user?.role === 'trainer' && (
          <Button className="bg-fit-primary hover:bg-fit-primary/90">
            <Dumbbell className="mr-2 h-4 w-4" />
            Create Workout
          </Button>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search workouts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkouts.map(workout => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}
