
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Clock, FileText, GraduationCap, TrendingUp } from "lucide-react";
import ExamReminders from '@/components/ExamReminders';
import MarkTracker from '@/components/MarkTracker';
import AddExamDialog from '@/components/AddExamDialog';
import AddMarkDialog from '@/components/AddMarkDialog';
import { toast } from '@/hooks/use-toast';

export interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  description?: string;
}

export interface Mark {
  id: string;
  subject: string;
  examType: string;
  marks: number;
  totalMarks: number;
  date: string;
  grade?: string;
}

const Index = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exams' | 'marks'>('dashboard');

  useEffect(() => {
    // Load data from localStorage
    const savedExams = localStorage.getItem('school-exams');
    const savedMarks = localStorage.getItem('school-marks');
    
    if (savedExams) {
      setExams(JSON.parse(savedExams));
    }
    if (savedMarks) {
      setMarks(JSON.parse(savedMarks));
    }
  }, []);

  const saveExams = (newExams: Exam[]) => {
    setExams(newExams);
    localStorage.setItem('school-exams', JSON.stringify(newExams));
  };

  const saveMarks = (newMarks: Mark[]) => {
    setMarks(newMarks);
    localStorage.setItem('school-marks', JSON.stringify(newMarks));
  };

  const addExam = (exam: Omit<Exam, 'id'>) => {
    const newExam = { ...exam, id: Date.now().toString() };
    const newExams = [...exams, newExam];
    saveExams(newExams);
    toast({
      title: "Exam Added",
      description: `${exam.subject} exam has been scheduled.`,
    });
  };

  const addMark = (mark: Omit<Mark, 'id' | 'grade'>) => {
    const percentage = (mark.marks / mark.totalMarks) * 100;
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    const newMark = { ...mark, id: Date.now().toString(), grade };
    const newMarks = [...marks, newMark];
    saveMarks(newMarks);
    toast({
      title: "Mark Added",
      description: `${mark.subject} mark has been recorded.`,
    });
  };

  const upcomingExams = exams.filter(exam => new Date(exam.date) >= new Date()).length;
  const averageGrade = marks.length > 0 
    ? (marks.reduce((sum, mark) => sum + (mark.marks / mark.totalMarks * 100), 0) / marks.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-gradient-to-r from-emerald-300/20 to-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
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

        {/* Navigation */}
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
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

            {/* Quick Actions */}
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
                  <AddExamDialog onAddExam={addExam} />
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
                  <AddMarkDialog onAddMark={addMark} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <ExamReminders exams={exams} onAddExam={addExam} />
        )}

        {/* Marks Tab */}
        {activeTab === 'marks' && (
          <MarkTracker marks={marks} onAddMark={addMark} />
        )}
      </div>
    </div>
  );
};

export default Index;
