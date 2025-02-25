
import { SOSAlertsList } from "@/components/SOSAlertsList";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FeatureGrid } from "@/components/admin/FeatureGrid";

// Mock admin data (replace with real API call later)
const mockAdmin = {
  name: "Admin User",
  role: "System Administrator"
};

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminHeader adminName={mockAdmin.name} adminRole={mockAdmin.role} />
        
        {/* SOS Alerts Section */}
        <div className="mb-8">
          <SOSAlertsList />
        </div>

        <FeatureGrid />
      </div>
    </div>
  );
};

export default AdminDashboard;
