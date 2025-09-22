// src/components/settings-panel.tsx
'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';

export default function SettingsPanel() {
  return (
    <div className="flex h-full flex-col">
       <header className="flex items-center justify-between border-b p-4 sm:px-6">
        <div>
          <h1 className="font-headline text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences.
          </p>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize the look and feel of the application.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="theme" className="font-semibold">Theme</Label>
                         <Select defaultValue="dark">
                            <SelectTrigger id="theme" className="w-48">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                        Manage how you receive notifications.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="flex items-center justify-between">
                        <Label htmlFor="in-app-notifications">
                            <span className="font-semibold">In-App Notifications</span>
                            <p className="text-sm text-muted-foreground">Show notifications within the application.</p>
                        </Label>
                        <Switch id="in-app-notifications" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">
                             <span className="font-semibold">Email Notifications</span>
                            <p className="text-sm text-muted-foreground">Receive notifications via email for summaries.</p>
                        </Label>
                        <Switch id="email-notifications" disabled />
                    </div>
                </CardContent>
            </Card>
             <div className="flex justify-end">
                <Button>Save Preferences</Button>
            </div>
        </div>
      </main>
    </div>
  );
}
