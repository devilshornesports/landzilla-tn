import { useState } from "react";
import { MessageSquare, Send, Phone, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: "1",
      name: "Rajesh Kumar",
      property: "Premium Residential Plot - Chennai",
      lastMessage: "Is this property still available?",
      time: "2m ago",
      unread: 2,
      propertyId: "PROP-TN-20250727001",
      isVerified: true
    },
    {
      id: "2", 
      name: "Priya Sharma",
      property: "Agricultural Farmland - Salem",
      lastMessage: "Can we schedule a site visit?",
      time: "1h ago",
      unread: 0,
      propertyId: "PROP-TN-20250727003",
      isVerified: true
    },
    {
      id: "3",
      name: "Muthu Vel",
      property: "Commercial Plot - Madurai", 
      lastMessage: "What documents are required?",
      time: "3h ago",
      unread: 1,
      propertyId: "PROP-TN-20250727004",
      isVerified: false
    }
  ];

  const chatMessages = [
    {
      id: "1",
      sender: "Rajesh Kumar",
      message: "Hello! I'm interested in your property listing.",
      time: "10:30 AM",
      isOwn: false
    },
    {
      id: "2", 
      sender: "You",
      message: "Hi Rajesh! Thanks for your interest. The property is still available.",
      time: "10:35 AM",
      isOwn: true
    },
    {
      id: "3",
      sender: "Rajesh Kumar", 
      message: "Is this property still available?",
      time: "10:45 AM",
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Send message:", message);
      setMessage("");
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
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
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