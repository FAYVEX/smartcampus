import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  LogOut, 
  Shield, 
  CalendarCheck, 
  Search, 
  Utensils,
  Sun,
  Moon,
  User
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Profile {
  full_name: string | null;
  department: string | null;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [greeting, setGreeting] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, department')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
    };

    getProfile();
  }, [navigate]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const features = [
    {
      title: "Campus Safety",
      description: "Stay Safe. Report incidents instantly.",
      icon: Shield,
      route: "/safety",
      color: "bg-red-500",
    },
    {
      title: "Travel Buddy",
      description: "Find travel companions for safe journeys.",
      icon: Search,
      route: "/travel-buddy",
      color: "bg-purple-500",
    },
    {
      title: "Automated Attendance",
      description: "Mark your presence seamlessly.",
      icon: CalendarCheck,
      route: "/face-recognition",  // 🔥 This should point to your face recognition page
      color: "bg-green-500",
    },
    {
      title: "Food & Redistribution",
      description: "Prevent waste. Share excess food.",
      icon: Utensils,
      route: "/food",
      color: "bg-orange-500",
    },
    {
      title: "Lost & Found",
      description: "Report & recover lost items.",
      icon: Search,
      route: "/lost-found",
      color: "bg-blue-500",
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User  className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className=" text-3xl font-semibold animate-fade-in">
                {greeting}, {profile?.full_name || 'User '}!
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Welcome to your Smart Campus Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {features.map((feature) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.route)}
              className={`glass-card p-6 rounded-xl transition-all duration-300 
                transform hover:scale-105 hover:shadow-xl animate-fade-in
                ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}
                backdrop-blur-lg border border-gray-200 dark:border-gray-700`}
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} 
                flex items-center justify-center mb-4 mx-auto`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;