
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard,
  Shield, 
  CalendarCheck, 
  Search, 
  Utensils,
  Settings,
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeatureGrid() {
  const navigate = useNavigate();
  
  const features = [
    {
      title: "Dashboard Overview",
      description: "Monitor system metrics and analytics.",
      icon: LayoutDashboard,
      route: "/dashboard-overview",
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          color={feature.color}
          onClick={() => navigate(feature.route)}
        />
      ))}
    </div>
  );
}
