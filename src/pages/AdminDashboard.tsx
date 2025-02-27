
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  LogOut, 
  LayoutDashboard,
  Shield, 
  CalendarCheck, 
  Search, 
  Utensils,
  Settings,
  User
} from "lucide-react";
import { SOSAlertsList } from "@/components/SOSAlertsList";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Mock admin data (replace with real API call later)
const mockAdmin = {
  name: "Admin User",
  role: "System Administrator"
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const features = [
    {
      title: "Important notification",
      description: "Quick notification",
      icon: LayoutDashboard,
      route: "/imp",
      color: "bg-purple-500",
    },
    {
      title: "Safety Reports",
      description: "Review and manage safety incidents.",
      icon: Shield,
      route: "/safety-reports",
      color: "bg-red-500",
    },
    {
      title: "Attendance Logs",
      description: "Track student attendance records.",
      icon: CalendarCheck,
      route: "/attendance-logs",
      color: "bg-green-500",
    },
    {
      title: "Food Distribution",
      description: "Manage food redistribution system.",
      icon: Utensils,
      route: "/food-distribution",
      color: "bg-orange-500",
    },
    {
      title: "Lost & Found",
      description: "Oversee lost item reports.",
      icon: Search,
      route: "/lost-found-admin",
      color: "bg-blue-500",
    },
    {
      title: "Settings",
      description: "Configure system parameters.",
      icon: Settings,
      route: "/settings",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold animate-fade-in">
                {greeting}, {mockAdmin.name}!
              </h1>
              <p className="text-gray-500">
                {mockAdmin.role}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>

        {/* SOS Alerts Section */}
        <div className="mb-8">
          <SOSAlertsList />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {features.map((feature) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.route)}
              className="glass-card p-6 rounded-xl transition-all duration-300 
                transform hover:scale-105 hover:shadow-xl animate-fade-in
                bg-white/50 backdrop-blur-lg border border-gray-200
                flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} 
                flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
