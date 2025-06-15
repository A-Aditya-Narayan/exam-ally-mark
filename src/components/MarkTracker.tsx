
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, Award } from "lucide-react";
import { format } from 'date-fns';
import AddMarkDialog from './AddMarkDialog';
import type { Mark } from '@/pages/Index';

interface MarkTrackerProps {
  marks: Mark[];
  onAddMark: (mark: Omit<Mark, 'id' | 'grade'>) => void;
}

const MarkTracker = ({ marks, onAddMark }: MarkTrackerProps) => {
  const sortedMarks = [...marks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-600';
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      case 'F': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const subjectStats = marks.reduce((acc, mark) => {
    if (!acc[mark.subject]) {
      acc[mark.subject] = { total: 0, count: 0, marks: [] };
    }
    const percentage = (mark.marks / mark.totalMarks) * 100;
    acc[mark.subject].total += percentage;
    acc[mark.subject].count += 1;
    acc[mark.subject].marks.push(percentage);
    return acc;
  }, {} as Record<string, { total: number; count: number; marks: number[] }>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Mark Tracker</h2>
        <AddMarkDialog onAddMark={onAddMark} />
      </div>

      {/* Subject Statistics */}
      {Object.keys(subjectStats).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Subject Performance
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(subjectStats).map(([subject, stats]) => {
              const average = stats.total / stats.count;
              const trend = stats.marks.length > 1 
                ? stats.marks[stats.marks.length - 1] - stats.marks[stats.marks.length - 2]
                : 0;
              
              return (
                <Card key={subject} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {subject}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-blue-600">
                        {average.toFixed(1)}%
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          {stats.count} exam{stats.count === 1 ? '' : 's'}
                        </span>
                        {trend !== 0 && (
                          <Badge className={trend > 0 ? 'bg-green-500' : 'bg-red-500'}>
                            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Marks */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-purple-600" />
          Recent Results ({marks.length})
        </h3>
        
        {marks.length === 0 ? (
          <Card className="bg-white shadow-lg">
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No marks recorded yet</p>
              <p className="text-gray-400">Add your first exam result to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedMarks.map((mark) => {
              const percentage = (mark.marks / mark.totalMarks) * 100;
              
              return (
                <Card key={mark.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          {mark.subject}
                        </CardTitle>
                        <p className="text-gray-600">{mark.examType}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getGradeColor(mark.grade!)} text-white font-bold text-lg px-3 py-1`}>
                          {mark.grade}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Score:</span>
                        <span className="font-semibold text-lg">
                          {mark.marks}/{mark.totalMarks}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{format(new Date(mark.date), 'MMM d, yyyy')}</span>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkTracker;
