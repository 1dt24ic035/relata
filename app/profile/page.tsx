"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="border-b border-gray-800 bg-zinc-950">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-5">

          <Link href="/dashboard">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Relata
            </h1>
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-700 px-5 py-2 hover:bg-white hover:text-black transition"
          >
            Logout
          </button>

        </div>
      </header>


      <section className="max-w-5xl mx-auto px-6 py-12">

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">

          <div className="flex items-center gap-6">

            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="h-24 w-24 rounded-full"
            />

            <div>
              <h2 className="text-3xl font-bold">
                {user.user_metadata.full_name}
              </h2>

              <p className="text-gray-400 mt-2">
                {user.email}
              </p>
            </div>

          </div>


          <div className="mt-10 border-t border-gray-800 pt-8">

            <h3 className="text-xl font-semibold">
              My Relata Journey
            </h3>

            <p className="text-gray-400 mt-3">
              Your shared experiences, contributions, and profile details will appear here.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}