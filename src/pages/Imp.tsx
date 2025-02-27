import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Image, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

const Imp = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and message for the notification.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a unique ID for the notification
      const notificationId = uuidv4();
      let imageUrl = null;
      
      // Upload image if one is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${notificationId}.${fileExt}`;
        const filePath = `notifications/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('notification-images')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('notification-images')
          .getPublicUrl(filePath);
          
        imageUrl = urlData.publicUrl;
      }
      
      // Store notification in database
      const { error } = await supabase.from('notifications').insert({
        id: notificationId,
        title,
        message,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        is_active: true
      });
      
      if (error) throw error;
      
      toast({
        title: "Notification sent",
        description: "Your notification has been sent to all students.",
      });
      
      // Clear form
      setTitle("");
      setMessage("");
      setImageFile(null);
      setImagePreview(null);
      
      // Navigate back to admin dashboard
      navigate("/admin-dashboard");
      
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Failed to send notification",
        description: "There was an error sending your notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin-dashboard')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Button>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Send Important Notification</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                placeholder="E.g., Emergency Announcement, Campus Update"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Notification Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message to all students..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-32"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Attach Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                  className="flex items-center gap-2"
                >
                  <Image size={18} />
                  {imageFile ? 'Change Image' : 'Add Image'}
                </Button>
                {imageFile && (
                  <span className="text-sm text-gray-500">
                    {imageFile.name}
                  </span>
                )}
              </div>
              
              {imagePreview && (
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-auto max-h-64 object-contain"
                  />
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Notification'}
              {!isLoading && <Send size={18} />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Imp;