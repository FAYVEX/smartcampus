
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { AlertTriangle, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const SafetyReports = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('sos_alerts')
          .select(`
            *,
            profiles:user_id (
              full_name,
              phone_number
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAlerts(data || []);
      } catch (error) {
        console.error('Error fetching SOS alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Subscribe to new alerts
    const channel = supabase
      .channel('sos_alerts_channel')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sos_alerts'
        },
        (payload) => {
          console.log('New SOS alert received:', payload);
          setAlerts(currentAlerts => [payload.new, ...currentAlerts]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Safety Reports</h1>
        
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">No safety reports available</p>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id} className="border-red-200 bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {alert.profiles?.full_name || 'Unknown User'}
                      </p>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(alert.created_at), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                    {alert.profiles?.phone_number && (
                      <p className="text-sm text-muted-foreground">
                        Contact: {alert.profiles.phone_number}
                      </p>
                    )}
                    {(alert.location_lat && alert.location_lng) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <a
                          href={`https://www.google.com/maps?q=${alert.location_lat},${alert.location_lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Location on Map
                        </a>
                      </div>
                    )}
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

export default SafetyReports;
