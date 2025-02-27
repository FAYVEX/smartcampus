import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import SafetyPage from "./pages/safety";
import LostFound from "./pages/LostFound";
import TravelBuddy from "./pages/TravelBuddy";
import FoodDist from "./pages/FoodDist";
import Food from "./pages/Food";
import NotFound from "./pages/NotFound";
import Imp from "./pages/Imp";
import Cam from "./pages/cam"; // Import the new Imp page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/food-distribution" element={<FoodDist />} />
          <Route path="/travel-buddy" element={<TravelBuddy />} />
          <Route path="/food" element={<Food />} />
          <Route path="/cam" element={<Cam />} />
          <Route path="/imp" element={<Imp />} /> {/* Add route for the Imp page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;