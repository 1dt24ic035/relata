"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import UserCard from "@/components/UserCard";
import ExperienceCard from "@/components/ExperienceCard";
import { User } from "@supabase/supabase-js";

type Experience = {
  id: string;
  title: string;
  category: string;
  story: string;
  created_at: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);

    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setExperiences(data);
    }
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
    <main className="min-h-screen bg-red-600 text-white">

      <header className="border-b border-gray-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">

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

      <div className="max-w-7xl mx-auto px-6 py-12">

        <UserCard user={user} />

        <div className="mt-10">
          <input
            placeholder="🔍 Search experiences..."
            className="w-full rounded-2xl border border-gray-800 bg-zinc-900 px-6 py-4 outline-none focus:border-purple-500"
          />
        </div>

        <div className="mt-10">

          <Link href="/create">
            <button className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold hover:scale-105 transition">
              ✍️ Create Experience
            </button>
          </Link>

        </div>

        <section className="mt-14">

          <h2 className="text-3xl font-bold mb-8">
            Recent Experiences
          </h2>

          {experiences.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-700 p-12 text-center text-gray-500">
              No experiences yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {experiences.map((experience) => (
  <div key={experience.id}>
    <p className="text-green-400 text-xs mb-2">
      {experience.id}
    </p>

    <ExperienceCard experience={experience} />
  </div>
))}
            </div>
          )}

        </section>

      </div>

    </main>
  );
}