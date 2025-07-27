import { useState } from "react";
import { ArrowLeft, Heart, Share2, MapPin, User, Phone, Calendar, IndianRupee, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import BlockBookingModal from "@/components/BlockBookingModal";
import ImageCarousel from "@/components/ImageCarousel";
import heroImage from "@/assets/hero-property.jpg";
import sampleHouse from "@/assets/sample-house.jpg";
import sampleFarmland from "@/assets/sample-farmland.jpg";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Mock property data - in real app, fetch based on id
  const property = {
    id: "PROP-TN-20250727001",
    title: "Premium Residential Plot in Anna Nagar",
    district: "Chennai",
    location: "Anna Nagar West, Chennai",
    description: "Beautiful residential plot in prime location with all amenities. Perfect for building your dream home. Well-connected to schools, hospitals, and shopping centers.",
    images: [heroImage, sampleHouse, sampleFarmland, heroImage, sampleHouse],
    owner: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      verified: true
    },
    propertyType: "Residential Plot",
    facing: "East",
    amenities: ["Water Connection", "Electricity", "Road Access", "Security", "Garden", "Parking"],
    blocks: [
      {
        blockId: "A",
        blockName: "Block A - Premium",
        totalPlots: 50,
        availablePlots: 25,
        area: "1200 sqft",
        pricePerSqft: 2500,
        totalPrice: 3000000,
        status: "Available",
        plots: Array.from({ length: 50 }, (_, i) => ({
          plotNo: i + 1,
          status: i < 25 ? "Available" : "Booked",
          bookedBy: i >= 25 ? `Buyer ${i - 24}` : null
        }))
      },
      {
        blockId: "B",
        blockName: "Block B - Standard",
        totalPlots: 40,
        availablePlots: 30,
        area: "1000 sqft",
        pricePerSqft: 2200,
        totalPrice: 2200000,
        status: "Available",
        plots: Array.from({ length: 40 }, (_, i) => ({
          plotNo: i + 1,
          status: i < 30 ? "Available" : "Booked",
          bookedBy: i >= 30 ? `Buyer ${i - 29}` : null
        }))
      },
      {
        blockId: "C",
        blockName: "Block C - Economy",
        totalPlots: 60,
        availablePlots: 45,
        area: "800 sqft",
        pricePerSqft: 1800,
        totalPrice: 1440000,
        status: "Available",
        plots: Array.from({ length: 60 }, (_, i) => ({
          plotNo: i + 1,
          status: i < 45 ? "Available" : "Booked",
          bookedBy: i >= 45 ? `Buyer ${i - 44}` : null
        }))
      }
    ]
  };

  const handleBooking = () => {
    setIsBookingModalOpen(true);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from Wishlist" : "Added to Wishlist",
      description: isSaved ? "Property removed from your saved items" : "Property saved to your wishlist",
    });
  };

  const handleShare = () => {
    navigator.share({
      title: property.title,
      text: `Check out this property: ${property.title}`,
      url: window.location.href,
    });
  };

  const handleMessage = () => {
    navigate(`/messages?propertyId=${property.id}&sellerId=${property.owner.name}`);
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
      <ImageCarousel images={property.images} />

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
            <Badge variant="secondary">{property.propertyType}</Badge>
            <Badge variant="outline">{property.facing} Facing</Badge>
          </div>
          <p className="text-muted-foreground leading-relaxed">{property.description}</p>
        </div>

        {/* Blocks Available */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Blocks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {property.blocks.map((block) => (
              <div key={block.blockId} className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{block.blockName}</h3>
                    <p className="text-sm text-muted-foreground">{block.area} per plot</p>
                  </div>
                  <Badge variant={block.availablePlots > 0 ? "default" : "secondary"}>
                    {block.availablePlots} / {block.totalPlots} Available
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4 text-accent" />
                      <span className="text-lg font-bold text-accent">
                        {block.totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ₹{block.pricePerSqft.toLocaleString('en-IN')}/sqft
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    disabled={block.availablePlots === 0}
                    onClick={handleBooking}
                    className="bg-accent hover:bg-accent/90"
                  >
                    {block.availablePlots === 0 ? 'Sold Out' : 'Book Now'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-foreground">{amenity}</span>
                </div>
              ))}
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
      </div>

      <BlockBookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        property={property}
      />
    </div>
  );
};

export default PropertyDetailsPage;