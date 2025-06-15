
-- Create exams table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create marks table
CREATE TABLE IF NOT EXISTS public.marks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  marks INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  date DATE NOT NULL,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on exams table
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- Create policies for exams
CREATE POLICY "Users can view their own exams" 
  ON public.exams 
  FOR SELECT 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own exams" 
  ON public.exams 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own exams" 
  ON public.exams 
  FOR UPDATE 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own exams" 
  ON public.exams 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on marks table
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;

-- Create policies for marks
CREATE POLICY "Users can view their own marks" 
  ON public.marks 
  FOR SELECT 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own marks" 
  ON public.marks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own marks" 
  ON public.marks 
  FOR UPDATE 
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own marks" 
  ON public.marks 
  FOR DELETE 
  USING (auth.uid() = user_id);
