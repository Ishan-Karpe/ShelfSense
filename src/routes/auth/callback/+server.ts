import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error);
    throw redirect(303, "/login?error=oauth_failed");
  }

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error("Code exchange error:", exchangeError);
      throw redirect(303, "/login?error=exchange_failed");
    }
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Session error:", sessionError);
    throw redirect(303, "/login?error=session_failed");
  }

  if (sessionData.session) {
    console.log("User signed in:", sessionData.session.user.email);
    throw redirect(303, "/private/dashboard");
  }

  // If no session found, redirect back to login
  throw redirect(303, "/login?error=no_session");
};