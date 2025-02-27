import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

interface TravelBuddy {
  id: string;
  name: string;
  contact: string;
  date: string;
  time: string;
  vehicle_status: "has_vehicle" | "needs_vehicle";
  created_at: string;
  user_id: string;
}

const TravelBuddy = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState<"has_vehicle" | "needs_vehicle">("has_vehicle");

  const { data: buddies, isLoading } = useQuery({
    queryKey: ["travel-buddies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("travel_buddies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load travel buddies",
          variant: "destructive",
        });
        throw error;
      }

      return data as TravelBuddy[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to post",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("travel_buddies").insert({
        name,
        contact,
        date,
        time,
        vehicle_status: vehicleStatus,
        user_id: session.user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Travel Buddy added successfully",
      });

      // Reset form
      setName("");
      setContact("");
      setDate("");
      setTime("");
    } catch (error) {
      console.error("Error submitting travel buddy:", error);
      toast({
        title: "Error",
        description: "Failed to submit",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2" /> Back
      </Button>
      <h1 className="text-3xl font-bold">Travel Buddy</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Travel Buddy Info</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="vehicle-status">Vehicle Status</Label>
                <select
                  id="vehicle-status"
                  value={vehicleStatus}
                  onChange={(e) => setVehicleStatus(e.target.value as "has_vehicle" | "needs_vehicle")}
                  className="w-full p-2 border rounded"
                >
                  <option value="has_vehicle">I Have a Vehicle</option>
                  <option value="needs_vehicle">I Need a Vehicle</option>
                </select>
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Upload className="mr-2" /> Submit
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Recent Travel Buddies</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : buddies?.length === 0 ? (
            <p>No travel buddies found.</p>
          ) : (
            buddies?.map((buddy) => (
              <Card key={buddy.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{buddy.name}</h3>
                      <p>Contact: {buddy.contact}</p>
                      <p>Date: {buddy.date}</p>
                      <p>Time: {buddy.time}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        buddy.vehicle_status === "has_vehicle" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {buddy.vehicle_status === "has_vehicle" ? "Has Vehicle" : "Needs Vehicle"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelBuddy;