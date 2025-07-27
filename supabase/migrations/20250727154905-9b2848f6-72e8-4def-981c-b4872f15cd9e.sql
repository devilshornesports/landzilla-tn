-- Fix foreign key relationships and database structure

-- Add foreign key constraint for properties.owner_id to profiles.user_id
ALTER TABLE public.properties 
ADD CONSTRAINT properties_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key constraints for conversations participants
ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_participant_1_fkey 
FOREIGN KEY (participant_1) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_participant_2_fkey 
FOREIGN KEY (participant_2) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add conversation_id to messages table and create foreign key
ALTER TABLE public.messages 
ADD COLUMN conversation_id UUID;

ALTER TABLE public.messages 
ADD CONSTRAINT messages_conversation_id_fkey 
FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;

-- Add foreign key constraints for bookings
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_property_id_fkey 
FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_renter_id_fkey 
FOREIGN KEY (renter_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key for saved_properties
ALTER TABLE public.saved_properties 
ADD CONSTRAINT saved_properties_property_id_fkey 
FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

ALTER TABLE public.saved_properties 
ADD CONSTRAINT saved_properties_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key for property_views
ALTER TABLE public.property_views 
ADD CONSTRAINT property_views_property_id_fkey 
FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

ALTER TABLE public.property_views 
ADD CONSTRAINT property_views_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;

-- Add foreign key for activity_logs
ALTER TABLE public.activity_logs 
ADD CONSTRAINT activity_logs_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.activity_logs 
ADD CONSTRAINT activity_logs_property_id_fkey 
FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE SET NULL;

-- Update messages RLS policies to work with conversation_id
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

CREATE POLICY "Users can send messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view messages in their conversations" 
ON public.messages 
FOR SELECT 
USING (
  conversation_id IN (
    SELECT id FROM conversations 
    WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);