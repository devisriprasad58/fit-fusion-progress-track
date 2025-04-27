
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TraineeGroup } from "@/types/fitness.types";
import { Group, UserRound } from "lucide-react";
import { mockUsers } from "@/data/mockData";

interface GroupCardProps {
  group: TraineeGroup;
}

export function GroupCard({ group }: GroupCardProps) {
  const trainees = mockUsers.filter(user => group.trainees.includes(user.id));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <div className="h-10 w-10 rounded-full bg-fit-primary/20 flex items-center justify-center">
          <Group className="h-5 w-5 text-fit-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{group.name}</h3>
          <p className="text-sm text-muted-foreground">
            {trainees.length} trainees
          </p>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-2">
          {trainees.slice(0, 3).map(trainee => (
            <div key={trainee.id} className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-fit-primary/10 flex items-center justify-center">
                <UserRound className="h-4 w-4 text-fit-primary" />
              </div>
              <span>{trainee.name}</span>
            </div>
          ))}
          {trainees.length > 3 && (
            <p className="text-sm text-muted-foreground">
              +{trainees.length - 3} more trainees
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
