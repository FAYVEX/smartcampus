
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
        <div className="glass-card p-6 rounded-lg animate-fade-in">
          <p className="text-gray-600">Welcome to the Admin Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
