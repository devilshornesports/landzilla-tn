import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

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

interface BlockDetailsProps {
  property: any;
}

const BlockDetails = ({ property }: BlockDetailsProps) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (property?.id) {
      fetchBlocks();
    }
  }, [property?.id]);

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

  const handleBookBlock = (block: Block) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book plots",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement block booking logic
    toast({
      title: "Booking Initiated",
      description: `Starting booking process for ${block.block_name}`,
    });
  };

  if (loading) {
    return <div className="text-center py-4">Loading blocks...</div>;
  }

  if (blocks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="mb-4">No blocks available for this property</p>
        <div className="flex items-center gap-1 justify-center">
          <IndianRupee className="h-4 w-4 text-accent" />
          <span className="text-lg font-semibold text-accent">
            {property.price?.toLocaleString('en-IN')}
          </span>
          <span className="text-sm text-muted-foreground ml-2">
            {property.price_type === 'per_day' ? 'per day' : 'total price'}
          </span>
        </div>
        <Button className="mt-4 bg-accent hover:bg-accent/90">
          <Calendar className="h-4 w-4 mr-2" />
          Book Property
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <Card key={block.id} className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{block.block_name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>Block {block.block_id}</span>
                </div>
              </div>
              <Badge variant={block.available_plots > 0 ? "default" : "secondary"}>
                {block.available_plots > 0 ? "Available" : "Sold Out"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Plots:</span>
                <span className="ml-2 font-medium">{block.total_plots}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Available:</span>
                <span className="ml-2 font-medium text-green-600">{block.available_plots || block.total_plots}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Area per Plot:</span>
                <span className="ml-2 font-medium">{block.area_per_plot} {block.area_unit}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Price per {block.area_unit}:</span>
                <span className="ml-2 font-medium">₹{block.price_per_unit?.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-5 w-5 text-accent" />
                    <span className="text-xl font-bold text-accent">
                      {block.total_price_per_plot?.toLocaleString('en-IN') || 
                       ((block.area_per_plot || 0) * (block.price_per_unit || 0)).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">per plot</p>
                </div>
                <Button 
                  onClick={() => handleBookBlock(block)}
                  disabled={(block.available_plots || block.total_plots) === 0}
                  className="bg-accent hover:bg-accent/90"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Plot
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlockDetails;