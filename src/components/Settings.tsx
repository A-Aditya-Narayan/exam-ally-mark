
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Bell, BellOff } from "lucide-react";
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const [open, setOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // Load notification preference from localStorage
    const savedNotificationSetting = localStorage.getItem('exam-notifications-enabled');
    if (savedNotificationSetting !== null) {
      setNotificationsEnabled(JSON.parse(savedNotificationSetting));
    }
  }, []);

  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    localStorage.setItem('exam-notifications-enabled', JSON.stringify(checked));
    
    toast({
      title: checked ? "Notifications Enabled" : "Notifications Disabled",
      description: checked 
        ? "You will receive exam reminders and updates." 
        : "You won't receive any notifications.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
        >
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-blue-600 text-xl">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <SettingsIcon className="w-5 h-5" />
            </div>
            Settings
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Customize your ExamAlly experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between space-x-4 p-4 bg-gray-50/50 rounded-lg border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                {notificationsEnabled ? (
                  <Bell className="w-4 h-4 text-blue-600" />
                ) : (
                  <BellOff className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div>
                <Label htmlFor="notifications" className="text-sm font-semibold text-gray-700">
                  Notifications
                </Label>
                <p className="text-xs text-gray-500">
                  Receive reminders about upcoming exams
                </p>
              </div>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
            />
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={() => setOpen(false)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
