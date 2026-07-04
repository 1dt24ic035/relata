"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import UserCard from "@/components/UserCard";
import { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <header className="border-b border-gray-800 bg-zinc-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Relata
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-700 px-5 py-2 hover:bg-white hover:text-black transition"
          >
            Logout
          </button>

        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">

        <UserCard user={user} />

        <div className="mt-10">
          <input
            type="text"
            placeholder="🔍 Search experiences..."
            className="w-full rounded-2xl border border-gray-800 bg-zinc-900 px-6 py-4 outline-none focus:border-purple-500"
          />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">
            <h3 className="text-2xl font-bold">
              ✍️ Share an Experience
            </h3>

            <p className="mt-3 text-gray-400">
              Help others by sharing what you've learned.
            </p>

            <button className="mt-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold hover:scale-105 transition">
              Create Experience
            </button>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">
            <h3 className="text-2xl font-bold">
              📚 Browse Experiences
            </h3>

            <p className="mt-3 text-gray-400">
              Explore authentic experiences from the community.
            </p>

            <button className="mt-6 rounded-xl border border-gray-700 px-6 py-3 hover:bg-white hover:text-black transition">
              Explore
            </button>
          </div>

        </div>

      </div>

    </main>
  );
}