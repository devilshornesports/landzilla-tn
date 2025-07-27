import { useState } from "react";
import { Filter, Map, Grid3X3, Search, SlidersHorizontal, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import PropertyCard from "@/components/PropertyCard";
import FilterModal from "@/components/FilterModal";
import heroImage from "@/assets/hero-property.jpg";
import sampleHouse from "@/assets/sample-house.jpg";
import sampleFarmland from "@/assets/sample-farmland.jpg";

const ExplorePage = () => {
  const [viewType, setViewType] = useState<"grid" | "map">("grid");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const districts = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul",
    "Thanjavur", "Kanchipuram", "Tiruvannamalai", "Cuddalore", "Nagapattinam"
  ];

  const properties = [
    {
      id: "PROP-TN-20250727001",
      title: "Premium Residential Plot",
      district: "Chennai",
      block: "A",
      plotNo: "45",
      price: 2500000,
      area: "1200 Sqft",
      image: heroImage,
      status: "Available" as const,
      type: "Residential"
    },
    {
      id: "PROP-TN-20250727002",
      title: "Modern Villa with Garden",
      district: "Coimbatore",
      block: "B",
      plotNo: "12",
      price: 4500000,
      area: "2400 Sqft",
      image: sampleHouse,
      status: "Available" as const,
      type: "Villa"
    },
    {
      id: "PROP-TN-20250727003",
      title: "Agricultural Farmland",
      district: "Salem",
      block: "C",
      plotNo: "78",
      price: 800000,
      area: "2 Acres",
      image: sampleFarmland,
      status: "Booked" as const,
      type: "Agricultural"
    },
    {
      id: "PROP-TN-20250727004",
      title: "Commercial Plot - Main Road",
      district: "Madurai",
      block: "A",
      plotNo: "23",
      price: 3200000,
      area: "1800 Sqft",
      image: heroImage,
      status: "Available" as const,
      type: "Commercial"
    },
    {
      id: "PROP-TN-20250727005",
      title: "Coconut Farm with Well",
      district: "Erode",
      block: "D",
      plotNo: "156",
      price: 1200000,
      area: "3 Acres",
      image: sampleFarmland,
      status: "Available" as const,
      type: "Agricultural"
    }
  ];

  const propertyTypes = ["All", "Residential", "Commercial", "Agricultural", "Villa"];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Explore Properties</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search properties, districts, blocks..."
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-[140px] rounded-xl">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district} value={district.toLowerCase()}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-[140px] rounded-xl">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-1000000">Under ₹10L</SelectItem>
              <SelectItem value="1000000-2500000">₹10L - ₹25L</SelectItem>
              <SelectItem value="2500000-5000000">₹25L - ₹50L</SelectItem>
              <SelectItem value="5000000+">Above ₹50L</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[120px] rounded-xl">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Agricultural">Agricultural</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl"
            onClick={() => setShowFilterModal(true)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            More
          </Button>
        </div>

        {/* Property Type Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {propertyTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="whitespace-nowrap cursor-pointer hover:bg-accent hover:text-white transition-colors"
            >
              {type}
            </Badge>
          ))}
        </div>

        {/* Sort and View Options */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {properties.length} properties found
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="area">Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-1 bg-muted rounded-xl p-1">
            <Button
              variant={viewType === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("grid")}
              className="rounded-lg h-8"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("map")}
              className="rounded-lg h-8"
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {viewType === "grid" ? (
          <div className="space-y-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                onClick={() => console.log("Navigate to property details")}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Map view coming soon!</p>
              <p className="text-sm text-muted-foreground">Integrated with Google Maps</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal 
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={(filters) => {
          console.log("Applied filters:", filters);
          // Handle filter application logic here
        }}
      />
    </div>
  );
};

export default ExplorePage;