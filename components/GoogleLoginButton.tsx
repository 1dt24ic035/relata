"use client";

import { supabase } from "../lib/supabase";

export default function GoogleLoginButton() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="w-full rounded-xl bg-white text-black py-3 font-semibold hover:bg-gray-200 transition"
    >
      Continue with Google
    </button>
  );
}