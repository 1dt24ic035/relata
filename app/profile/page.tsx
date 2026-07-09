"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Experience = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

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

    const { data, error } = await supabase
      .from("experiences")
      .select("id, title, category, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setExperiences(data);
    }

    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading profile...
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="border-b border-gray-800 bg-zinc-950">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-5">

          <Link href="/dashboard">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer">
              Relata
            </h1>
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-700 px-5 py-2 transition hover:bg-white hover:text-black"
          >
            Logout
          </button>

        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">

          <div className="flex items-center gap-6">

            {user.user_metadata.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="h-24 w-24 rounded-full"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-600 text-4xl font-bold">
                {user.user_metadata.full_name?.charAt(0) ??
                  user.email?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <div>
              <h2 className="text-3xl font-bold">
                {user.user_metadata.full_name}
              </h2>

              <p className="mt-2 text-gray-400">
                {user.email}
              </p>
            </div>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-gray-800 bg-black/30 p-6">
              <p className="text-gray-400 text-sm">
                Total Experiences
              </p>

              <h3 className="mt-2 text-4xl font-bold text-purple-400">
                {experiences.length}
              </h3>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-black/30 p-6">
              <p className="text-gray-400 text-sm">
                Total Likes
              </p>

              <h3 className="mt-2 text-4xl font-bold">
                Coming Soon
              </h3>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-black/30 p-6">
              <p className="text-gray-400 text-sm">
                Saved Experiences
              </p>

              <h3 className="mt-2 text-4xl font-bold">
                Coming Soon
              </h3>
            </div>

          </div>

          <div className="mt-12 border-t border-gray-800 pt-10">

            <h3 className="text-2xl font-bold">
              My Experiences
            </h3>

            <p className="mt-2 text-gray-400">
              All experiences you've shared on Relata.
            </p>

            {/* PART 2 CONTINUES HERE */}   
                        {experiences.length === 0 ? (

              <div className="mt-8 rounded-2xl border border-dashed border-gray-700 p-10 text-center">

                <p className="text-lg text-gray-300">
                  You haven't shared any experiences yet.
                </p>

                <p className="mt-2 text-gray-500">
                  Start helping others by sharing your first experience.
                </p>

                <Link href="/create">
                  <button className="mt-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold transition hover:scale-105">
                    ✍️ Create Experience
                  </button>
                </Link>

              </div>

            ) : (

              <div className="mt-8 space-y-5">

                {experiences.map((experience) => (

                  <Link
                    key={experience.id}
                    href={`/experiences/${experience.id}`}
                  >

                    <div className="cursor-pointer rounded-2xl border border-gray-800 bg-black/30 p-6 transition hover:border-purple-500 hover:bg-zinc-900">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h4 className="text-xl font-semibold">
                            {experience.title}
                          </h4>

                          <p className="mt-2 inline-block rounded-full bg-purple-600/20 px-3 py-1 text-sm text-purple-300">
                            {experience.category}
                          </p>

                        </div>

                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {new Date(
                            experience.created_at
                          ).toLocaleDateString()}
                        </span>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}