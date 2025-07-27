import { useState } from "react";
import { Camera, MapPin, Upload, Save, Plus, Trash2, IndianRupee, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const PostPropertyPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    district: "",
    location: "",
    facing: "",
    propertyType: "",
    ownerName: "",
    ownerPhone: "",
    amenities: [] as string[],
  });

  const [blocks, setBlocks] = useState([
    {
      id: 1,
      blockId: "A",
      blockName: "Block A",
      totalPlots: 50,
      area: "",
      areaUnit: "sqft",
      pricePerSqft: "",
      totalPrice: ""
    }
  ]);

  const districts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", 
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", 
    "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", 
    "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", 
    "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur", 
    "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ];

  const areaUnits = [
    { value: "sqft", label: "Square Feet" },
    { value: "cent", label: "Cent" },
    { value: "ground", label: "Ground" },
    { value: "acre", label: "Acre" },
    { value: "hectare", label: "Hectare" }
  ];

  const propertyTypes = [
    "Residential Plot", "Commercial Plot", "Agricultural Land", 
    "Villa", "House", "Apartment", "Farmland"
  ];

  const facingOptions = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

  const amenitiesList = [
    "Water Connection", "Electricity", "Road Access", "Compound Wall",
    "Security", "Garden", "Parking", "Well", "Bore Well", "Trees",
    "Swimming Pool", "Gym", "Club House", "Children's Play Area",
    "CCTV Surveillance", "Intercom", "Lift", "Power Backup",
    "Waste Management", "Rainwater Harvesting", "Solar Panels",
    "Jogging Track", "Basketball Court", "Tennis Court", "Badminton Court"
  ];

  const [customAmenity, setCustomAmenity] = useState("");

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addBlock = () => {
    const newBlockId = String.fromCharCode(65 + blocks.length); // A, B, C, etc.
    setBlocks(prev => [...prev, {
      id: Date.now(),
      blockId: newBlockId,
      blockName: `Block ${newBlockId}`,
      totalPlots: 50,
      area: "",
      areaUnit: "sqft",
      pricePerSqft: "",
      totalPrice: ""
    }]);
  };

  const removeBlock = (blockId: number) => {
    if (blocks.length > 1) {
      setBlocks(prev => prev.filter(block => block.id !== blockId));
    }
  };

  const updateBlock = (blockId: number, field: string, value: string | number) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, [field]: value }
        : block
    ));
  };

  const generatePropertyId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PROP-TN-${year}${month}${day}${random}`;
  };

  const handleImageUpload = async (files: FileList) => {
    if (!user) return;
    
    setUploading(true);
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

      setUploadedImages(prev => [...prev, ...imageUrls]);
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
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleConfirmPost = async () => {
    if (!user) return;

    try {
      // Calculate average price from blocks
      const totalPrice = blocks.reduce((sum, block) => {
        const price = parseFloat(block.pricePerSqft) * parseFloat(block.area);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
      const avgPrice = totalPrice / blocks.length;

      const propertyData = {
        title: formData.title,
        description: formData.description,
        district: formData.district,
        location: formData.location,
        price: avgPrice,
        images: uploadedImages,
        amenities: formData.amenities,
        owner_id: user.id,
        is_available: true,
        category_id: null, // You can add category selection later
        price_type: 'total'
      };

      const { error } = await supabase
        .from('properties')
        .insert(propertyData);

      if (error) throw error;

      toast({
        title: "Property Posted Successfully! 🎉",
        description: "Your property is now live and visible to everyone.",
      });

      setShowPreview(false);
      // Reset form
      setFormData({
        title: "",
        description: "",
        district: "",
        location: "",
        facing: "",
        propertyType: "",
        ownerName: "",
        ownerPhone: "",
        amenities: [],
      });
      setBlocks([{
        id: 1,
        blockId: "A",
        blockName: "Block A",
        totalPlots: 50,
        area: "",
        areaUnit: "sqft",
        pricePerSqft: "",
        totalPrice: ""
      }]);
      setUploadedImages([]);
      
    } catch (error) {
      console.error('Error posting property:', error);
      toast({
        title: "Failed to post property",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground">Post Your Property</h1>
        <p className="text-muted-foreground">Fill in the details to list your property</p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Premium Residential Plot in Anna Nagar"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Photo Upload - First in Basic Information */}
            <div>
              <Label>Property Photos *</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
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
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Choose Photos"}
                </Button>
                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {uploadedImages.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Property ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your property, its features, and nearby landmarks..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="district">District *</Label>
              <Select
                value={formData.district}
                onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Full Address *</Label>
              <Input
                id="location"
                placeholder="e.g., Anna Nagar West, Chennai"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="facing">Facing Direction</Label>
              <Select
                value={formData.facing}
                onValueChange={(value) => setFormData(prev => ({ ...prev, facing: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select facing direction" />
                </SelectTrigger>
                <SelectContent>
                  {facingOptions.map((facing) => (
                    <SelectItem key={facing} value={facing}>{facing}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full">
              <MapPin className="h-4 w-4 mr-2" />
              Set Location on Map
            </Button>
          </CardContent>
        </Card>

        {/* Blocks Configuration */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Blocks & Pricing</CardTitle>
              <Button onClick={addBlock} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Block
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {blocks.map((block, index) => (
              <div key={block.id} className="border border-border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-foreground">Block {block.blockId}</h3>
                  {blocks.length > 1 && (
                    <Button 
                      onClick={() => removeBlock(block.id)} 
                      size="sm" 
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Block Name</Label>
                    <Input
                      placeholder={`Block ${block.blockId}`}
                      value={block.blockName}
                      onChange={(e) => updateBlock(block.id, 'blockName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Total Plots</Label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={block.totalPlots}
                      onChange={(e) => updateBlock(block.id, 'totalPlots', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Area per Plot</Label>
                    <Input
                      type="number"
                      placeholder="1200"
                      value={block.area}
                      onChange={(e) => updateBlock(block.id, 'area', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select
                      value={block.areaUnit}
                      onValueChange={(value) => updateBlock(block.id, 'areaUnit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {areaUnits.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price per {block.areaUnit} (₹)</Label>
                    <Input
                      type="number"
                      placeholder="2500"
                      value={block.pricePerSqft}
                      onChange={(e) => updateBlock(block.id, 'pricePerSqft', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Total Price per Plot (₹)</Label>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-accent" />
                      <span className="text-lg font-semibold text-accent">
                        {block.area && block.pricePerSqft 
                          ? (parseInt(block.area) * parseInt(block.pricePerSqft)).toLocaleString('en-IN')
                          : "0"
                        }
                      </span>
                    </div>
                  </div>
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom amenity..."
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && customAmenity.trim()) {
                      handleAmenityChange(customAmenity.trim(), true);
                      setCustomAmenity("");
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (customAmenity.trim()) {
                      handleAmenityChange(customAmenity.trim(), true);
                      setCustomAmenity("");
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Owner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ownerName">Owner Name *</Label>
              <Input
                id="ownerName"
                placeholder="Full name"
                value={formData.ownerName}
                onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="ownerPhone">Phone Number *</Label>
              <Input
                id="ownerPhone"
                placeholder="+91 98765 43210"
                value={formData.ownerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, ownerPhone: e.target.value }))}
                required
              />
            </div>
          </CardContent>
        </Card>


        {/* Submit Button */}
        <Button type="submit" className="w-full h-12 text-lg bg-accent hover:bg-accent/90">
          <Eye className="h-5 w-5 mr-2" />
          Preview Property
        </Button>

        {/* Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Property Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.slice(0, 4).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold">{formData.title}</h3>
                <p className="text-muted-foreground">{formData.district}, {formData.location}</p>
              </div>
              <p className="text-sm">{formData.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Property Type:</p>
                  <p>{formData.propertyType}</p>
                </div>
                <div>
                  <p className="font-semibold">Facing:</p>
                  <p>{formData.facing}</p>
                </div>
              </div>
              {formData.amenities.length > 0 && (
                <div>
                  <p className="font-semibold">Amenities:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.amenities.map((amenity) => (
                      <span key={amenity} className="bg-secondary px-2 py-1 rounded text-xs">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleConfirmPost} className="flex-1">
                  Confirm & Post Property
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Edit More
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
};

export default PostPropertyPage;