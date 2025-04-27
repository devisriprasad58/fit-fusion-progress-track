
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockGroups, mockUsers } from "@/data/mockData";
import { TraineeCard } from './components/TraineeCard';
import { GroupCard } from './components/GroupCard';

export default function TraineesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user || user.role !== 'trainer') {
    return <div className="p-6">Access denied. Trainer privileges required.</div>;
  }

  const trainerGroups = mockGroups.filter(group => group.trainerId === user.id);
  const traineeIds = Array.from(new Set(trainerGroups.flatMap(group => group.trainees)));
  const trainees = mockUsers.filter(user => traineeIds.includes(user.id));
  
  const filteredTrainees = trainees.filter(trainee => 
    trainee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trainees</h1>
          <p className="text-muted-foreground">Manage your trainees and groups</p>
        </div>
        <Button className="bg-fit-primary hover:bg-fit-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Trainee
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search trainees..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Groups ({trainerGroups.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trainerGroups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Trainees ({trainees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrainees.map(trainee => (
                <TraineeCard key={trainee.id} trainee={trainee} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
