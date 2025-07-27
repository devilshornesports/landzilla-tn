import { useState } from "react";
import { ArrowLeft, User, Bell, Shield, Globe, Moon, Sun, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  const settingsSections = [
    {
      title: "Account",
      icon: User,
      items: [
        { label: "Edit Profile", onClick: () => navigate("/profile/edit") },
        { label: "Change Password", onClick: () => {} },
        { label: "Account Verification", onClick: () => {} },
      ]
    },
    {
      title: "Preferences",
      icon: Bell,
      items: [
        { 
          label: "Push Notifications", 
          type: "toggle", 
          value: notifications, 
          onChange: setNotifications 
        },
        { 
          label: "Dark Mode", 
          type: "toggle", 
          value: darkMode, 
          onChange: setDarkMode 
        },
        { 
          label: "Language", 
          type: "select", 
          value: language, 
          onChange: setLanguage,
          options: [
            { value: "en", label: "English" },
            { value: "ta", label: "தமிழ் (Tamil)" }
          ]
        },
      ]
    },
    {
      title: "Security",
      icon: Shield,
      items: [
        { label: "Two-Factor Authentication", onClick: () => {} },
        { label: "Login History", onClick: () => {} },
        { label: "Privacy Settings", onClick: () => {} },
      ]
    },
    {
      title: "Support",
      icon: HelpCircle,
      items: [
        { label: "Help Center", onClick: () => {} },
        { label: "Contact Support", onClick: () => {} },
        { label: "Report a Problem", onClick: () => {} },
        { label: "Terms of Service", onClick: () => {} },
        { label: "Privacy Policy", onClick: () => {} },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {settingsSections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <section.icon className="h-5 w-5 text-accent" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {section.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                  <span className="text-foreground">{item.label}</span>
                  
                  {item.type === "toggle" && (
                    <Switch
                      checked={item.value}
                      onCheckedChange={item.onChange}
                    />
                  )}
                  
                  {item.type === "select" && (
                    <Select value={item.value} onValueChange={item.onChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {item.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {!item.type && (
                    <Button variant="ghost" size="sm" onClick={item.onClick}>
                      →
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* App Info */}
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-accent mb-2">LandZilla</div>
            <div className="text-sm text-muted-foreground mb-4">Version 1.0.0</div>
            <div className="text-xs text-muted-foreground">
              © 2025 LandZilla. All rights reserved.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;