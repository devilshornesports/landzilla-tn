import { useState } from "react";
import { Camera, MapPin, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const PostPropertyPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    district: "",
    block: "",
    plotNo: "",
    area: "",
    areaUnit: "sqft",
    price: "",
    facing: "",
    propertyType: "",
    ownerName: "",
    ownerPhone: "",
    amenities: [] as string[],
  });

  const districts = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"
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
    "Security", "Garden", "Parking", "Well", "Bore Well", "Trees"
  ];

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const generatePropertyId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PROP-TN-${year}${month}${day}${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const propertyId = generatePropertyId();
    
    toast({
      title: "Property Posted Successfully! 🎉",
      description: `Your property ID is ${propertyId}. It will be reviewed and published soon.`,
    });
    
    console.log("Property submitted:", { ...formData, propertyId });
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="block">Block *</Label>
                <Input
                  id="block"
                  placeholder="e.g., A, B, C"
                  value={formData.block}
                  onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="plotNo">Plot Number *</Label>
                <Input
                  id="plotNo"
                  placeholder="e.g., 45, 123"
                  value={formData.plotNo}
                  onChange={(e) => setFormData(prev => ({ ...prev, plotNo: e.target.value }))}
                  required
                />
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <MapPin className="h-4 w-4 mr-2" />
              Set Location on Map
            </Button>
          </CardContent>
        </Card>

        {/* Area & Price */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Area & Price</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">Area *</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="1200"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="areaUnit">Unit *</Label>
                <Select
                  value={formData.areaUnit}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, areaUnit: value }))}
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

            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="2500000"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
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
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Amenities</CardTitle>
          </CardHeader>
          <CardContent>
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

        {/* Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Property Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Upload up to 15 photos</p>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Choose Photos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button type="submit" className="w-full h-12 text-lg bg-accent hover:bg-accent/90">
          <Save className="h-5 w-5 mr-2" />
          📤 Post My Property
        </Button>
      </form>
    </div>
  );
};

export default PostPropertyPage;