import { useState, useEffect } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    district: "",
    property_type: "",
    price: "",
    price_type: "per_day",
    starting_price: "",
    size_sqft: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [] as string[],
    is_available: true,
    is_featured: false,
    facing: "",
    latitude: "",
    longitude: ""
  });

  const [images, setImages] = useState<string[]>([]);

  const districts = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"
  ];

  const propertyTypes = [
    "Residential Plot", "Commercial Plot", "Agricultural Land", 
    "Villa", "House", "Apartment", "Farmland"
  ];

  const facingOptions = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

  const availableAmenities = [
    "Water Connection", "Electricity", "Road Access", "Security", 
    "Garden", "Parking", "Swimming Pool", "Gym", "Playground", 
    "Community Hall", "Power Backup", "Internet"
  ];

  useEffect(() => {
    if (id && user) {
      fetchProperty();
    }
  }, [id, user]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || "",
        description: data.description || "",
        location: data.location || "",
        district: data.district || "",
        property_type: data.property_type || "",
        price: data.price?.toString() || "",
        price_type: data.price_type || "per_day",
        starting_price: data.starting_price?.toString() || "",
        size_sqft: data.size_sqft?.toString() || "",
        bedrooms: data.bedrooms?.toString() || "",
        bathrooms: data.bathrooms?.toString() || "",
        amenities: data.amenities || [],
        is_available: data.is_available ?? true,
        is_featured: data.is_featured ?? false,
        facing: (data as any).facing || "",
        latitude: data.latitude?.toString() || "",
        longitude: data.longitude?.toString() || ""
      });

      setImages(data.images || []);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: "Error",
        description: "Failed to load property details",
        variant: "destructive"
      });
      navigate('/my-listings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          district: formData.district,
          property_type: formData.property_type,
          price: parseFloat(formData.price),
          price_type: formData.price_type,
          starting_price: formData.starting_price ? parseFloat(formData.starting_price) : null,
          size_sqft: formData.size_sqft ? parseInt(formData.size_sqft) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          amenities: formData.amenities,
          is_available: formData.is_available,
          is_featured: formData.is_featured,
          images: images,
          facing: formData.facing,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Property updated successfully"
      });

      navigate('/my-listings');
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-listings')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Edit Property</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter property title"
                required
              />
            </div>

            <div>
              <Label htmlFor="property_type">Property Type</Label>
              <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your property"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location"
                  required
                />
              </div>

              <div>
                <Label htmlFor="district">District</Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="facing">Facing Direction</Label>
                <Select value={formData.facing} onValueChange={(value) => handleInputChange('facing', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facing" />
                  </SelectTrigger>
                  <SelectContent>
                    {facingOptions.map((facing) => (
                      <SelectItem key={facing} value={facing}>
                        {facing}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="e.g., 13.0827"
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="e.g., 80.2707"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price_type">Price Type</Label>
                <Select value={formData.price_type} onValueChange={(value) => handleInputChange('price_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per_day">Per Day</SelectItem>
                    <SelectItem value="total">Total Price</SelectItem>
                    <SelectItem value="per_month">Per Month</SelectItem>
                    <SelectItem value="per_year">Per Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="starting_price">Starting Price</Label>
              <Input
                id="starting_price"
                type="number"
                value={formData.starting_price}
                onChange={(e) => handleInputChange('starting_price', e.target.value)}
                placeholder="Enter starting price"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="size_sqft">Size (Sqft)</Label>
                <Input
                  id="size_sqft"
                  type="number"
                  value={formData.size_sqft}
                  onChange={(e) => handleInputChange('size_sqft', e.target.value)}
                  placeholder="Square feet"
                />
              </div>

              {/* Show bedrooms/bathrooms only for residential properties */}
              {(formData.property_type === "House" || formData.property_type === "Apartment" || formData.property_type === "Villa") && (
                <>
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      placeholder="Number of bedrooms"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      placeholder="Number of bathrooms"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_available"
                checked={formData.is_available}
                onCheckedChange={(checked) => handleInputChange('is_available', checked)}
              />
              <Label htmlFor="is_available">Property is available</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
              />
              <Label htmlFor="is_featured">Feature this property</Label>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <Label htmlFor={amenity} className="text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/my-listings')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-accent hover:bg-accent/90"
          >
            {submitting ? "Updating..." : "Update Property"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPropertyPage;