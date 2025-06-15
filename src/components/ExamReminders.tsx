
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, School, Timer } from "lucide-react";
import { format, differenceInDays, differenceInHours } from 'date-fns';
import AddExamDialog from './AddExamDialog';
import type { Exam } from '@/pages/Index';

interface ExamRemindersProps {
  exams: Exam[];
  onAddExam: (exam: Omit<Exam, 'id'>) => void;
}

const ExamReminders = ({ exams, onAddExam }: ExamRemindersProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcomingExams = sortedExams.filter(exam => new Date(exam.date) >= new Date());
  const pastExams = sortedExams.filter(exam => new Date(exam.date) < new Date());
  const nextExam = upcomingExams[0];

  const getDetailedTimeUntilExam = (examDate: string, examTime: string) => {
    const examDateTime = new Date(`${examDate}T${examTime}`);
    const now = currentTime;
    const totalSeconds = Math.floor((examDateTime.getTime() - now.getTime()) / 1000);

    if (totalSeconds <= 0) {
      return { display: 'Exam Started!', isNow: true };
    }

    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return { 
        display: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        isNow: false,
        urgent: days <= 1
      };
    } else if (hours > 0) {
      return { 
        display: `${hours}h ${minutes}m ${seconds}s`,
        isNow: false,
        urgent: true
      };
    } else {
      return { 
        display: `${minutes}m ${seconds}s`,
        isNow: false,
        urgent: true
      };
    }
  };

  const getTimeUntilExam = (examDate: string, examTime: string) => {
    const examDateTime = new Date(`${examDate}T${examTime}`);
    const now = new Date();
    const days = differenceInDays(examDateTime, now);
    const hours = differenceInHours(examDateTime, now) % 24;

    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'}`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else {
      return 'Today';
    }
  };

  const getUrgencyColor = (examDate: string) => {
    const days = differenceInDays(new Date(examDate), new Date());
    if (days <= 1) return 'bg-red-500';
    if (days <= 3) return 'bg-orange-500';
    if (days <= 7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Exam Reminders</h2>
        <AddExamDialog onAddExam={onAddExam} />
      </div>

      {/* Live Timer for Next Exam */}
      {nextExam && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <Timer className="w-6 h-6 mr-3" />
              Next Exam: {nextExam.subject}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">
                  {format(new Date(nextExam.date), 'EEEE, MMMM d, yyyy')} at {nextExam.time}
                </p>
                <p className="text-blue-100 text-sm">{nextExam.location}</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getDetailedTimeUntilExam(nextExam.date, nextExam.time).urgent ? 'animate-pulse' : ''}`}>
                  {getDetailedTimeUntilExam(nextExam.date, nextExam.time).display}
                </div>
                <p className="text-blue-100 text-sm">remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Exams */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Upcoming Exams ({upcomingExams.length})
        </h3>
        
        {upcomingExams.length === 0 ? (
          <Card className="bg-white shadow-lg">
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No upcoming exams scheduled</p>
              <p className="text-gray-400">Add your first exam to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcomingExams.map((exam) => (
              <Card key={exam.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {exam.subject}
                    </CardTitle>
                    <Badge className={`${getUrgencyColor(exam.date)} text-white font-medium`}>
                      {getTimeUntilExam(exam.date, exam.time)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{format(new Date(exam.date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{exam.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <School className="w-4 h-4 mr-2" />
                      <span>{exam.location}</span>
                    </div>
                    {exam.description && (
                      <p className="text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">
                        {exam.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Exams */}
      {pastExams.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-600" />
            Past Exams ({pastExams.length})
          </h3>
          
          <div className="grid gap-4">
            {pastExams.slice(0, 5).map((exam) => (
              <Card key={exam.id} className="bg-gray-50 shadow-md border-l-4 border-gray-400">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-600">
                    {exam.subject}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{format(new Date(exam.date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{exam.time}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <School className="w-4 h-4 mr-2" />
                      <span>{exam.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamReminders;
