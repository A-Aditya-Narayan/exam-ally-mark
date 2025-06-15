
import React, { useState, useEffect } from 'react';
import ExamReminders from '@/components/ExamReminders';
import MarkTracker from '@/components/MarkTracker';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AppHeader from '@/components/AppHeader';
import AppNavigation from '@/components/AppNavigation';
import DashboardContent from '@/components/DashboardContent';
import { useNotifications } from '@/hooks/useNotifications';

export interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  user_id?: string;
}

export interface Mark {
  id: string;
  subject: string;
  examType: string;
  marks: number;
  totalMarks: number;
  date: string;
  grade?: string;
  user_id?: string;
}

const Index = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exams' | 'marks'>('dashboard');
  const { user } = useAuth();
  const { sendExamReminderEmail, sendMarkUpdateEmail, checkNotificationSettings, getVerifiedEmail } = useNotifications();

  useEffect(() => {
    if (user) {
      fetchExams();
      fetchMarks();
    }
  }, [user]);

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Map database fields to component interface
      const mappedExams = (data || []).map(exam => ({
        id: exam.id,
        subject: exam.subject,
        date: exam.date,
        time: exam.time,
        location: exam.location,
        description: exam.description,
        user_id: exam.user_id
      }));
      
      setExams(mappedExams);
    } catch (error) {
      console.error('Error fetching exams:', error);
      // Fallback to localStorage for existing data
      const savedExams = localStorage.getItem('school-exams');
      if (savedExams) {
        setExams(JSON.parse(savedExams));
      }
    }
  };

  const fetchMarks = async () => {
    try {
      const { data, error } = await supabase
        .from('marks')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Map database fields to component interface
      const mappedMarks = (data || []).map(mark => ({
        id: mark.id,
        subject: mark.subject,
        examType: mark.exam_type,
        marks: mark.marks,
        totalMarks: mark.total_marks,
        date: mark.date,
        grade: mark.grade,
        user_id: mark.user_id
      }));
      
      setMarks(mappedMarks);
    } catch (error) {
      console.error('Error fetching marks:', error);
      // Fallback to localStorage for existing data
      const savedMarks = localStorage.getItem('school-marks');
      if (savedMarks) {
        setMarks(JSON.parse(savedMarks));
      }
    }
  };

  const addExam = async (exam: Omit<Exam, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .insert([{ 
          subject: exam.subject,
          date: exam.date,
          time: exam.time,
          location: exam.location,
          description: exam.description,
          user_id: user?.id 
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Map the response back to the component interface
      const mappedExam = {
        id: data.id,
        subject: data.subject,
        date: data.date,
        time: data.time,
        location: data.location,
        description: data.description,
        user_id: data.user_id
      };
      
      setExams(prev => [...prev, mappedExam]);
      
      // Send email notification if enabled
      const settings = await checkNotificationSettings();
      const verifiedEmail = await getVerifiedEmail();
      
      if (settings?.email_notifications && settings?.exam_reminders && verifiedEmail) {
        await sendExamReminderEmail(mappedExam, verifiedEmail);
      }
      
      toast({
        title: "Exam Added",
        description: `${exam.subject} exam has been scheduled.`,
      });
    } catch (error) {
      console.error('Error adding exam:', error);
      toast({
        title: "Error",
        description: "Failed to add exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addMark = async (mark: Omit<Mark, 'id' | 'grade'>) => {
    const percentage = (mark.marks / mark.totalMarks) * 100;
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    try {
      const { data, error } = await supabase
        .from('marks')
        .insert([{ 
          subject: mark.subject,
          exam_type: mark.examType,
          marks: mark.marks,
          total_marks: mark.totalMarks,
          date: mark.date,
          grade,
          user_id: user?.id 
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Map the response back to the component interface
      const mappedMark = {
        id: data.id,
        subject: data.subject,
        examType: data.exam_type,
        marks: data.marks,
        totalMarks: data.total_marks,
        date: data.date,
        grade: data.grade,
        user_id: data.user_id
      };
      
      setMarks(prev => [...prev, mappedMark]);
      
      // Send email notification if enabled
      const settings = await checkNotificationSettings();
      const verifiedEmail = await getVerifiedEmail();
      
      if (settings?.email_notifications && settings?.mark_updates && verifiedEmail) {
        await sendMarkUpdateEmail(mappedMark, verifiedEmail);
      }
      
      toast({
        title: "Mark Added",
        description: `${mark.subject} mark has been recorded.`,
      });
    } catch (error) {
      console.error('Error adding mark:', error);
      toast({
        title: "Error",
        description: "Failed to add mark. Please try again.",
        variant: "destructive",
      });
    }
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
