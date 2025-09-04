-- Enable leaked password protection for better security
UPDATE auth.config SET 
  password_requirements = jsonb_set(
    COALESCE(password_requirements, '{}'::jsonb),
    '{breach_check}',
    'true'::jsonb
  );