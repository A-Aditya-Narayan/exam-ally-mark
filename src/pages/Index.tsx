
import React, { useState, useEffect } from 'react';
import ExamReminders from '@/components/ExamReminders';
import MarkTracker from '@/components/MarkTracker';
import AppHeader from '@/components/AppHeader';
import AppNavigation from '@/components/AppNavigation';
import DashboardContent from '@/components/DashboardContent';

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
    loadLocalData();
  }, []);

  const loadLocalData = () => {
    // Load exams from localStorage
    const savedExams = localStorage.getItem('school-exams');
    if (savedExams) {
      setExams(JSON.parse(savedExams));
    }

    // Load marks from localStorage
    const savedMarks = localStorage.getItem('school-marks');
    if (savedMarks) {
      setMarks(JSON.parse(savedMarks));
    }
  };

  const addExam = (exam: Omit<Exam, 'id'>) => {
    const newExam = {
      ...exam,
      id: Date.now().toString()
    };
    
    const updatedExams = [...exams, newExam];
    setExams(updatedExams);
    localStorage.setItem('school-exams', JSON.stringify(updatedExams));
  };

  const addMark = (mark: Omit<Mark, 'id' | 'grade'>) => {
    const percentage = (mark.marks / mark.totalMarks) * 100;
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    const newMark = {
      ...mark,
      id: Date.now().toString(),
      grade
    };
    
    const updatedMarks = [...marks, newMark];
    setMarks(updatedMarks);
    localStorage.setItem('school-marks', JSON.stringify(updatedMarks));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-gradient-to-r from-emerald-300/20 to-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto p-6 relative z-10">
        <AppHeader />
        <AppNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <DashboardContent 
            exams={exams} 
            marks={marks} 
            onAddExam={addExam} 
            onAddMark={addMark} 
          />
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
