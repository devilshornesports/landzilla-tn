import { useState } from "react";
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";

const ListingBookingsPage = () => {
  const navigate = useNavigate();
  const { listingId } = useParams();
  
  // Mock property data
  const property = {
    id: "PROP-TN-20250727001",
    title: "Premium Residential Plot in Anna Nagar",
    district: "Chennai",
    totalBlocks: 3,
    totalPlots: 150,
    bookedPlots: 45
  };

  const [bookings] = useState([
    {
      id: "BOOK-1736956800001",
      buyerName: "Arun Kumar",
      buyerPhone: "+91 98765 43210",
      buyerEmail: "arun.kumar@email.com",
      buyerAddress: "T. Nagar, Chennai",
      blockId: "A",
      blockName: "Block A - Premium",
      plotNo: 12,
      area: "1200 sqft",
      price: 3000000,
      status: "Confirmed",
      bookingDate: "2025-01-20",
      paymentStatus: "Paid"
    },
    {
      id: "BOOK-1736956800002",
      buyerName: "Priya Sharma",
      buyerPhone: "+91 87654 32109",
      buyerEmail: "priya.sharma@email.com",
      buyerAddress: "Velachery, Chennai",
      blockId: "B",
      blockName: "Block B - Standard",
      plotNo: 7,
      area: "1000 sqft",
      price: 2200000,
      status: "Pending",
      bookingDate: "2025-01-22",
      paymentStatus: "Pending"
    },
    {
      id: "BOOK-1736956800003",
      buyerName: "Rajesh Patel",
      buyerPhone: "+91 76543 21098",
      buyerEmail: "rajesh.patel@email.com",
      buyerAddress: "Adyar, Chennai",
      blockId: "A",
      blockName: "Block A - Premium",
      plotNo: 25,
      area: "1200 sqft",
      price: 3000000,
      status: "Confirmed",
      bookingDate: "2025-01-18",
      paymentStatus: "Paid"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500 text-white";
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500 text-white";
      case "Pending":
        return "bg-orange-500 text-white";
      case "Failed":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const confirmedBookings = bookings.filter(b => b.status === "Confirmed");
  const pendingBookings = bookings.filter(b => b.status === "Pending");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Bookings</h1>
            <p className="text-sm text-muted-foreground">{property.title}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">{bookings.length}</div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{confirmedBookings.length}</div>
              <div className="text-sm text-muted-foreground">Confirmed</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            {confirmedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>
        </Tabs>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
            <p className="text-muted-foreground">Bookings will appear here when buyers book your property</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BookingCard = ({ booking }: { booking: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500 text-white";
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500 text-white";
      case "Pending":
        return "bg-orange-500 text-white";
      case "Failed":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.buyerName}</CardTitle>
            <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
            <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
              {booking.paymentStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Buyer Info */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.buyerPhone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.buyerEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.buyerAddress}</span>
          </div>
        </div>

        {/* Plot Info */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Block:</span>
            <span className="text-sm font-medium">{booking.blockName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Plot Number:</span>
            <span className="text-sm font-medium">Plot {booking.plotNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Area:</span>
            <span className="text-sm font-medium">{booking.area}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Price:</span>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-3 w-3 text-accent" />
              <span className="text-sm font-bold text-accent">
                {booking.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Booked on {new Date(booking.bookingDate).toLocaleDateString('en-IN')}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingBookingsPage;