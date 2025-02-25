
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";

interface AdminHeaderProps {
  adminName: string;
  adminRole: string;
}

export function AdminHeader({ adminName, adminRole }: AdminHeaderProps) {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold animate-fade-in">
            {greeting}, {adminName}!
          </h1>
          <p className="text-gray-500">{adminRole}</p>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="flex items-center gap-2"
      >
        <LogOut size={18} />
        Sign Out
      </Button>
    </div>
  );
}
