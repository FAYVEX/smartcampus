
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, MapPin, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Coordinates = {
  latitude: number;
  longitude: number;
} | null;

const SafetyPage = () => {
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState<Coordinates>(null);
  const [isLoading, setIsLoading] = useState(false);

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location Access Required",
          description: "Please enable location services for better assistance.",
          variant: "destructive",
        });
      }
    );
  }

  const handleSOSAlert = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to send an SOS alert.",
          variant: "destructive",
        });
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      // Store the alert in the database
      const { error } = await supabase
        .from('sos_alerts')
        .insert({
          user_id: session.user.id,
          location_lat: coordinates?.latitude,
          location_lng: coordinates?.longitude,
        });

      if (error) throw error;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-sos-alert', {
        body: {
          location_lat: coordinates?.latitude,
          location_lng: coordinates?.longitude,
          user_email: session.user.email,
          user_name: profileData?.full_name || 'Unknown User'
        },
      });

      if (emailError) throw emailError;

      toast({
        title: "SOS Alert Sent",
        description: "Emergency services have been notified. Stay safe.",
      });
    } catch (error) {
      console.error("Error sending SOS alert:", error);
      toast({
        title: "Error",
        description: "Failed to send SOS alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Campus Safety</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your safety is our priority. Access emergency services and report incidents.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center space-y-4">
              <Shield className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-semibold">Emergency SOS</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Press the button below to send an immediate SOS alert to campus security
              </p>
              <Button
                variant="destructive"
                size="lg"
                className="w-full text-lg py-6"
                onClick={handleSOSAlert}
                disabled={isLoading}
              >
                {isLoading ? "Sending Alert..." : "Send SOS Alert"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="lg"
              className="p-8 h-auto flex flex-col items-center gap-4"
              onClick={() => navigate('/incident-report')}
            >
              <ClipboardList className="w-8 h-8" />
              <div className="text-center">
                <h3 className="font-semibold">Report Incident</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  File a detailed incident report
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="p-8 h-auto flex flex-col items-center gap-4"
              onClick={() => navigate('/safety-map')}
            >
              <MapPin className="w-8 h-8" />
              <div className="text-center">
                <h3 className="font-semibold">Campus Safety Map</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  View nearby security locations
                </p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyPage;
