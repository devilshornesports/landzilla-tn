-- Create saved_properties table for wishlist functionality
CREATE TABLE public.saved_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Enable RLS
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_properties
CREATE POLICY "Users can view their own saved properties" 
ON public.saved_properties 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can save properties" 
ON public.saved_properties 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave properties" 
ON public.saved_properties 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create property_views table for analytics
CREATE TABLE public.property_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  user_id UUID,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS for property_views
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Create policies for property_views
CREATE POLICY "Property owners can view their property analytics" 
ON public.property_views 
FOR SELECT 
USING (
  property_id IN (
    SELECT id FROM properties WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Anyone can insert property views" 
ON public.property_views 
FOR INSERT 
WITH CHECK (true);

-- Create activity_logs table for user activities
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  property_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for activity_logs
CREATE POLICY "Users can view their own activities" 
ON public.activity_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
ON public.activity_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);