
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Sparkles } from "lucide-react";
import type { Exam } from '@/pages/Index';

interface AddExamDialogProps {
  onAddExam: (exam: Omit<Exam, 'id'>) => void;
}

const AddExamDialog = ({ onAddExam }: AddExamDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.date || !formData.time || !formData.location) {
      return;
    }

    onAddExam(formData);
    setFormData({
      subject: '',
      date: '',
      time: '',
      location: '',
      description: ''
    });
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Add Exam
          <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-blue-600 text-xl">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <Calendar className="w-5 h-5" />
            </div>
            Schedule New Exam
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Add a new exam to your schedule with all the important details.
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
              className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold text-gray-700">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-semibold text-gray-700">Time *</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold text-gray-700">Location *</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Room 101, Main Hall, Library"
              className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Notes (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional notes or reminders..."
              rows={3}
              className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
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
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Add Exam
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExamDialog;
