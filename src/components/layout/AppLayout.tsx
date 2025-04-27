
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, UserButton } from "../ui/user";
import { Separator } from "@/components/ui/separator";
import { Dumbbell, Home, BarChart, Calendar, ClockArrowDown, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AppLayout = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fit-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = user.role === "trainer"
    ? [
        { name: "Dashboard", path: "/dashboard", icon: Home },
        { name: "Workouts", path: "/workouts", icon: Dumbbell },
        { name: "Trainees", path: "/trainees", icon: Users },
        { name: "Progress", path: "/progress", icon: BarChart },
        { name: "Schedule", path: "/schedule", icon: Calendar },
      ]
    : [
        { name: "Dashboard", path: "/dashboard", icon: Home },
        { name: "My Workouts", path: "/my-workouts", icon: Dumbbell },
        { name: "My Progress", path: "/my-progress", icon: BarChart },
        { name: "History", path: "/history", icon: ClockArrowDown },
      ];

  return (
    <div className="flex min-h-screen bg-fit-light">
      {/* Sidebar */}
      <div className="w-64 bg-fit-secondary text-white">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-fit-primary" />
            <h1 className="text-2xl font-bold">FitFusion</h1>
          </div>
        </div>
        <Separator className="bg-white/10" />
        <nav className="py-4">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm transition-colors ${
                location.pathname === item.path
                  ? "bg-white/10 text-fit-primary"
                  : "hover:bg-white/5"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
        <Separator className="bg-white/10" />
        <div className="p-6">
          <p className="text-sm text-white/60">
            Logged in as: <span className="font-bold">{user.role}</span>
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <h2 className="text-lg font-medium">
            {location.pathname === '/dashboard' ? 'Dashboard' : 
             location.pathname.startsWith('/workouts') ? 'Workouts' :
             location.pathname.startsWith('/trainees') ? 'Trainees' :
             location.pathname.startsWith('/progress') ? 'Progress' :
             location.pathname.startsWith('/schedule') ? 'Schedule' :
             location.pathname.startsWith('/my-workouts') ? 'My Workouts' :
             location.pathname.startsWith('/my-progress') ? 'My Progress' :
             location.pathname.startsWith('/history') ? 'History' : ''}
          </h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              Logout
            </Button>
            <UserButton
              user={{ 
                name: user.name,
                email: user.email,
                imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=30B8B2&color=fff`
              }}
            />
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
