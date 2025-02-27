import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Food = () => {
  const navigate = useNavigate();
  const [foodPacket, setFoodPacket] = useState(null);
  const [userTicket, setUserTicket] = useState(null);

  const submitTicket = (reason) => {
    setUserTicket({ reason, status: "pending" });
    toast({
      title: "Success",
      description: "Your ticket has been submitted successfully",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Food & Redistribution</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Food Availability</CardTitle>
            <CardDescription>Check the current food packet count</CardDescription>
          </CardHeader>
          <CardContent>
            {foodPacket ? (
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">Available Food Packets</h3>
                <p className="text-4xl font-bold text-green-600">{foodPacket.food_count}</p>
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No food count has been set for today yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>I Won't Be Eating Today</CardTitle>
            <CardDescription>Help reduce food waste by informing the kitchen staff</CardDescription>
          </CardHeader>
          <CardContent>
            {userTicket ? (
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <CheckCircle2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-blue-800 mb-2">Ticket Submitted</h3>
                <p>
                  You've already submitted a ticket for today stating that you {userTicket.reason === "not_eating" ? "won't be eating." : "are leaving campus."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Label className="mb-2 block">Select your reason:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={() => submitTicket("not_eating")} className="h-auto py-6 flex flex-col items-center space-y-2" variant="outline">
                    <AlertCircle className="h-8 w-8 text-amber-500" />
                    <span>I won't eat from the cafeteria today</span>
                  </Button>
                  <Button onClick={() => submitTicket("leaving_campus")} className="h-auto py-6 flex flex-col items-center space-y-2" variant="outline">
                    <AlertCircle className="h-8 w-8 text-purple-500" />
                    <span>I'm leaving campus today</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Food;
