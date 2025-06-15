
-- Create a profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing exams table to include user_id (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'exams') THEN
    ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    
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
  END IF;
END $$;

-- Update existing marks table to include user_id (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'marks') THEN
    ALTER TABLE public.marks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    
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
  END IF;
END $$;
