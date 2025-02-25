
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { SOSDialog } from "@/components/safety/SOSDialog";
import { SafetyNavButtons } from "@/components/safety/SafetyNavButtons";

type Coordinates = {
  latitude: number;
  longitude: number;
} | null;

const SafetyPage = () => {
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState<Coordinates>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

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
                Press the button below to send an immediate SOS alert
              </p>
              <Button
                variant="destructive"
                size="lg"
                className="w-full text-lg py-6"
                onClick={() => setShowDialog(true)}
                disabled={isLoading}
              >
                {isLoading ? "Sending Alert..." : "Send SOS Alert"}
              </Button>
            </div>
          </div>

          <SOSDialog 
            showDialog={showDialog}
            setShowDialog={setShowDialog}
            coordinates={coordinates}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />

          <SafetyNavButtons onNavigate={navigate} />
        </div>
      </div>
    </div>
  );
};

export default SafetyPage;
