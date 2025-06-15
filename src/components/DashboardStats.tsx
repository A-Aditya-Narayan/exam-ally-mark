
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, BookOpen } from "lucide-react";
import { Exam, Mark } from '@/pages/Index';

interface DashboardStatsProps {
  exams: Exam[];
  marks: Mark[];
}

const DashboardStats = ({ exams, marks }: DashboardStatsProps) => {
  const upcomingExams = exams.filter(exam => new Date(exam.date) >= new Date()).length;
  const averageGrade = marks.length > 0 
    ? (marks.reduce((sum, mark) => sum + (mark.marks / mark.totalMarks * 100), 0) / marks.length).toFixed(1)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-lg font-medium flex items-center">
            <div className="p-2 rounded-full bg-white/20 mr-3">
              <Calendar className="w-5 h-5" />
            </div>
            Upcoming Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-bold mb-2">{upcomingExams}</div>
          <p className="text-blue-100">exams scheduled</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-lg font-medium flex items-center">
            <div className="p-2 rounded-full bg-white/20 mr-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            Average Grade
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-bold mb-2">{averageGrade}%</div>
          <p className="text-green-100">overall performance</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-lg font-medium flex items-center">
            <div className="p-2 rounded-full bg-white/20 mr-3">
              <BookOpen className="w-5 h-5" />
            </div>
            Total Subjects
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-bold mb-2">
            {new Set([...exams.map(e => e.subject), ...marks.map(m => m.subject)]).size}
          </div>
          <p className="text-purple-100">subjects tracked</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
