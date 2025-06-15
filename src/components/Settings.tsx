
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
import { Settings as SettingsIcon, Bell, BellOff, LogOut, Download } from "lucide-react";
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

  const handleDownloadWebsite = () => {
    toast({
      title: "Download Started",
      description: "Preparing website files for download...",
    });

    // Create a simple HTML file with the current data
    const exams = JSON.parse(localStorage.getItem('school-exams') || '[]');
    const marks = JSON.parse(localStorage.getItem('school-marks') || '[]');
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ExamAlly - My Data</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .section { margin: 30px 0; }
        .exam, .mark { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px; }
        h1 { color: #2563eb; }
        h2 { color: #1e40af; }
        .grade { font-weight: bold; color: #059669; }
    </style>
</head>
<body>
    <h1>ExamAlly - My Academic Data</h1>
    
    <div class="section">
        <h2>Upcoming Exams</h2>
        ${exams.length === 0 ? '<p>No exams scheduled.</p>' : 
          exams.map(exam => `
            <div class="exam">
                <h3>${exam.subject}</h3>
                <p><strong>Date:</strong> ${exam.date}</p>
                <p><strong>Time:</strong> ${exam.time}</p>
                <p><strong>Location:</strong> ${exam.location}</p>
                ${exam.description ? `<p><strong>Description:</strong> ${exam.description}</p>` : ''}
            </div>
          `).join('')
        }
    </div>

    <div class="section">
        <h2>Academic Records</h2>
        ${marks.length === 0 ? '<p>No marks recorded.</p>' : 
          marks.map(mark => `
            <div class="mark">
                <h3>${mark.subject} - ${mark.examType}</h3>
                <p><strong>Score:</strong> ${mark.marks}/${mark.totalMarks}</p>
                <p><strong>Percentage:</strong> ${Math.round((mark.marks / mark.totalMarks) * 100)}%</p>
                <p><strong>Grade:</strong> <span class="grade">${mark.grade}</span></p>
                <p><strong>Date:</strong> ${mark.date}</p>
            </div>
          `).join('')
        }
    </div>

    <footer style="margin-top: 50px; text-align: center; color: #666;">
        <p>Generated from ExamAlly on ${new Date().toLocaleDateString()}</p>
    </footer>
</body>
</html>`;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'examally-data.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Your ExamAlly data has been downloaded as an HTML file.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    window.location.href = '/auth';
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

          <div className="flex items-center justify-between space-x-4 p-4 bg-gray-50/50 rounded-lg border border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-100">
                <Download className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Download Data
                </Label>
                <p className="text-xs text-gray-500">
                  Export your exams and marks as HTML
                </p>
              </div>
            </div>
            <Button 
              onClick={handleDownloadWebsite}
              variant="outline"
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="border-t pt-4">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
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
