
export type UserRole = 'trainer' | 'trainee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  location?: {
    city?: string;
    country?: string;
  };
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdBy: string; // trainer id
  createdAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'balance';
  duration: number; // in minutes
  sets?: number;
  reps?: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  workouts: PlanWorkout[];
  trainerId: string;
  trainees: string[]; // array of trainee ids
  createdAt: Date;
  startDate: Date;
  endDate?: Date;
}

export interface PlanWorkout {
  workoutId: string;
  scheduledDate: Date;
  completed: boolean;
  completedDate?: Date;
  feedback?: string;
}

export interface WorkoutProgress {
  userId: string;
  workoutId: string;
  planId: string;
  completedDate: Date;
  duration: number; // actual duration in minutes
  caloriesBurned?: number;
  heartRate?: {
    average?: number;
    max?: number;
  };
  notes?: string;
}

export interface TraineeGroup {
  id: string;
  name: string;
  trainerId: string;
  trainees: string[]; // array of trainee ids
  createdAt: Date;
}

export interface Invite {
  id: string;
  email: string;
  trainerId: string;
  groupId?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  expiresAt: Date;
}
