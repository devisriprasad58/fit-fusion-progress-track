
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Dumbbell } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fit-light p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-10 w-10 text-fit-primary" />
            <h1 className="text-3xl font-bold text-fit-secondary">FitFusion</h1>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Tabs defaultValue="trainer">
            <div className="p-6 pb-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="trainer">Trainer</TabsTrigger>
                <TabsTrigger value="trainee">Trainee</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="trainer">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Login as Trainer</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john.trainer@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-fit-primary hover:bg-fit-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </form>
                <div className="mt-4 text-center text-sm">
                  <p>
                    Don't have an account?{" "}
                    <Link to="/auth/register" className="text-fit-primary hover:underline">
                      Register
                    </Link>
                  </p>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    Create an account to get started with FitFusion
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="trainee">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Login as Trainee</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="jane.trainee@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-fit-primary hover:bg-fit-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </form>
                <div className="mt-4 text-center text-sm">
                  <p>
                    Don't have an account?{" "}
                    <Link to="/auth/register" className="text-fit-primary hover:underline">
                      Register
                    </Link>
                  </p>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    Create an account to get started with FitFusion
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
