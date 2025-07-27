import { useState, useEffect } from "react";
import { MessageSquare, Send, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MessagesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
      // Set up real-time subscription for messages
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${selectedChat}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedChat]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          properties(title),
          participant_1_profile:profiles!conversations_participant_1_fkey(full_name, is_verified),
          participant_2_profile:profiles!conversations_participant_2_fkey(full_name, is_verified),
          last_message:messages!conversations_last_message_id_fkey(content, created_at)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_activity', { ascending: false });

      if (error) throw error;

      const formattedConversations = data.map(conv => {
        const otherParticipant = conv.participant_1 === user.id 
          ? conv.participant_2_profile 
          : conv.participant_1_profile;
        
        return {
          id: conv.id,
          name: otherParticipant?.full_name || 'Unknown User',
          property: conv.properties?.title || 'Property Discussion',
          lastMessage: conv.last_message?.content || 'No messages yet',
          time: conv.last_message?.created_at ? new Date(conv.last_message.created_at).toLocaleTimeString() : '',
          unread: 0, // TODO: Implement unread count
          isVerified: otherParticipant?.is_verified || false
        };
      });

      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data.map(msg => ({
        id: msg.id,
        sender: msg.sender_id === user.id ? 'You' : 'Other',
        message: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString(),
        isOwn: msg.sender_id === user.id
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedChat,
          sender_id: user.id,
          content: message.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Secure chat with verified users</p>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Conversations List */}
        <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-border`}>
          <div className="p-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-muted rounded-lg h-16"></div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No conversations yet</p>
                <p className="text-sm text-muted-foreground">Start messaging property owners to see conversations here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedChat === conversation.id ? 'ring-2 ring-accent' : ''
                  }`}
                  onClick={() => setSelectedChat(conversation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-accent text-white">
                          {conversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">
                            {conversation.name}
                          </h3>
                          {conversation.isVerified && (
                            <Shield className="h-4 w-4 text-success" />
                          )}
                          {conversation.unread > 0 && (
                            <Badge className="ml-auto bg-accent text-white text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate mb-1">
                          {conversation.property}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                          <span className="text-xs text-muted-foreground ml-2">
                            {conversation.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${selectedChat ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-accent text-white">
                        {conversations.find(c => c.id === selectedChat)?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {conversations.find(c => c.id === selectedChat)?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {conversations.find(c => c.id === selectedChat)?.property}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.isOwn
                          ? 'bg-accent text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.isOwn ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-border p-4 mb-20">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground">
                  Choose a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;