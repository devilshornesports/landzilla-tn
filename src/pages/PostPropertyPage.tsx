import { useState } from "react";
import { Camera, MapPin, Upload, Save, Plus, Trash2, IndianRupee } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const propertyId = generatePropertyId();
    
    toast({
      title: "Property Posted Successfully! 🎉",
      description: `Your property ID is ${propertyId}. It will be reviewed and published soon.`,
    });
    
    console.log("Property submitted:", { ...formData, blocks, propertyId });
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