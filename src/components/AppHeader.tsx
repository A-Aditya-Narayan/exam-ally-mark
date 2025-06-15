
import React from 'react';
import { GraduationCap } from "lucide-react";
import Settings from '@/components/Settings';
import LogoutButton from '@/components/LogoutButton';

const AppHeader = () => {
  return (
    <div className="text-center mb-12 relative">
      {/* Settings and Logout buttons positioned in top right of header */}
      <div className="absolute top-0 right-0 flex gap-2">
        <Settings />
        <LogoutButton />
      </div>
      
      <div className="flex justify-center items-center mb-4">
        <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
        ExamAlly
      </h1>
      <p className="text-gray-600 text-lg font-medium">Your intelligent companion for academic excellence</p>
      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
    </div>
  );
};

export default AppHeader;
