
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText } from "lucide-react";
import AddExamDialog from '@/components/AddExamDialog';
import AddMarkDialog from '@/components/AddMarkDialog';
import { Exam, Mark } from '@/pages/Index';

interface QuickActionsProps {
  onAddExam: (exam: Omit<Exam, 'id'>) => void;
  onAddMark: (mark: Omit<Mark, 'id' | 'grade'>) => void;
}

const QuickActions = ({ onAddExam, onAddMark }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border border-white/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center text-blue-600">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <Calendar className="w-5 h-5" />
            </div>
            Quick Add Exam
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-gray-600 mb-6">Schedule a new exam reminder with all the important details</p>
          <AddExamDialog onAddExam={onAddExam} />
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border border-white/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center text-green-600">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <FileText className="w-5 h-5" />
            </div>
            Record Marks
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-gray-600 mb-6">Add your latest exam results and track your progress</p>
          <AddMarkDialog onAddMark={onAddMark} />
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
