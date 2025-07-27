import { useState } from "react";
import { X, IndianRupee, Calendar, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface BlockBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

const BlockBookingModal = ({ isOpen, onClose, property }: BlockBookingModalProps) => {
  const { toast } = useToast();
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedPlot, setSelectedPlot] = useState("");
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  if (!isOpen) return null;

  const selectedBlockData = property.blocks.find((block: any) => block.blockId === selectedBlock);
  const availablePlots = selectedBlockData?.plots.filter((plot: any) => plot.status === "Available") || [];

  const handleBooking = () => {
    if (!selectedBlock || !selectedPlot || !buyerInfo.name || !buyerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const bookingId = `BOOK-${Date.now()}`;
    
    toast({
      title: "Booking Confirmed! 🎉",
      description: `Your booking ID is ${bookingId}. You will receive confirmation details shortly.`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-background w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Book Property</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Block Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Block</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {property.blocks.map((block: any) => (
                <div 
                  key={block.blockId}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedBlock === block.blockId 
                      ? 'border-accent bg-accent/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedBlock(block.blockId)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-foreground">{block.blockName}</h3>
                      <p className="text-sm text-muted-foreground">{block.area} per plot</p>
                    </div>
                    <Badge variant={block.availablePlots > 0 ? "default" : "secondary"}>
                      {block.availablePlots} Available
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-accent">
                      {block.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Plot Selection */}
          {selectedBlock && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Plot</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedPlot} onValueChange={setSelectedPlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose plot number" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlots.map((plot: any) => (
                      <SelectItem key={plot.plotNo} value={plot.plotNo.toString()}>
                        Plot {plot.plotNo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Buyer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buyer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={buyerInfo.name}
                  onChange={(e) => setBuyerInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={buyerInfo.phone}
                  onChange={(e) => setBuyerInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={buyerInfo.email}
                  onChange={(e) => setBuyerInfo(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Your address"
                  value={buyerInfo.address}
                  onChange={(e) => setBuyerInfo(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          {selectedBlock && selectedPlot && (
            <Card className="bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property:</span>
                  <span className="font-medium">{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Block:</span>
                  <span className="font-medium">{selectedBlockData?.blockName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plot:</span>
                  <span className="font-medium">Plot {selectedPlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Area:</span>
                  <span className="font-medium">{selectedBlockData?.area}</span>
                </div>
                <div className="flex justify-between border-t border-accent/20 pt-2">
                  <span className="font-semibold">Total Price:</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4 text-accent" />
                    <span className="font-bold text-accent">
                      {selectedBlockData?.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Book Button */}
          <Button 
            onClick={handleBooking}
            className="w-full h-12 text-lg bg-accent hover:bg-accent/90"
            disabled={!selectedBlock || !selectedPlot || !buyerInfo.name || !buyerInfo.phone}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockBookingModal;