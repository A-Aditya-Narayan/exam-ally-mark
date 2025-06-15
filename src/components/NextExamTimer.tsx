
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { format } from 'date-fns';
import type { Exam } from '@/pages/Index';

interface NextExamTimerProps {
  nextExam: Exam | undefined;
}

const NextExamTimer = ({ nextExam }: NextExamTimerProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getDetailedTimeUntilExam = (examDate: string, examTime: string) => {
    const examDateTime = new Date(`${examDate}T${examTime}`);
    const now = currentTime;
    const totalSeconds = Math.floor((examDateTime.getTime() - now.getTime()) / 1000);

    if (totalSeconds <= 0) {
      return { display: 'Exam Started!', isNow: true, urgent: false };
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

  if (!nextExam) {
    return null;
  }

  return (
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
  );
};

export default NextExamTimer;
