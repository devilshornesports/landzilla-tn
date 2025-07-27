import { MapPin, IndianRupee, Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  id: string;
  title: string;
  district: string;
  block: string;
  plotNo: string;
  price: number;
  area: string;
  image: string;
  status: "Available" | "Booked" | "Sold";
  type: string;
  onClick?: () => void;
}

const PropertyCard = ({
  id,
  title,
  district,
  block,
  plotNo,
  price,
  area,
  image,
  status,
  type,
  onClick,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkSavedStatus();
    }
  }, [user, id]);

  const checkSavedStatus = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', id)
        .maybeSingle();
      
      setIsSaved(!!data);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveProperty = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save properties",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        // Remove from saved
        await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', id);
        
        setIsSaved(false);
        toast({
          title: "Removed from Wishlist",
          description: "Property removed from your saved items"
        });
      } else {
        // Add to saved
        await supabase
          .from('saved_properties')
          .insert({
            user_id: user.id,
            property_id: id
          });
        
        setIsSaved(true);
        toast({
          title: "Added to Wishlist",
          description: "Property saved to your wishlist"
        });
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-success text-white";
      case "Booked":
        return "bg-warning text-white";
      case "Sold":
        return "bg-destructive text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/property/${id}`);
    }
  };

  return (
    <div className="property-card" onClick={handleCardClick}>
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <Badge
          className={cn(
            "absolute top-3 right-3 text-xs font-medium",
            getStatusColor(status)
          )}
        >
          {status}
        </Badge>
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-3 left-3 h-8 w-8 p-0 bg-white/90 hover:bg-white"
          onClick={handleSaveProperty}
          disabled={loading}
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{district}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">Block {block} • Plot {plotNo}</div>
            <div className="text-muted-foreground">{area} • {type}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <IndianRupee className="h-5 w-5 text-accent" />
            <span className="text-xl font-bold text-accent">
              {price.toLocaleString('en-IN')}
            </span>
          </div>
          <Button 
            size="sm" 
            className="bg-accent hover:bg-accent/90 text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/property/${id}`);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;