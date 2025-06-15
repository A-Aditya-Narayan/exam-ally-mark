
import React from 'react';
import DashboardStats from '@/components/DashboardStats';
import QuickActions from '@/components/QuickActions';
import { Exam, Mark } from '@/pages/Index';

interface DashboardContentProps {
  exams: Exam[];
  marks: Mark[];
  onAddExam: (exam: Omit<Exam, 'id'>) => void;
  onAddMark: (mark: Omit<Mark, 'id' | 'grade'>) => void;
}

const DashboardContent = ({ exams, marks, onAddExam, onAddMark }: DashboardContentProps) => {
  return (
    <div className="space-y-8">
      <DashboardStats exams={exams} marks={marks} />
      <QuickActions onAddExam={onAddExam} onAddMark={onAddMark} />
    </div>
  );
};

export default DashboardContent;
