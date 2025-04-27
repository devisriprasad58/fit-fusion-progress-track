
import { Exercise, Invite, TraineeGroup, User, Workout, WorkoutPlan, WorkoutProgress } from "../types/fitness.types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "john.trainer@example.com",
    name: "John Trainer",
    role: "trainer",
    location: { city: "New York", country: "USA" }
  },
  {
    id: "2",
    email: "jane.trainee@example.com",
    name: "Jane Trainee",
    role: "trainee",
    location: { city: "Los Angeles", country: "USA" }
  },
  {
    id: "3",
    email: "bob.trainee@example.com",
    name: "Bob Trainee",
    role: "trainee",
    location: { city: "Chicago", country: "USA" }
  },
  {
    id: "4",
    email: "sarah.trainer@example.com",
    name: "Sarah Trainer",
    role: "trainer",
    location: { city: "Miami", country: "USA" }
  }
];

// Mock Exercises
export const mockExercises: Exercise[] = [
  {
    id: "1",
    name: "Push-ups",
    type: "strength",
    duration: 5,
    sets: 3,
    reps: 15,
    notes: "Keep your core tight and maintain proper form"
  },
  {
    id: "2",
    name: "Jogging",
    type: "cardio",
    duration: 20,
    notes: "Maintain a steady pace"
  },
  {
    id: "3",
    name: "Yoga Flow",
    type: "flexibility",
    duration: 15,
    notes: "Focus on deep breathing"
  },
  {
    id: "4",
    name: "Squats",
    type: "strength",
    duration: 8,
    sets: 4,
    reps: 12,
    notes: "Keep your knees aligned with your toes"
  },
  {
    id: "5",
    name: "Planks",
    type: "balance",
    duration: 5,
    notes: "Keep your body in a straight line"
  }
];

// Mock Workouts
export const mockWorkouts: Workout[] = [
  {
    id: "1",
    name: "Full Body Strength",
    description: "A complete workout targeting all major muscle groups",
    exercises: [mockExercises[0], mockExercises[3], mockExercises[4]],
    duration: 45,
    difficulty: "intermediate",
    createdBy: "1", // John Trainer
    createdAt: new Date("2023-04-15")
  },
  {
    id: "2",
    name: "Cardio Blast",
    description: "High intensity cardio session",
    exercises: [mockExercises[1]],
    duration: 30,
    difficulty: "advanced",
    createdBy: "1", // John Trainer
    createdAt: new Date("2023-04-20")
  },
  {
    id: "3",
    name: "Recovery Day",
    description: "Light exercises for recovery",
    exercises: [mockExercises[2], mockExercises[4]],
    duration: 25,
    difficulty: "beginner",
    createdBy: "4", // Sarah Trainer
    createdAt: new Date("2023-04-25")
  }
];

// Mock Workout Plans
export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: "1",
    name: "8-Week Strength Builder",
    description: "Progressive plan to build strength and endurance",
    workouts: [
      { 
        workoutId: "1", 
        scheduledDate: new Date("2023-05-01"), 
        completed: true,
        completedDate: new Date("2023-05-01")
      },
      { 
        workoutId: "2", 
        scheduledDate: new Date("2023-05-03"), 
        completed: true,
        completedDate: new Date("2023-05-03")
      },
      { 
        workoutId: "3", 
        scheduledDate: new Date("2023-05-05"), 
        completed: false
      },
      { 
        workoutId: "1", 
        scheduledDate: new Date("2023-05-08"), 
        completed: false
      }
    ],
    trainerId: "1", // John Trainer
    trainees: ["2", "3"], // Jane and Bob Trainees
    createdAt: new Date("2023-04-28"),
    startDate: new Date("2023-05-01")
  }
];

// Mock Groups
export const mockGroups: TraineeGroup[] = [
  {
    id: "1",
    name: "Morning Warriors",
    trainerId: "1", // John Trainer
    trainees: ["2"], // Jane Trainee
    createdAt: new Date("2023-04-10")
  },
  {
    id: "2",
    name: "Evening Athletes",
    trainerId: "4", // Sarah Trainer
    trainees: ["3"], // Bob Trainee
    createdAt: new Date("2023-04-12")
  }
];

// Mock Invites
export const mockInvites: Invite[] = [
  {
    id: "1",
    email: "new.trainee@example.com",
    trainerId: "1", // John Trainer
    groupId: "1", // Morning Warriors
    status: "pending",
    createdAt: new Date("2023-04-26"),
    expiresAt: new Date("2023-05-10")
  }
];

// Mock Progress Data
export const mockProgressData: WorkoutProgress[] = [
  {
    userId: "2", // Jane Trainee
    workoutId: "1", // Full Body Strength
    planId: "1", // 8-Week Strength Builder
    completedDate: new Date("2023-05-01"),
    duration: 42, // actual duration in minutes
    caloriesBurned: 320,
    heartRate: {
      average: 135,
      max: 160
    },
    notes: "Felt good, increased weight on squats"
  },
  {
    userId: "2", // Jane Trainee
    workoutId: "2", // Cardio Blast
    planId: "1", // 8-Week Strength Builder
    completedDate: new Date("2023-05-03"),
    duration: 32, // actual duration in minutes
    caloriesBurned: 380,
    heartRate: {
      average: 145,
      max: 175
    },
    notes: "Pushed hard on the intervals"
  },
  {
    userId: "3", // Bob Trainee
    workoutId: "1", // Full Body Strength
    planId: "1", // 8-Week Strength Builder
    completedDate: new Date("2023-05-01"),
    duration: 50, // actual duration in minutes
    caloriesBurned: 290,
    heartRate: {
      average: 130,
      max: 155
    },
    notes: "Struggled with the last set of push-ups"
  }
];

// Mock current logged in user - change this to switch between roles
export const mockCurrentUser: User = mockUsers[0]; // Default to John Trainer
