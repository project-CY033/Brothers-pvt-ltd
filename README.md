# Brothers-pvt-ltd

# SQl command 
# 1 
```sql

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    bio TEXT,
    avatar_url TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    job_title TEXT,
    company TEXT,
    interests TEXT[],
    skills TEXT[],
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create talents table
CREATE TABLE IF NOT EXISTS public.talents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    skills TEXT[] DEFAULT '{}'::text[],
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create team table
CREATE TABLE IF NOT EXISTS public.team (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT,
    social JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create messages table (for contact form)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create stats table
CREATE TABLE IF NOT EXISTS public.stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_count INTEGER DEFAULT 0,
    project_count INTEGER DEFAULT 0,
    talent_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create user_activity table to track user activities
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    activity_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    theme TEXT DEFAULT 'light',
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    privacy_level TEXT DEFAULT 'public',
    two_factor_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS) policies

-- Profiles: Users can read all profiles but only update their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view any profile" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- User Settings: Users can only access their own settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings" 
ON public.user_settings FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own settings" 
ON public.user_settings FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own settings" 
ON public.user_settings FOR INSERT 
WITH CHECK (auth.uid() = id);

-- User Activity: Users can only view their own activities
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities" 
ON public.user_activity FOR SELECT 
USING (auth.uid() = user_id);

-- Services: Anyone can view services, only admins can modify
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services" 
ON public.services FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert services" 
ON public.services FOR INSERT 
WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));


CREATE POLICY "Only admins can update services" 
ON public.services FOR UPDATE 
USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Only admins can delete services" 
ON public.services FOR DELETE 
USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

-- Set up realtime publication for all tables
BEGIN;
  -- Drop existing publication if it exists
  DROP PUBLICATION IF EXISTS supabase_realtime;
  
  -- Create a new publication for all tables
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    profiles, 
    services, 
    talents, 
    team, 
    messages, 
    stats, 
    user_activity,
    user_settings,
    newsletter_subscribers;
COMMIT;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  
  INSERT INTO public.user_settings (id)
  VALUES (new.id);
  
  INSERT INTO public.user_activity (user_id, activity_type, description)
  VALUES (new.id, 'signup', 'User created an account');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

```


# 2 Adding Notifications Column to Profiles Table
```sql

-- Add notifications column to profiles table (if it doesn't exist)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notifications JSONB DEFAULT '{
  "email_notifications": true,
  "push_notifications": true,
  "marketing_emails": false,
  "security_alerts": true
}'::jsonb;

-- Add avatar_url column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add bio column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add phone column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add location column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add website column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS website TEXT;

-- Add theme_preference column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'system';


```


# 3 Profiles Table
- The profiles table stores extended user profile information and preferences.
```sql

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR,
  avatar_url TEXT,
  bio TEXT,
  theme VARCHAR DEFAULT 'dark',
  language VARCHAR DEFAULT 'english',
  notifications JSONB DEFAULT '{"email_notifications": true, "push_notifications": true, "marketing_emails": false, "security_alerts": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


```

- ### If the notifications column in the profiles table is missing or has a different structure, you can update it with this SQL:
```sql

-- Add notifications column if missing
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notifications JSONB DEFAULT '{"email_notifications": true, "push_notifications": true, "marketing_emails": false, "security_alerts": true}'::jsonb;

-- If the column already exists but you want to update its structure:
UPDATE public.profiles
SET notifications = '{"email_notifications": true, "push_notifications": true, "marketing_emails": false, "security_alerts": true}'::jsonb
WHERE notifications IS NULL;

```




# 4 User Activities Table
- The user_activities table tracks user actions for security and activity history.
```sql
CREATE TABLE public.user_activities (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR NOT NULL,
  description TEXT,
  ip_address VARCHAR,
  user_agent VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);



```


# 5 Relationships
- Each user in the auth.users table has one associated record in the profiles table
-Each user can have many activities recorded in the user_activities table
- Row Level Security Policies

```sql

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to read/write only their own data
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own activities"
  ON public.user_activities
  FOR SELECT
  USING (auth.uid() = user_id);

```



# 6 Database Functions and Triggers 
```sql
-- Create trigger to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_user();

```

# 7
```sql



```

