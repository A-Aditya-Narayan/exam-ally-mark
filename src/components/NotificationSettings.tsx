
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
import { Bell, Mail, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface NotificationSettingsType {
  email_notifications: boolean;
  exam_reminders: boolean;
  mark_updates: boolean;
}

const NotificationSettings = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettingsType>({
    email_notifications: true,
    exam_reminders: true,
    mark_updates: true,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && open) {
      fetchSettings();
    }
  }, [user, open]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          email_notifications: data.email_notifications,
          exam_reminders: data.exam_reminders,
          mark_updates: data.mark_updates,
        });
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettingsType>) => {
    setLoading(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user?.id,
          ...updatedSettings,
        });

      if (error) throw error;

      setSettings(updatedSettings);
      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error: any) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
        >
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-blue-600 text-xl">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <Bell className="w-5 h-5" />
            </div>
            Notification Settings
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Manage your email notification preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between space-x-4 p-4 bg-gray-50/50 rounded-lg border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Email Notifications
                </Label>
                <p className="text-xs text-gray-500">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) => updateSettings({ email_notifications: checked })}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between space-x-4 p-4 bg-gray-50/50 rounded-lg border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-100">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Exam Reminders
                </Label>
                <p className="text-xs text-gray-500">
                  Get notified about upcoming exams
                </p>
              </div>
            </div>
            <Switch
              checked={settings.exam_reminders}
              onCheckedChange={(checked) => updateSettings({ exam_reminders: checked })}
              disabled={loading || !settings.email_notifications}
            />
          </div>

          <div className="flex items-center justify-between space-x-4 p-4 bg-gray-50/50 rounded-lg border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-100">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Mark Updates
                </Label>
                <p className="text-xs text-gray-500">
                  Get notified when new marks are added
                </p>
              </div>
            </div>
            <Switch
              checked={settings.mark_updates}
              onCheckedChange={(checked) => updateSettings({ mark_updates: checked })}
              disabled={loading || !settings.email_notifications}
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

export default NotificationSettings;
