import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import WorkoutsPage from "./pages/workouts/WorkoutsPage";
import TraineesPage from "./pages/trainees/TraineesPage";
import ProgressPage from "./pages/progress/ProgressPage";
import SchedulePage from "./pages/schedule/SchedulePage";
import AssistantPage from "./pages/assistant/AssistantPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="workouts" element={<WorkoutsPage />} />
              <Route path="trainees" element={<TraineesPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="my-workouts" element={<div className="p-4">My Workouts page will be implemented in the next iteration</div>} />
              <Route path="my-progress" element={<div className="p-4">My Progress page will be implemented in the next iteration</div>} />
              <Route path="history" element={<div className="p-4">History page will be implemented in the next iteration</div>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
