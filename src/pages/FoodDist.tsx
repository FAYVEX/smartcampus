import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FoodWasteManagement() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const bookMeal = async () => {
    setLoading(true);
    // Mock API call simulation
    setTimeout(() => {
      setTickets([...tickets, { id: tickets.length + 1, status: "Booked" }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Food Waste & Redistribution</h1>
      <Button onClick={bookMeal} disabled={loading}>
        {loading ? "Booking..." : "Book a Meal Ticket"}
      </Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent className="p-4 text-center">
              <p>Meal Ticket #{ticket.id}</p>
              <p>Status: {ticket.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
