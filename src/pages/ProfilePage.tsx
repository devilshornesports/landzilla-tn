import { useState } from "react";
import { User, Settings, Heart, Eye, MessageSquare, Plus, LogOut, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "@/components/PropertyCard";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-property.jpg";
import sampleHouse from "@/assets/sample-house.jpg";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userRole] = useState<"buyer" | "seller">("seller");

  const userStats = {
    totalListings: 5,
    totalViews: 1250,
    totalMessages: 28,
    totalBookings: 3
  };

  const myListings = [
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
      status: "Booked" as const,
      type: "Villa"
    }
  ];

  const savedProperties = [
    {
      id: "PROP-TN-20250727006",
      title: "Beachside Resort Plot",
      district: "Kanyakumari",
      block: "A",
      plotNo: "89",
      price: 3500000,
      area: "2000 Sqft",
      image: heroImage,
      status: "Available" as const,
      type: "Commercial"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Header */}
      <div className="bg-card border-b border-border">
        <div className="px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-accent text-white text-xl">
                RK
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Rajesh Kumar</h1>
              <p className="text-muted-foreground">rajesh.kumar@email.com</p>
              <Badge className="mt-2 bg-accent text-white">
                {userRole === "seller" ? "Property Seller" : "Property Buyer"}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{userStats.totalListings}</div>
              <div className="text-xs text-muted-foreground">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{userStats.totalViews}</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{userStats.totalMessages}</div>
              <div className="text-xs text-muted-foreground">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{userStats.totalBookings}</div>
              <div className="text-xs text-muted-foreground">Bookings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <Tabs defaultValue={userRole === "seller" ? "listings" : "saved"} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {userRole === "seller" && (
              <TabsTrigger value="listings">My Listings</TabsTrigger>
            )}
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {userRole === "seller" && (
            <TabsContent value="listings" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Property Listings</h2>
                <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={() => navigate("/my-listings")}>
                  <Building2 className="h-4 w-4 mr-1" />
                  Manage All
                </Button>
              </div>

              <div className="space-y-4">
                {myListings.map((property) => (
                  <div key={property.id} className="relative">
                    <PropertyCard {...property} />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="saved" className="space-y-4">
            <h2 className="text-lg font-semibold">Saved Properties</h2>
            <div className="space-y-4">
              {savedProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            
            <div className="space-y-3">
              {[
                {
                  icon: Eye,
                  text: "Your property 'Premium Residential Plot' received 15 new views",
                  time: "2 hours ago"
                },
                {
                  icon: MessageSquare,
                  text: "New message from Priya Sharma about 'Agricultural Farmland'",
                  time: "4 hours ago"
                },
                {
                  icon: Heart,
                  text: "Your property was saved by 3 users",
                  time: "1 day ago"
                }
              ].map((activity, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <activity.icon className="h-5 w-5 text-accent mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/edit-profile")}
            >
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;