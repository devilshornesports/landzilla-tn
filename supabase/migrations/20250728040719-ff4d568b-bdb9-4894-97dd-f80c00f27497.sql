-- Add property_type and bedrooms/bathrooms to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS property_type TEXT,
ADD COLUMN IF NOT EXISTS starting_price NUMERIC;

-- Create blocks table for property blocks
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  block_name TEXT NOT NULL,
  block_id TEXT NOT NULL,
  total_plots INTEGER NOT NULL DEFAULT 1,
  area_per_plot NUMERIC,
  area_unit TEXT DEFAULT 'sqft',
  price_per_unit NUMERIC NOT NULL,
  total_price_per_plot NUMERIC,
  available_plots INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blocks table
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- Create policies for blocks table
CREATE POLICY "Blocks are viewable by everyone" 
ON public.blocks 
FOR SELECT 
USING (true);

CREATE POLICY "Property owners can create blocks" 
ON public.blocks 
FOR INSERT 
WITH CHECK (
  property_id IN (
    SELECT id FROM public.properties WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Property owners can update their blocks" 
ON public.blocks 
FOR UPDATE 
USING (
  property_id IN (
    SELECT id FROM public.properties WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Property owners can delete their blocks" 
ON public.blocks 
FOR DELETE 
USING (
  property_id IN (
    SELECT id FROM public.properties WHERE owner_id = auth.uid()
  )
);

-- Create trigger for blocks updated_at
CREATE TRIGGER update_blocks_updated_at
BEFORE UPDATE ON public.blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();