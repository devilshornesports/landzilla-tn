import { useState, useEffect } from "react";
import { User, Settings, Heart, Eye, MessageSquare, Plus, LogOut, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "@/components/PropertyCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch user's properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id);

      if (propertiesError) {
        console.error('Properties fetch error:', propertiesError);
      } else {
        setUserProperties(propertiesData || []);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Header */}
      <div className="bg-card border-b border-border">
        <div className="px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-accent text-white text-xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{userName}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge className="mt-2 bg-accent text-white">
                {profile?.user_type === "seller" ? "Property Seller" : "Property Buyer"}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{userProperties.length}</div>
              <div className="text-xs text-muted-foreground">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">0</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">0</div>
              <div className="text-xs text-muted-foreground">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">0</div>
              <div className="text-xs text-muted-foreground">Bookings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <Tabs defaultValue={profile?.user_type === "seller" ? "listings" : "saved"} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {profile?.user_type === "seller" && (
              <TabsTrigger value="listings">My Listings</TabsTrigger>
            )}
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {profile?.user_type === "seller" && (
            <TabsContent value="listings" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Property Listings</h2>
                <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={() => navigate("/my-listings")}>
                  <Building2 className="h-4 w-4 mr-1" />
                  Manage All
                </Button>
              </div>

              <div className="space-y-4">
                {userProperties.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No properties listed yet</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate("/post-property")}
                    >
                      Post Your First Property
                    </Button>
                  </div>
                ) : (
                  userProperties.map((property) => (
                    <div key={property.id} className="relative">
                      <PropertyCard 
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
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          )}

          <TabsContent value="saved" className="space-y-4">
            <h2 className="text-lg font-semibold">Saved Properties</h2>
            <div className="space-y-4">
              {savedProperties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No saved properties yet</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate("/explore")}
                  >
                    Explore Properties
                  </Button>
                </div>
              ) : (
                savedProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            
            <div className="space-y-3">
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm mt-2">Your property views, messages, and saves will appear here</p>
              </div>
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
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
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