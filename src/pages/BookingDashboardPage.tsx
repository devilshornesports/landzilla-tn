import { useState, useEffect } from "react";
import { ArrowLeft, User, Phone, Mail, Calendar, IndianRupee, MapPin, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BookingDashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (id && user) {
      fetchPropertyAndBookings();
    }
  }, [id, user]);

  const fetchPropertyAndBookings = async () => {
    try {
      // Fetch property details
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single();

      if (propertyError) throw propertyError;
      setProperty(propertyData);

      // Fetch bookings for this property
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          renter:profiles!inner(full_name, phone, is_verified)
        `)
        .eq('property_id', id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load booking data",
        variant: "destructive"
      });
      navigate('/my-listings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .eq('owner_id', user.id); // Ensure only owner can update

      if (error) throw error;

      toast({
        title: "Success",
        description: `Booking ${newStatus} successfully`
      });

      fetchPropertyAndBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading booking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-listings')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Booking Dashboard</h1>
            <p className="text-sm text-muted-foreground">{property?.title}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Property Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Property Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent">{bookings.length}</div>
                <div className="text-sm text-muted-foreground">Total Bookings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-sm text-muted-foreground">Confirmed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">
                  ₹{bookings.reduce((sum, b) => sum + (b.total_price || 0), 0).toLocaleString('en-IN')}
                </div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No bookings yet</p>
                <p className="text-sm text-muted-foreground">Bookings will appear here when users book your property</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {booking.renter?.full_name || 'Unknown User'}
                              </h3>
                              {booking.renter?.is_verified && (
                                <UIBadge className="bg-green-500 text-white text-xs">
                                  Verified
                                </UIBadge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {booking.renter?.phone || 'No phone provided'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <UIBadge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </UIBadge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Check-in:</span>
                          <div className="font-medium">
                            {new Date(booking.start_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Check-out:</span>
                          <div className="font-medium">
                            {new Date(booking.end_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Price:</span>
                          <div className="font-medium text-accent">
                            ₹{booking.total_price?.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Payment:</span>
                          <UIBadge className={getPaymentStatusColor(booking.payment_status)}>
                            {booking.payment_status}
                          </UIBadge>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mb-4">
                          <span className="text-muted-foreground text-sm">Notes:</span>
                          <p className="text-sm mt-1">{booking.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Open messaging with this user
                            navigate(`/messages?userId=${booking.renter_id}&propertyId=${booking.property_id}`);
                          }}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingDashboardPage;