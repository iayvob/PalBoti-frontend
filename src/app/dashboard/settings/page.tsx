"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import SignOutButton from "@/components/SignOutButton";
import { Bell, User } from "lucide-react";

export default function SettingsPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    email: false,
    sms: false,
    push: false,
  });

  const saveNotificationSettings = async () => {
    setSaving(true);
    try {
      const dataToMap = {
        email: notifications.email,
        sms: notifications.sms,
        push: notifications.push,
      };
      console.table(dataToMap);
    } catch (error) {
      setSaving(false);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <SignOutButton />
      </div>

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <div id="name" className="rounded-md border p-2">
                  {session?.user?.name || "Not provided"}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <div id="email" className="rounded-md border p-2">
                  {session?.user?.email || "Not provided"}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="id">User ID</Label>
                <div
                  id="id"
                  className="rounded-md border p-2 font-mono text-sm"
                >
                  {session?.user?.id || "Not available"}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via text message
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in the app
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>

              <Button
                onClick={saveNotificationSettings}
                disabled={saving}
                className="w-full"
              >
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
