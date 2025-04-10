"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Switch } from "@/src/components/ui/switch"
import { Label } from "@/src/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { LogOut, User, Bell } from "lucide-react"
import { useToast } from "@/src/components/ui/use-toast"
import { Skeleton } from "@/src/components/ui/skeleton"

export default function SettingsPage() {
  const { user, isLoaded, signOut } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notifications, setNotifications] = useState({
    email: false,
    sms: false,
    push: false,
  })

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in")
    }

    async function fetchNotificationSettings() {
      try {
        const response = await fetch("/api/user/notifications")
        if (response.ok) {
          const data = await response.json()
          setNotifications({
            email: data.notificationEmail,
            sms: data.notificationSms,
            push: data.notificationPush,
          })
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error)
        toast({
          title: "Error",
          description: "Failed to load notification settings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      fetchNotificationSettings()
    }
  }, [isLoaded, user, router, toast])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/sign-in")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveNotificationSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationEmail: notifications.email,
          notificationSms: notifications.sms,
          notificationPush: notifications.push,
        }),
      })

      if (response.ok) {
        toast({
          title: "Settings saved",
          description: "Your notification settings have been updated",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving notification settings:", error)
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!isLoaded) {
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
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button variant="destructive" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
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
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <div id="name" className="rounded-md border p-2">
                  {user?.fullName || "Not provided"}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <div id="email" className="rounded-md border p-2">
                  {user?.primaryEmailAddress?.emailAddress || "Not provided"}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="id">User ID</Label>
                <div id="id" className="rounded-md border p-2 font-mono text-sm">
                  {user?.id || "Not available"}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <>
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in the app</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>

                  <Button onClick={saveNotificationSettings} disabled={saving} className="w-full">
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
