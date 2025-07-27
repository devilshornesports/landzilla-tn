import { useState, useEffect } from "react";
import { Search, Filter, MapPin, TrendingUp, Star, Clock, Users, Award, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from "@/components/PropertyCard";
import FilterModal from "@/components/FilterModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all-types");
  const [selectedDistrict, setSelectedDistrict] = useState("all-districts");
  const [priceRange, setPriceRange] = useState("all-prices");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const districts = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_available', true)
        .limit(6)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="gradient-hero px-4 pt-8 pb-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, <span className="text-gradient">{user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-muted-foreground">
            Find your perfect property in Tamil Nadu
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search by district, block, or property type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 h-12 rounded-xl border-0 bg-white shadow-card"
          />
          <Button
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent hover:bg-accent/90"
            onClick={() => setShowFilterModal(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-[140px] rounded-xl bg-white">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-districts">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[140px] rounded-xl bg-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-prices">All Prices</SelectItem>
                <SelectItem value="0-1000000">Under ₹10L</SelectItem>
                <SelectItem value="1000000-2500000">₹10L - ₹25L</SelectItem>
                <SelectItem value="2500000-5000000">₹25L - ₹50L</SelectItem>
                <SelectItem value="5000000+">Above ₹50L</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px] rounded-xl bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="agricultural">Agricultural</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {districts.slice(0, 6).map((district) => (
              <Badge
                key={district}
                variant={selectedDistrict === district ? "default" : "secondary"}
                className="whitespace-nowrap cursor-pointer hover:bg-accent hover:text-white transition-colors"
                onClick={() => setSelectedDistrict(selectedDistrict === district ? "all-districts" : district)}
              >
                <MapPin className="h-3 w-3 mr-1" />
                {district}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">2,500+</div>
            <div className="text-sm text-muted-foreground">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">38</div>
            <div className="text-sm text-muted-foreground">Districts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">1,200+</div>
            <div className="text-sm text-muted-foreground">Happy Buyers</div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Featured Properties</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-accent">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No properties available yet.</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/post-property")}
              >
                Post the First Property
              </Button>
            </div>
          ) : (
            properties.map((property) => (
              <PropertyCard 
                key={property.id}
                id={property.id}
                title={property.title}
                district={property.district || property.location}
                block="N/A"
                plotNo="N/A"
                price={property.price}
                area={property.size_sqft ? `${property.size_sqft} Sqft` : "N/A"}
                image={property.images?.[0] || "/placeholder.svg"}
                status={property.is_available ? "Available" : "Sold"}
                type={property.category_id || "Property"}
              />
            ))
          )}
        </div>
      </div>

      {/* Property Categories */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "Residential Plots", count: "1,200+", icon: "🏠", filter: "residential" },
            { name: "Agricultural Land", count: "800+", icon: "🌾", filter: "agricultural" },
            { name: "Commercial Plots", count: "300+", icon: "🏢", filter: "commercial" },
            { name: "Villas & Houses", count: "200+", icon: "🏡", filter: "villa" },
          ].map((type) => (
            <div
              key={type.name}
              className="property-card p-4 text-center hover:bg-accent/5 cursor-pointer"
              onClick={() => navigate(`/explore?category=${type.filter}`)}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <h3 className="font-medium text-foreground">{type.name}</h3>
              <p className="text-sm text-muted-foreground">{type.count} available</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="px-4 py-6 bg-muted/30">
        <h2 className="text-xl font-semibold text-foreground mb-4">Why Choose LandZilla?</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Star, title: "Verified Properties", desc: "All listings verified by our team" },
            { icon: Clock, title: "Quick Booking", desc: "Book plots in minutes" },
            { icon: Users, title: "Trusted Sellers", desc: "Connect with verified property owners" },
            { icon: Award, title: "Best Prices", desc: "Competitive rates across Tamil Nadu" },
          ].map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-4">
                <feature.icon className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-medium text-foreground text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: "New listing added", location: "Chennai", time: "2 hours ago" },
            { action: "Plot booked", location: "Coimbatore", time: "5 hours ago" },
            { action: "Price updated", location: "Salem", time: "1 day ago" },
          ].map((activity, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.location}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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

export default HomePage;