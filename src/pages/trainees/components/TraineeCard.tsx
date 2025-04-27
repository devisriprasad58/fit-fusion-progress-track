
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "@/types/fitness.types";
import { UserRound } from "lucide-react";

interface TraineeCardProps {
  trainee: User;
}

export function TraineeCard({ trainee }: TraineeCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <div className="h-10 w-10 rounded-full bg-fit-primary/20 flex items-center justify-center">
          <UserRound className="h-5 w-5 text-fit-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{trainee.name}</h3>
          <p className="text-sm text-muted-foreground">{trainee.email}</p>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Location:</span>
          <span>{trainee.location?.city || 'N/A'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
