
import React from 'react';
import DashboardStats from '@/components/DashboardStats';
import QuickActions from '@/components/QuickActions';
import { Exam, Mark } from '@/pages/Index';
import NextExamTimer from './NextExamTimer';

interface DashboardContentProps {
  exams: Exam[];
  marks: Mark[];
  onAddExam: (exam: Omit<Exam, 'id'>) => void;
  onAddMark: (mark: Omit<Mark, 'id' | 'grade'>) => void;
}

const DashboardContent = ({ exams, marks, onAddExam, onAddMark }: DashboardContentProps) => {
  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcomingExams = sortedExams.filter(exam => new Date(exam.date) >= new Date());
  const nextExam = upcomingExams[0];

  return (
    <div className="space-y-8">
      <NextExamTimer nextExam={nextExam} />
      <DashboardStats exams={exams} marks={marks} />
      <QuickActions onAddExam={onAddExam} onAddMark={onAddMark} />
    </div>
  );
};

export default DashboardContent;
