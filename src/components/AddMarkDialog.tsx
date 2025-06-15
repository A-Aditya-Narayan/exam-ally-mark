
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Trophy } from "lucide-react";
import type { Mark } from '@/pages/Index';

interface AddMarkDialogProps {
  onAddMark: (mark: Omit<Mark, 'id' | 'grade'>) => void;
}

const AddMarkDialog = ({ onAddMark }: AddMarkDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    examType: '',
    marks: '',
    totalMarks: '',
    date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.examType || !formData.marks || !formData.totalMarks || !formData.date) {
      return;
    }

    onAddMark({
      subject: formData.subject,
      examType: formData.examType,
      marks: parseInt(formData.marks),
      totalMarks: parseInt(formData.totalMarks),
      date: formData.date
    });
    
    setFormData({
      subject: '',
      examType: '',
      marks: '',
      totalMarks: '',
      date: ''
    });
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Add Mark
          <Trophy className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-600 text-xl">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <FileText className="w-5 h-5" />
            </div>
            Record Exam Result
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Add your exam marks to track your academic performance.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject *</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Mathematics, Physics, History"
              className="rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="examType" className="text-sm font-semibold text-gray-700">Exam Type *</Label>
            <Select onValueChange={(value) => handleSelectChange('examType', value)} value={formData.examType}>
              <SelectTrigger className="rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500/20">
                <SelectValue placeholder="Select exam type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="midterm">Midterm Exam</SelectItem>
                <SelectItem value="final">Final Exam</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="test">Unit Test</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="practical">Practical Exam</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marks" className="text-sm font-semibold text-gray-700">Marks Obtained *</Label>
              <Input
                id="marks"
                name="marks"
                type="number"
                min="0"
                value={formData.marks}
                onChange={handleChange}
                placeholder="85"
                className="rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalMarks" className="text-sm font-semibold text-gray-700">Total Marks *</Label>
              <Input
                id="totalMarks"
                name="totalMarks"
                type="number"
                min="1"
                value={formData.totalMarks}
                onChange={handleChange}
                placeholder="100"
                className="rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-semibold text-gray-700">Exam Date *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500/20"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="rounded-lg border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Add Mark
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMarkDialog;
