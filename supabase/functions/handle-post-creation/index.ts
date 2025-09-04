import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Get the user from the JWT provided in the request headers
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const { title, body } = await req.json();

    // Custom validation logic
    if (!title || title.length < 5) {
      return new Response(
        JSON.stringify({ error: "Title must be at least 5 characters." }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!body || body.length < 10) {
      return new Response(
        JSON.stringify({ error: "Post body must be at least 10 characters." }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check for profanity or inappropriate content (basic example)
    const inappropriateWords = ['spam', 'scam', 'fake'];
    const contentToCheck = (title + ' ' + body).toLowerCase();
    const hasInappropriateContent = inappropriateWords.some(word => 
      contentToCheck.includes(word)
    );

    if (hasInappropriateContent) {
      return new Response(
        JSON.stringify({ error: "Content contains inappropriate language." }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Insert the post into the database
    const { data, error } = await supabaseClient
      .from('posts')
      .insert([
        { title, body, author_id: user.id }
      ])
      .select();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: error.message }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Post created successfully by user ${user.id}:`, data[0]);

    return new Response(
      JSON.stringify({ 
        message: "Post created successfully!", 
        data: data[0] 
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});