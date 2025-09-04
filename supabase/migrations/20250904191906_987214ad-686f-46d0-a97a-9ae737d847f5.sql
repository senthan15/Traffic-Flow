-- Update existing profiles table to match social platform requirements
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;

-- Create the 'posts' table for user-generated content
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable RLS on the 'posts' table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies for the 'posts' table
CREATE POLICY "Everyone can see posts"
  ON public.posts AS PERMISSIVE FOR SELECT TO public USING (true);

CREATE POLICY "Only logged in users can create posts"
  ON public.posts AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Only the author can edit"
  ON public.posts AS PERMISSIVE FOR UPDATE TO public USING ((auth.uid() = author_id)) WITH CHECK ((auth.uid() = author_id));

CREATE POLICY "Only the author can delete"
  ON public.posts AS PERMISSIVE FOR DELETE TO public USING (auth.uid() = author_id);

-- Create the 'comments' table for post comments
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL
);

-- Enable RLS on the 'comments' table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for the 'comments' table
CREATE POLICY "Everyone can see comments"
  ON public.comments AS PERMISSIVE FOR SELECT TO public USING (true);

CREATE POLICY "Only logged in users can create comments"
  ON public.comments AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Only the author can edit comments"
  ON public.comments AS PERMISSIVE FOR UPDATE TO public USING ((auth.uid() = author_id)) WITH CHECK ((auth.uid() = author_id));

CREATE POLICY "Only the author can delete comments"
  ON public.comments AS PERMISSIVE FOR DELETE TO public USING (auth.uid() = author_id);

-- Create the 'likes' table as a join table for many-to-many relationship
CREATE TABLE public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, post_id)  -- Prevent duplicate likes
);

-- Enable RLS on the 'likes' table
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create policies for the 'likes' table
CREATE POLICY "Authenticated users can insert their own likes"
  ON public.likes AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authenticated users can delete their own likes"
  ON public.likes AS PERMISSIVE FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can select likes"
  ON public.likes AS PERMISSIVE FOR SELECT TO authenticated USING (true);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', false);

-- Create storage policies for avatars
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view their own avatar"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);