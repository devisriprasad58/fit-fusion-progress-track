
import { useAuth } from "@/context/AuthContext";
import TrainerDashboard from "./trainer/TrainerDashboard";
import TraineeDashboard from "./trainee/TraineeDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "trainer") {
    return <TrainerDashboard />;
  } else {
    return <TraineeDashboard />;
  }
}
