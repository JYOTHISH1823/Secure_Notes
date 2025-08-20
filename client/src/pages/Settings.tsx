import { useState } from "react";
import { User, Shield, Bell, Download, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  isAuthenticated: boolean;
  onLogin?: () => void;
}

interface UserSettings {
  name: string;
  email: string;
  avatar?: string;
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: boolean;
  };
}

const Settings = ({ isAuthenticated,onLogin}: SettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    name: "John Doe",
    email: "john@example.com",
    notifications: {
      email: true,
      push: false,
      reminders: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: true,
    },
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data export will be sent to your email.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
  };

  if (!isAuthenticated) {
    if (onLogin) {
        return (
            <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
            <p className="text-muted-foreground">Please sign in to access settings.</p>
            <Button onClick={onLogin}>Sign In to Continue</Button>
            </div>
        );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal information and profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={settings.avatar} />
                <AvatarFallback className="text-lg">
                  {settings.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>
              Configure security features and privacy settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={settings.security.twoFactor}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, twoFactor: checked }
                  }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Session Timeout</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sign out after 30 minutes of inactivity
                </p>
              </div>
              <Switch
                checked={settings.security.sessionTimeout}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, sessionTimeout: checked }
                  }))
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Change Password</Label>
              <div className="flex gap-2">
                <Input type="password" placeholder="Current password" className="flex-1" />
                <Input type="password" placeholder="New password" className="flex-1" />
                <Button variant="outline">Update</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates and security alerts via email
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: checked }
                  }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about important activities
                </p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: checked }
                  }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reminder Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminders for upcoming events and tasks
                </p>
              </div>
              <Switch
                checked={settings.notifications.reminders}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, reminders: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export your data or delete your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Export Data</Label>
                <p className="text-sm text-muted-foreground">
                  Download a copy of all your notes and data
                </p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-destructive">Delete Account</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="w-full md:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;