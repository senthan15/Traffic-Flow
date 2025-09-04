-- Insert sample profiles with correct user_id field
INSERT INTO public.profiles (user_id, username, display_name, bio, avatar_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'john_doe', 'John Doe', 'Tech enthusiast and coffee lover ☕', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
  ('22222222-2222-2222-2222-222222222222', 'jane_smith', 'Jane Smith', 'Digital nomad exploring the world 🌍', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
  ('33333333-3333-3333-3333-333333333333', 'alex_dev', 'Alex Developer', 'Full-stack developer | React & Node.js', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
  ('44444444-4444-4444-4444-444444444444', 'sarah_design', 'Sarah Design', 'UI/UX Designer crafting beautiful experiences ✨', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face')
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample posts
INSERT INTO public.posts (id, title, body, author_id, created_at) VALUES
  ('post-1111-1111-1111-111111111111', 'Welcome to our Social Platform!', 'Hey everyone! I''m excited to be part of this new community. Looking forward to connecting with fellow developers and sharing ideas. What brings you here?', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days'),
  ('post-2222-2222-2222-222222222222', 'Remote Work Tips That Actually Work', 'After 3 years of remote work, here are my top productivity tips:

1. Set up a dedicated workspace
2. Use the Pomodoro technique
3. Take regular breaks
4. Overcommunicate with your team
5. Invest in good lighting

What are your remote work secrets?', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '1 day'),
  ('post-3333-3333-3333-333333333333', 'Just Launched My First React Native App!', 'After months of development, my weather app is finally live on both iOS and Android! 🎉

Built with:
- React Native
- TypeScript  
- Supabase for backend
- Expo for development

The journey was challenging but incredibly rewarding. Happy to answer any questions about the development process!', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '12 hours'),
  ('post-4444-4444-4444-444444444444', 'The Art of Minimalist Design', 'Less is more. This principle has guided my design philosophy for years.

Good minimalist design:
✅ Focuses on essential elements
✅ Uses plenty of white space
✅ Has clear visual hierarchy
✅ Eliminates distractions
✅ Enhances user experience

Sometimes the best design is the one you don''t notice. What are your thoughts on minimalism in design?', '44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '6 hours'),
  ('post-5555-5555-5555-555555555555', 'Learning JavaScript in 2024', 'For anyone starting their JavaScript journey, here''s my recommended learning path:

🟢 Beginner:
- Variables, functions, loops
- DOM manipulation
- Basic ES6 features

🟡 Intermediate:  
- Async/await & Promises
- Array methods (map, filter, reduce)
- Modern frameworks (React/Vue)

🔴 Advanced:
- Node.js for backend
- TypeScript
- Testing frameworks

Remember: practice is key! Build projects, not just tutorials.', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 hours');

-- Insert sample comments
INSERT INTO public.comments (id, content, author_id, post_id, created_at) VALUES
  ('comment-1111-1111-1111-111111111', 'Welcome to the community! Excited to have you here 👋', '22222222-2222-2222-2222-222222222222', 'post-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day 20 hours'),
  ('comment-2222-2222-2222-222222222', 'Great tips! I especially agree with #5 about lighting. It makes such a difference.', '33333333-3333-3333-3333-333333333333', 'post-2222-2222-2222-222222222222', NOW() - INTERVAL '20 hours'),
  ('comment-3333-3333-3333-333333333', 'Congratulations! 🎉 Would love to try your weather app. Is it available on the App Store?', '44444444-4444-4444-4444-444444444444', 'post-3333-3333-3333-333333333333', NOW() - INTERVAL '10 hours'),
  ('comment-4444-4444-4444-444444444', 'Thanks! Yes, it''s live on both stores. Search for "WeatherNow" - would love your feedback!', '33333333-3333-3333-3333-333333333333', 'post-3333-3333-3333-333333333333', NOW() - INTERVAL '9 hours'),
  ('comment-5555-5555-5555-555555555', 'I love minimalist design! Your portfolio is a perfect example of this principle.', '11111111-1111-1111-1111-111111111111', 'post-4444-4444-4444-444444444444', NOW() - INTERVAL '5 hours'),
  ('comment-6666-6666-6666-666666666', 'This roadmap is gold! Bookmarking for my junior developer friends.', '22222222-2222-2222-2222-222222222222', 'post-5555-5555-5555-555555555555', NOW() - INTERVAL '2 hours'),
  ('comment-7777-7777-7777-777777777', 'One more tip: don''t skip the fundamentals. Build a solid foundation first!', '44444444-4444-4444-4444-444444444444', 'post-5555-5555-5555-555555555555', NOW() - INTERVAL '1 hour');

-- Insert sample likes (note: likes table references profiles.id, not user_id)
INSERT INTO public.likes (id, user_id, post_id, created_at) VALUES
  ('like-1111-1111-1111-111111111111', (SELECT id FROM public.profiles WHERE user_id = '11111111-1111-1111-1111-111111111111'), 'post-2222-2222-2222-222222222222', NOW() - INTERVAL '18 hours'),
  ('like-2222-2222-2222-222222222222', (SELECT id FROM public.profiles WHERE user_id = '22222222-2222-2222-2222-222222222222'), 'post-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day 18 hours'),
  ('like-3333-3333-3333-333333333333', (SELECT id FROM public.profiles WHERE user_id = '33333333-3333-3333-3333-333333333333'), 'post-2222-2222-2222-222222222222', NOW() - INTERVAL '19 hours'),
  ('like-4444-4444-4444-444444444444', (SELECT id FROM public.profiles WHERE user_id = '44444444-4444-4444-4444-444444444444'), 'post-3333-3333-3333-333333333333', NOW() - INTERVAL '8 hours'),
  ('like-5555-5555-5555-555555555555', (SELECT id FROM public.profiles WHERE user_id = '11111111-1111-1111-1111-111111111111'), 'post-4444-4444-4444-444444444444', NOW() - INTERVAL '4 hours'),
  ('like-6666-6666-6666-666666666666', (SELECT id FROM public.profiles WHERE user_id = '22222222-2222-2222-2222-222222222222'), 'post-5555-5555-5555-555555555555', NOW() - INTERVAL '2 hours 30 minutes'),
  ('like-7777-7777-7777-777777777777', (SELECT id FROM public.profiles WHERE user_id = '33333333-3333-3333-3333-333333333333'), 'post-4444-4444-4444-444444444444', NOW() - INTERVAL '3 hours'),
  ('like-8888-8888-8888-888888888888', (SELECT id FROM public.profiles WHERE user_id = '44444444-4444-4444-4444-444444444444'), 'post-5555-5555-5555-555555555555', NOW() - INTERVAL '1 hour 15 minutes');