"use client";

import Link from "next/link";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black px-6">

      {/* Back to Relata */}
      <Link
        href="/"
        className="absolute left-6 top-6 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 backdrop-blur-xl transition hover:border-purple-500/40 hover:bg-white/10 hover:text-white"
      >
        ← Back to Relata
      </Link>

      <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-zinc-900 p-10 text-center shadow-2xl shadow-purple-900/10">

        <h1 className="text-3xl font-bold text-white">
          Welcome to Relata
        </h1>

        <p className="mt-3 text-gray-400">
          Continue with Google to explore real experiences.
        </p>

        <div className="mt-8">
          <GoogleLoginButton />
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-gray-500 transition hover:text-white"
        >
          Return to landing page
        </Link>

      </div>
    </main>
  );
}