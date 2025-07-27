import { useState } from "react";
import { ArrowLeft, Plus, Edit, Eye, Trash2, Users, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-property.jpg";
import sampleHouse from "@/assets/sample-house.jpg";
import sampleFarmland from "@/assets/sample-farmland.jpg";

const MyListingsPage = () => {
  const navigate = useNavigate();
  
  const [listings] = useState([
    {
      id: "PROP-TN-20250727001",
      title: "Premium Residential Plot in Anna Nagar",
      district: "Chennai",
      image: heroImage,
      status: "Active",
      totalBlocks: 3,
      totalPlots: 150,
      bookedPlots: 45,
      views: 234,
      messages: 12,
      createdAt: "2025-01-15"
    },
    {
      id: "PROP-TN-20250727002",
      title: "Modern Villa with Garden",
      district: "Coimbatore",
      image: sampleHouse,
      status: "Active",
      totalBlocks: 2,
      totalPlots: 80,
      bookedPlots: 20,
      views: 156,
      messages: 8,
      createdAt: "2025-01-10"
    },
    {
      id: "PROP-TN-20250727003",
      title: "Agricultural Farmland",
      district: "Salem",
      image: sampleFarmland,
      status: "Sold",
      totalBlocks: 4,
      totalPlots: 200,
      bookedPlots: 200,
      views: 89,
      messages: 5,
      createdAt: "2024-12-20"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500 text-white";
      case "Sold":
        return "bg-gray-500 text-white";
      case "Draft":
        return "bg-yellow-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleEdit = (listingId: string) => {
    navigate(`/post-property?edit=${listingId}`);
  };

  const handleViewBookings = (listingId: string) => {
    navigate(`/listings/${listingId}/bookings`);
  };

  const handleDelete = (listingId: string) => {
    // Handle delete logic
    console.log("Delete listing:", listingId);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">My Listings</h1>
          </div>
          <Button onClick={() => navigate("/post-property")} className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">{listings.length}</div>
              <div className="text-sm text-muted-foreground">Total Listings</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">
                {listings.reduce((sum, listing) => sum + listing.bookedPlots, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Plots Booked</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">
                {listings.reduce((sum, listing) => sum + listing.views, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
        </div>

        {/* Listings */}
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="p-0">
              <div className="flex">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-24 h-24 object-cover rounded-l-lg"
                />
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{listing.district}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(listing.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewBookings(listing.id)}>
                            <Users className="h-4 w-4 mr-2" />
                            View Bookings
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/property/${listing.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Property
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(listing.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                    <div>
                      <div className="font-medium text-foreground">{listing.totalBlocks}</div>
                      <div>Blocks</div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {listing.bookedPlots}/{listing.totalPlots}
                      </div>
                      <div>Booked</div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{listing.views}</div>
                      <div>Views</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {listings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-6">Start by adding your first property listing</p>
            <Button onClick={() => navigate("/post-property")} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Property
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;