
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Clock, FileText } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ExamAlly
          </h1>
          <p className="text-gray-600">Your personal exam reminder and mark tracker</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('dashboard')}
              className="mx-1"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'exams' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('exams')}
              className="mx-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Exams
            </Button>
            <Button
              variant={activeTab === 'marks' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('marks')}
              className="mx-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              Marks
            </Button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Upcoming Exams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{upcomingExams}</div>
                  <p className="text-blue-100">exams scheduled</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Average Grade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{averageGrade}%</div>
                  <p className="text-green-100">overall performance</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Total Subjects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {new Set([...exams.map(e => e.subject), ...marks.map(m => m.subject)]).size}
                  </div>
                  <p className="text-purple-100">subjects tracked</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    Quick Add Exam
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Schedule a new exam reminder</p>
                  <AddExamDialog onAddExam={addExam} />
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <FileText className="w-5 h-5 mr-2" />
                    Record Marks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Add your latest exam results</p>
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
