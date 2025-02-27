import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  image_url: string | null;
  created_at: string;
}

export const NotificationAlert = () => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchLatestNotification = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      if (data && data.length > 0) {
        // Check if we've already dismissed this notification
        const dismissedNotifications = localStorage.getItem('dismissedNotifications');
        const dismissedIds = dismissedNotifications ? JSON.parse(dismissedNotifications) : [];
        
        if (!dismissedIds.includes(data[0].id)) {
          setNotification(data[0]);
          setIsVisible(true);
        }
      }
    };

    fetchLatestNotification();

    // Set up real-time subscription for new notifications
    const subscription = supabase
    .channel('public:notifications')
    .on(
      'INSERT', 
      { event: 'INSERT', schema: 'public', table: 'notifications' }, // Second argument: filter
      (payload) => {
        setNotification(payload.new);
        setIsVisible(true);
      }
    )
    .subscribe();
  

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const dismissNotification = () => {
    if (notification) {
      // Store dismissed notification ID in local storage
      const dismissedNotifications = localStorage.getItem('dismissedNotifications');
      const dismissedIds = dismissedNotifications ? JSON.parse(dismissedNotifications) : [];
      
      if (!dismissedIds.includes(notification.id)) {
        dismissedIds.push(notification.id);
        localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedIds));
      }
    }
    
    setIsVisible(false);
  };

  if (!isVisible || !notification) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full animate-fade-in-up">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
            {notification.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={dismissNotification}
            className="h-8 w-8"
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
            {notification.message}
          </p>
          
          {notification.image_url && (
            <div className="mb-4 border rounded-lg overflow-hidden">
              <img
                src={notification.image_url}
                alt="Notification image"
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="text-right">
            <Button onClick={dismissNotification}>
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};