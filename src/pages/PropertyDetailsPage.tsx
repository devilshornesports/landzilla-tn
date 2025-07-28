import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Share2, MapPin, User, Phone, Calendar, IndianRupee, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import BlockBookingModal from "@/components/BlockBookingModal";
import BlockDetails from "@/components/BlockDetails";
import ImageCarousel from "@/components/ImageCarousel";

// Default images from Pexels
const DEFAULT_PROPERTY_IMAGES = [
  "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800"
];

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProperty();
      recordPropertyView();
      if (user) {
        checkSavedStatus();
      }
    }
  }, [id, user]);

  useEffect(() => {
    if (!property?.id) return;

    // Set up real-time subscription for view count updates
    const channel = supabase
      .channel('property-views')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'property_views',
          filter: `property_id=eq.${property.id}`
        },
        () => {
          // Refetch property to get updated view count
          fetchProperty();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [property?.id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        // Fetch owner profile separately
        const { data: ownerData } = await supabase
          .from('profiles')
          .select('full_name, phone, is_verified')
          .eq('user_id', data.owner_id)
          .single();

        setProperty({
          ...data,
          owner: {
            name: ownerData?.full_name || 'Property Owner',
            phone: ownerData?.phone || 'N/A',
            verified: ownerData?.is_verified || false
          }
        });
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: "Error",
        description: "Failed to load property details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const recordPropertyView = async () => {
    try {
      await supabase
        .from('property_views')
        .insert({
          property_id: id,
          user_id: user?.id || null,
          ip_address: null,
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const checkSavedStatus = async () => {
    if (!user || !id) return;
    
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

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book properties",
        variant: "destructive"
      });
      return;
    }
    setIsBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
          <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/explore')}>
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save properties",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', id);
        
        if (error) throw error;
        
        setIsSaved(false);
        toast({
          title: "Removed from Wishlist",
          description: "Property removed from your saved items"
        });
      } else {
        const { error } = await supabase
          .from('saved_properties')
          .insert({
            user_id: user.id,
            property_id: id
          });
        
        if (error) throw error;
        
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
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this property: ${property?.title}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied!",
          description: "Property link copied to clipboard"
        });
      } catch (error) {
        toast({
          title: "Share Link",
          description: shareUrl,
        });
      }
    }
  };

  const handleMessage = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to message property owners",
        variant: "destructive"
      });
      return;
    }
    navigate(`/messages?propertyId=${property?.id}&sellerId=${property?.owner_id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Carousel */}
      <ImageCarousel images={property.images && property.images.length > 0 ? property.images : DEFAULT_PROPERTY_IMAGES} />

      {/* Property Info */}
      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{property.title}</h1>
          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
          <div className="flex gap-2 mb-4">
            <Badge variant="secondary">Property</Badge>
            <Badge variant="outline">Premium Location</Badge>
          </div>
          <p className="text-muted-foreground leading-relaxed">{property.description}</p>
        </div>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Size:</span>
                <span className="ml-2 font-medium">{property.size_sqft ? `${property.size_sqft} sqft` : 'Not specified'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 font-medium">Property</span>
              </div>
              <div>
                <span className="text-muted-foreground">Bedrooms:</span>
                <span className="ml-2 font-medium">{property.bedrooms || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Bathrooms:</span>
                <span className="ml-2 font-medium">{property.bathrooms || 'N/A'}</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-5 w-5 text-accent" />
                    <span className="text-lg text-muted-foreground">Starting from </span>
                    <span className="text-2xl font-bold text-accent">
                      {property.starting_price?.toLocaleString('en-IN') || property.price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    per plot
                  </p>
                </div>
                <Button 
                  onClick={handleBooking}
                  className="bg-accent hover:bg-accent/90"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">{amenity}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground col-span-2">No amenities listed</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Owner Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Owner Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{property.owner.name}</h3>
                  {property.owner.verified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Verified Seller</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleMessage}>
                <Phone className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button onClick={handleBooking} className="bg-accent hover:bg-accent/90">
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Block Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockDetails property={property} />
          </CardContent>
        </Card>
      </div>

      {property && (
        <BlockBookingModal 
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          property={property}
        />
      )}
    </div>
  );
};

export default PropertyDetailsPage;