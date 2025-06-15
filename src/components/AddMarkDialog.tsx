
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
import { FileText, Plus } from "lucide-react";
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
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Mark
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-600">
            <FileText className="w-5 h-5 mr-2" />
            Record Exam Result
          </DialogTitle>
          <DialogDescription>
            Add your exam marks to track your academic performance.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Mathematics, Physics, History"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="examType">Exam Type *</Label>
            <Select onValueChange={(value) => handleSelectChange('examType', value)} value={formData.examType}>
              <SelectTrigger>
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
              <Label htmlFor="marks">Marks Obtained *</Label>
              <Input
                id="marks"
                name="marks"
                type="number"
                min="0"
                value={formData.marks}
                onChange={handleChange}
                placeholder="85"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks *</Label>
              <Input
                id="totalMarks"
                name="totalMarks"
                type="number"
                min="1"
                value={formData.totalMarks}
                onChange={handleChange}
                placeholder="100"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Exam Date *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Mark
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMarkDialog;
