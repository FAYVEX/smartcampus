
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SOSDialogProps = {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  coordinates: { latitude: number; longitude: number } | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

export function SOSDialog({ 
  showDialog, 
  setShowDialog, 
  coordinates, 
  isLoading,
  setIsLoading 
}: SOSDialogProps) {
  const [recipientEmail, setRecipientEmail] = useState("");

  const validateEmail = (email: string) => {
    return email.toLowerCase().endsWith('@gmail.com');
  };

  const handleSOSAlert = async (recipientEmail: string) => {
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

      const { error } = await supabase
        .from('sos_alerts')
        .insert({
          user_id: session.user.id,
          location_lat: coordinates?.latitude,
          location_lng: coordinates?.longitude,
        });

      if (error) throw error;

      const { error: emailError } = await supabase.functions.invoke('send-sos-alert', {
        body: {
          location_lat: coordinates?.latitude,
          location_lng: coordinates?.longitude,
          user_email: session.user.email,
          user_name: profileData?.full_name || 'Unknown User',
          recipient_email: recipientEmail
        },
      });

      if (emailError) throw emailError;

      toast({
        title: "SOS Alert Sent",
        description: "Emergency help request has been sent to " + recipientEmail,
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
      setShowDialog(false);
      setRecipientEmail("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(recipientEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid Gmail address",
        variant: "destructive",
      });
      return;
    }
    handleSOSAlert(recipientEmail);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send SOS Alert</DialogTitle>
          <DialogDescription>
            Enter the Gmail address where you want to receive emergency assistance.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Gmail Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Gmail address"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              Send Alert
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
