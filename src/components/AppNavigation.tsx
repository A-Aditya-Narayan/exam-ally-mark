
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, FileText } from "lucide-react";

interface AppNavigationProps {
  activeTab: 'dashboard' | 'exams' | 'marks';
  setActiveTab: (tab: 'dashboard' | 'exams' | 'marks') => void;
}

const AppNavigation = ({ activeTab, setActiveTab }: AppNavigationProps) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-xl border border-white/20">
        <Button
          variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('dashboard')}
          className={`mx-1 rounded-xl transition-all duration-300 ${
            activeTab === 'dashboard' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105' 
              : 'hover:bg-gray-100 hover:scale-105'
          }`}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <Button
          variant={activeTab === 'exams' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('exams')}
          className={`mx-1 rounded-xl transition-all duration-300 ${
            activeTab === 'exams' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105' 
              : 'hover:bg-gray-100 hover:scale-105'
          }`}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Exams
        </Button>
        <Button
          variant={activeTab === 'marks' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('marks')}
          className={`mx-1 rounded-xl transition-all duration-300 ${
            activeTab === 'marks' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105' 
              : 'hover:bg-gray-100 hover:scale-105'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Marks
        </Button>
      </div>
    </div>
  );
};

export default AppNavigation;
