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
    bedrooms: "",
    bathrooms: "",
    amenities: [] as string[],
    facing: "",
  });

  const [images, setImages] = useState<string[]>([]);

  const districts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", 
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", 
    "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", 
    "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", 
    "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur", 
    "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ];

  const propertyTypes = [
    "Residential Plot", "Commercial Plot", "Agricultural Land", 
    "Villa", "House", "Apartment", "Farmland"
  ];

  const facingOptions = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

  const availableAmenities = [
    "Water Connection", "Electricity", "Road Access", "Compound Wall",
    "Security", "Garden", "Parking", "Well", "Bore Well", "Trees",
    "Swimming Pool", "Gym", "Club House", "Children's Play Area",
    "CCTV Surveillance", "Intercom", "Lift", "Power Backup",
    "Waste Management", "Rainwater Harvesting", "Solar Panels",
    "Jogging Track", "Basketball Court", "Tennis Court", "Badminton Court"
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
        bedrooms: data.bedrooms?.toString() || "",
        bathrooms: data.bathrooms?.toString() || "",
        amenities: data.amenities || [],
        facing: (data as any).facing || "",
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

  const handleImageUpload = async (files: FileList) => {
    if (!user) return;
    
    if (images.length + files.length > 15) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 15 images",
        variant: "destructive"
      });
      return;
    }
    
    const imageUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        imageUrls.push(data.publicUrl);
      }

      setImages(prev => [...prev, ...imageUrls]);
      toast({
        title: "Images uploaded successfully!",
        description: `${imageUrls.length} image(s) uploaded.`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    }
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
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          amenities: formData.amenities,
          images: images,
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
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Premium Residential Plot in Anna Nagar"
                required
              />
            </div>

            <div>
              <Label htmlFor="property_type">Property Type *</Label>
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

            {/* Conditional fields for residential properties */}
            {(formData.property_type === "House" || formData.property_type === "Apartment" || formData.property_type === "Villa") && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    placeholder="Number of bedrooms"
                    value={formData.bedrooms || ""}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    placeholder="Number of bathrooms"
                    value={formData.bathrooms || ""}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Photo Upload */}
            <div>
              <Label>Property Photos *</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload up to 15 photos</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Photos
                </Button>
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {images.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Property ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your property, its features, and nearby landmarks..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="district">District *</Label>
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
              <Label htmlFor="location">Full Address *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Anna Nagar West, Chennai"
                required
              />
            </div>

            <div>
              <Label htmlFor="facing">Facing Direction</Label>
              <Select value={formData.facing} onValueChange={(value) => handleInputChange('facing', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facing direction" />
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

            {/* Amenities */}
            <div>
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
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