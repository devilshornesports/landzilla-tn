import { useState } from "react";
import { X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const FilterModal = ({ isOpen, onClose, onApplyFilters }: FilterModalProps) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 10000000],
    propertyType: "",
    district: "",
    block: "",
    area: "",
    facing: "",
    amenities: [] as string[]
  });

  const districts = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"
  ];

  const propertyTypes = ["Residential", "Commercial", "Agricultural", "Villa", "Apartment"];
  const facingOptions = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
  const amenitiesList = ["Water Connection", "Electricity", "Road Access", "Drainage", "Park Nearby", "School Nearby"];

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleApplyFilters = () => {
    // Validate price range
    if (filters.priceRange[0] > filters.priceRange[1]) {
      const temp = filters.priceRange[0];
      setFilters(prev => ({
        ...prev,
        priceRange: [filters.priceRange[1], temp]
      }));
    }
    
    onApplyFilters(filters);
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000000],
      propertyType: "",
      district: "",
      block: "",
      area: "",
      facing: "",
      amenities: []
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Properties
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Price Range</Label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                max={10000000}
                min={0}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>₹{(filters.priceRange[0] / 100000).toFixed(0)}L</span>
                <span>₹{(filters.priceRange[1] / 100000).toFixed(0)}L</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Property Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Property Type</Label>
            <Select value={filters.propertyType} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
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

          <Separator />

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Location</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">District</Label>
                <Select value={filters.district} onValueChange={(value) => setFilters(prev => ({ ...prev, district: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="District" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Block</Label>
                <Input
                  placeholder="Block (A, B, C...)"
                  value={filters.block}
                  onChange={(e) => setFilters(prev => ({ ...prev, block: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Area & Facing */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Area</Label>
                <Input
                  placeholder="Min area (sqft)"
                  value={filters.area}
                  onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm">Facing</Label>
                <Select value={filters.facing} onValueChange={(value) => setFilters(prev => ({ ...prev, facing: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Facing" />
                  </SelectTrigger>
                  <SelectContent>
                    {facingOptions.map((facing) => (
                      <SelectItem key={facing} value={facing}>{facing}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Amenities */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Amenities</Label>
            <div className="grid grid-cols-2 gap-3">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  />
                  <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button 
            onClick={handleApplyFilters}
            className="flex-1 bg-accent hover:bg-accent/90"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterModal;