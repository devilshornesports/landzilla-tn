import { useState } from "react";
import { ArrowLeft, User, Lock, HelpCircle, Phone, AlertTriangle, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const settingsSections = [
    {
      title: "Account",
      icon: User,
      items: [
        {
          title: "Edit Profile",
          description: "Update your personal information",
          action: () => navigate("/edit-profile"),
          icon: User
        },
        {
          title: "Change Password",
          description: "Update your account password",
          action: () => {
            toast({
              title: "Coming Soon",
              description: "Password change feature will be available soon"
            });
          },
          icon: Lock
        }
      ]
    },
    {
      title: "Support",
      icon: HelpCircle,
      items: [
        {
          title: "Help Center",
          description: "Find answers to common questions",
          action: () => {
            toast({
              title: "Coming Soon",
              description: "Help center will be available soon"
            });
          },
          icon: HelpCircle
        },
        {
          title: "Contact Support",
          description: "Get help from our support team",
          action: () => {
            toast({
              title: "Contact Support",
              description: "Email us at support@landzilla.com"
            });
          },
          icon: Phone
        },
        {
          title: "Report a Problem",
          description: "Report bugs or issues with the app",
          action: () => {
            toast({
              title: "Report Problem",
              description: "Email us at support@landzilla.com with details"
            });
          },
          icon: AlertTriangle
        }
      ]
    },
    {
      title: "Legal",
      icon: FileText,
      items: [
        {
          title: "Terms of Service",
          description: "Read our terms and conditions",
          action: () => {
            toast({
              title: "Terms of Service",
              description: "View terms at landzilla.com/terms"
            });
          },
          icon: FileText
        },
        {
          title: "Privacy Policy",
          description: "Learn about our privacy practices",
          action: () => {
            toast({
              title: "Privacy Policy",
              description: "View policy at landzilla.com/privacy"
            });
          },
          icon: Shield
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account and app preferences</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-500 text-white">Active</Badge>
                  <Badge variant="outline">Verified</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={item.action}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle>App Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Version</span>
                <span className="text-foreground">1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Build</span>
                <span className="text-foreground">2025.01.27</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Platform</span>
                <span className="text-foreground">Web</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;