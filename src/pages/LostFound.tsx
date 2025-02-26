
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

interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  status: "lost" | "found";
  location: string | null;
  created_at: string;
  user_id: string;
  item_status: "active" | "claimed" | "resolved" | null;
}

const LostFound = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"lost" | "found">("lost");
  const [image, setImage] = useState<File | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ["lost-found-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lost_found_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load items",
          variant: "destructive",
        });
        throw error;
      }

      return data as LostFoundItem[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to report items",
          variant: "destructive",
        });
        return;
      }

      let imageUrl = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("lost-found-images")
          .upload(filePath, image);

        if (uploadError) {
          toast({
            title: "Error",
            description: "Failed to upload image",
            variant: "destructive",
          });
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("lost-found-images")
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("lost_found_items").insert({
        title,
        description,
        location,
        status,
        image_url: imageUrl,
        user_id: session.user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item reported successfully",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setImage(null);
    } catch (error) {
      console.error("Error submitting item:", error);
      toast({
        title: "Error",
        description: "Failed to submit item",
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
        <h1 className="text-3xl font-bold">Lost & Found</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report an Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "lost" | "found")}
                  className="w-full p-2 border rounded"
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded min-h-[100px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </div>

              <Button type="submit" className="w-full">
                <Upload className="mr-2" />
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Recent Items</h2>
          {isLoading ? (
            <p>Loading items...</p>
          ) : items?.length === 0 ? (
            <p>No items reported yet.</p>
          ) : (
            items?.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      {item.location && (
                        <p className="text-sm text-gray-500">
                          Location: {item.location}
                        </p>
                      )}
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          item.status === "lost" 
                            ? "bg-red-100 text-red-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded"
                      />
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

export default LostFound;
