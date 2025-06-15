
import React from 'react';
import { GraduationCap } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';
import Settings from '@/components/Settings';
import EmailVerification from '@/components/EmailVerification';
import NotificationSettings from '@/components/NotificationSettings';

const AppHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            ExamAlly
          </h1>
          <p className="text-gray-600 text-lg">Your ultimate exam companion</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <EmailVerification />
        <NotificationSettings />
        <Settings />
        <LogoutButton />
      </div>
    </div>
  );
};

export default AppHeader;
