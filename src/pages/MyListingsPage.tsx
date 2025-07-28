import { useState, useEffect } from "react";
import { ArrowLeft, Eye, Edit, Trash2, Users, MessageSquare, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MyListingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
    fetchBookings();
  }, [user]);

  const fetchProperties = async () => {
    if (!user) return;

    try {
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(propertiesData || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties!inner(title, location),
          renter:profiles!inner(full_name, phone)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_available: !currentStatus })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Property marked as ${!currentStatus ? 'available' : 'unavailable'}`,
      });

      fetchProperties();
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: "Property deleted",
        description: "Property has been removed from your listings.",
      });

      fetchProperties();
    } catch (error) {
      toast({
        title: "Error deleting property",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const viewPropertyBookings = (property: any) => {
    setSelectedProperty(property);
    setShowBookingsModal(true);
  };

  const propertyBookings = bookings.filter(booking => booking.property_id === selectedProperty?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading your properties...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Properties</h1>
            <p className="text-muted-foreground">{properties.length} active listings</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            {properties.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No properties listed</h3>
                <p className="text-muted-foreground mb-4">Start by posting your first property</p>
                <Button onClick={() => navigate("/post-property")}>
                  Post Property
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <Card key={property.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {property.images?.[0] && (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{property.title}</h3>
                              <p className="text-muted-foreground">{property.location}</p>
                              <p className="text-accent font-bold text-lg">
                                ₹{property.price?.toLocaleString('en-IN')}
                              </p>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/property/${property.id}`)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Property
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/edit-property/${property.id}`)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Property
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/booking-dashboard/${property.id}`)}>
                                  <Users className="h-4 w-4 mr-2" />
                                  Booking Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => togglePropertyStatus(property.id, property.is_available)}
                                >
                                  {property.is_available ? 'Mark as Sold' : 'Mark as Available'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => deleteProperty(property.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Property
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={property.is_available ? "default" : "secondary"}>
                              {property.is_available ? "Available" : "Sold"}
                            </Badge>
                            <Badge variant="outline">
                              Views: {property.view_count || 0}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                <p className="text-muted-foreground">Bookings will appear here when users book your properties</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{booking.properties?.title}</h3>
                          <p className="text-muted-foreground text-sm">{booking.properties?.location}</p>
                          
                          <div className="flex items-center gap-4 mt-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-accent text-white text-sm">
                                {booking.renter?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{booking.renter?.full_name || 'Anonymous'}</p>
                              <p className="text-muted-foreground text-xs">{booking.renter?.phone}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span>From: {new Date(booking.start_date).toLocaleDateString()}</span>
                            <span>To: {new Date(booking.end_date).toLocaleDateString()}</span>
                            <span className="font-medium text-accent">₹{booking.total_price?.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Badge 
                            variant={booking.status === 'confirmed' ? 'default' : 
                                   booking.status === 'pending' ? 'secondary' : 'destructive'}
                          >
                            {booking.status}
                          </Badge>
                          
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bookings Modal */}
      <Dialog open={showBookingsModal} onOpenChange={setShowBookingsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bookings for {selectedProperty?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {propertyBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No bookings for this property</p>
            ) : (
              propertyBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-accent text-white">
                            {booking.renter?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.renter?.full_name || 'Anonymous'}</p>
                          <p className="text-sm text-muted-foreground">{booking.renter?.phone}</p>
                        </div>
                      </div>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Check-in</p>
                        <p className="font-medium">{new Date(booking.start_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Check-out</p>
                        <p className="font-medium">{new Date(booking.end_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Amount</p>
                        <p className="font-medium text-accent">₹{booking.total_price?.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payment Status</p>
                        <p className="font-medium">{booking.payment_status}</p>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="mt-3">
                        <p className="text-muted-foreground text-sm">Notes</p>
                        <p className="text-sm">{booking.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyListingsPage;