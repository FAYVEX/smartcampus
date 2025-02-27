import { useState, useEffect } from "react";
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
  title: string;
  description: string;
  status: "has_vehicle" | "needs_vehicle";
  location: string | null;
  date: string;
  time: string;
  created_at: string;
  user_id: string;
  buddy_status: "active" | "matched" | "completed" | null;
}

const TravelBuddy = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<"has_vehicle" | "needs_vehicle">("has_vehicle");

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
          description: "You must be logged in to post a travel buddy request",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("travel_buddies").insert({
        title,
        description,
        location,
        status,
        date,
        time,
        user_id: session.user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Travel buddy request posted successfully",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setTime("");
    } catch (error) {
      console.error("Error submitting travel buddy request:", error);
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Travel Buddy</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Travel Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="status">Travel Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "has_vehicle" | "needs_vehicle")}
                  className="w-full p-2 border rounded"
                >
                  <option value="has_vehicle">I Have a Vehicle</option>
                  <option value="needs_vehicle">I Need a Vehicle</option>
                </select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  placeholder="e.g., Trip to Mall, Going to Airport"
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  placeholder="Add details about your trip, number of seats available, etc."
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded min-h-[100px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Start/Destination</Label>
                <Input
                  id="location"
                  value={location}
                  placeholder="e.g., Campus to Downtown"
                  onChange={(e) => setLocation(e.target.value)}
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
                <Upload className="mr-2" />
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Recent Travel Buddies</h2>
          {isLoading ? (
            <p>Loading travel requests...</p>
          ) : buddies?.length === 0 ? (
            <p>No travel buddy requests found.</p>
          ) : (
            buddies?.map((buddy) => (
              <Card key={buddy.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{buddy.title}</h3>
                      <p className="text-sm text-gray-600">{buddy.description}</p>
                      {buddy.location && (
                        <p className="text-sm text-gray-500">
                          Route: {buddy.location}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Date: {buddy.date} at {buddy.time}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          buddy.status === "needs_vehicle" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {buddy.status === "has_vehicle" ? "HAS VEHICLE" : "NEEDS VEHICLE"}
                        </span>
                        {buddy.buddy_status && (
                          <span className={`ml-2 inline-block px-2 py-1 text-xs rounded ${
                            buddy.buddy_status === "matched" 
                              ? "bg-green-100 text-green-800" 
                              : buddy.buddy_status === "completed"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                          }`}>
                            {buddy.buddy_status.toUpperCase()}
                          </span>
                        )}
                      </div>
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