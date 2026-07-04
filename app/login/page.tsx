"use client";

import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-zinc-900 p-10 text-center">

        <h1 className="text-3xl font-bold text-white">
          Welcome to Relata
        </h1>

        <p className="mt-3 text-gray-400">
          Continue with Google to explore real experiences.
        </p>

        <div className="mt-8">
          <GoogleLoginButton />
        </div>

      </div>
    </main>
  );
}