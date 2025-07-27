import { useState } from "react";
import { Search, Filter, MapPin, TrendingUp, Star, Clock, Users, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PropertyCard from "@/components/PropertyCard";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-property.jpg";
import sampleHouse from "@/assets/sample-house.jpg";
import sampleFarmland from "@/assets/sample-farmland.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const districts = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"
  ];

  const featuredProperties = [
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
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="gradient-hero px-4 pt-8 pb-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome to <span className="text-gradient">LandZilla</span>
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
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {districts.slice(0, 5).map((district) => (
            <Badge
              key={district}
              variant="secondary"
              className="whitespace-nowrap cursor-pointer hover:bg-accent hover:text-white transition-colors"
            >
              <MapPin className="h-3 w-3 mr-1" />
              {district}
            </Badge>
          ))}
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
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
            />
          ))}
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
    </div>
  );
};

export default HomePage;