import { useState, useEffect } from "react";
import { X, IndianRupee, Calendar, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Block {
  id: string;
  block_name: string;
  block_id: string;
  total_plots: number;
  area_per_plot: number;
  area_unit: string;
  price_per_unit: number;
  total_price_per_plot: number;
  available_plots: number;
}

interface BlockBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

const BlockBookingModal = ({ isOpen, onClose, property }: BlockBookingModalProps) => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedPlot, setSelectedPlot] = useState("");
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    if (isOpen && property?.id) {
      fetchBlocks();
    }
  }, [isOpen, property?.id]);

  const fetchBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('blocks')
        .select('*')
        .eq('property_id', property.id)
        .order('block_id');

      if (error) throw error;
      setBlocks(data || []);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedBlockData = blocks.find((block) => block.block_id === selectedBlock);
  const availablePlots = selectedBlockData ? 
    Array.from({ length: selectedBlockData.available_plots || selectedBlockData.total_plots }, (_, i) => ({
      plotNo: i + 1,
      status: "Available"
    })) : [];

  const handleBooking = async () => {
    if (!selectedBlock || !selectedPlot || !buyerInfo.name || !buyerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update available plots count
      const selectedBlockData = blocks.find(block => block.block_id === selectedBlock);
      if (selectedBlockData) {
        const newAvailablePlots = (selectedBlockData.available_plots || selectedBlockData.total_plots) - 1;
        
        await supabase
          .from('blocks')
          .update({ available_plots: newAvailablePlots })
          .eq('id', selectedBlockData.id);
      }

      const bookingId = `BOOK-${Date.now()}`;
      
      toast({
        title: "Booking Confirmed! 🎉",
        description: `Your booking ID is ${bookingId}. Plot availability has been updated.`,
      });

      onClose();
    } catch (error) {
      console.error('Error updating plot availability:', error);
      toast({
        title: "Booking Error",
        description: "There was an issue processing your booking. Please try again.",
        variant: "destructive"
      });
    }
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
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading blocks...</p>
            </div>
          ) : blocks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No blocks available for this property</p>
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <div className="flex items-center gap-1 justify-center mb-2">
                  <IndianRupee className="h-5 w-5 text-accent" />
                  <span className="text-xl font-bold text-accent">
                    {property.starting_price?.toLocaleString('en-IN') || property.price?.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Total price for this property</p>
              </div>
            </div>
          ) : (
            <>
              {/* Block Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Block</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blocks.map((block) => (
                    <div 
                      key={block.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedBlock === block.block_id 
                          ? 'border-accent bg-accent/5' 
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedBlock(block.block_id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-foreground">{block.block_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {block.area_per_plot} {block.area_unit} per plot
                          </p>
                        </div>
                        <Badge variant={(block.available_plots || block.total_plots) > 0 ? "default" : "secondary"}>
                          {block.available_plots || block.total_plots} Available
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4 text-accent" />
                        <span className="font-semibold text-accent">
                          {block.total_price_per_plot?.toLocaleString('en-IN') || 
                           ((block.area_per_plot || 0) * (block.price_per_unit || 0)).toLocaleString('en-IN')}
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
                        {availablePlots.map((plot) => (
                          <SelectItem key={plot.plotNo} value={plot.plotNo.toString()}>
                            Plot {plot.plotNo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              )}
            </>
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
                  <span className="font-medium">{selectedBlockData?.block_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plot:</span>
                  <span className="font-medium">Plot {selectedPlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Area:</span>
                  <span className="font-medium">
                    {selectedBlockData?.area_per_plot} {selectedBlockData?.area_unit}
                  </span>
                </div>
                <div className="flex justify-between border-t border-accent/20 pt-2">
                  <span className="font-semibold">Total Price:</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4 text-accent" />
                    <span className="font-bold text-accent">
                      {selectedBlockData?.total_price_per_plot?.toLocaleString('en-IN') || 
                       ((selectedBlockData?.area_per_plot || 0) * (selectedBlockData?.price_per_unit || 0)).toLocaleString('en-IN')}
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