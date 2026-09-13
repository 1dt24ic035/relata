"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
};

type Experience = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

export default function PublicProfilePage() {
  const { id } = useParams();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [experiences, setExperiences] =
    useState<Experience[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    const { data: experienceData } =
      await supabase
        .from("experiences")
        .select(
          "id,title,category,created_at"
        )
        .eq("user_id", id)
        .order("created_at", {
          ascending: false,
        });

    setProfile(profileData);
    setExperiences(experienceData || []);

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        User not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <section className="mx-auto max-w-5xl px-6 py-12">

        <div className="flex flex-col items-center text-center">
                      {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-purple-600 text-5xl font-bold">
              {(profile.display_name || "U")
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <h1 className="mt-6 text-4xl font-bold">
            {profile.display_name || "Anonymous"}
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            {profile.bio || "No bio added yet."}
          </p>

          <div className="mt-8 rounded-2xl border border-gray-800 bg-zinc-900 px-8 py-6">

            <p className="text-sm text-gray-400">
              Total Experiences
            </p>

            <h2 className="mt-2 text-5xl font-bold text-purple-400">
              {experiences.length}
            </h2>

          </div>

        </div>

        <div className="mt-14">

          <h2 className="text-2xl font-bold">
            Experiences
          </h2>

          <div className="mt-8 space-y-5">

            {experiences.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-gray-700 p-10 text-center">

                <p className="text-gray-400">
                  No experiences shared yet.
                </p>

              </div>

            ) : (

              experiences.map((experience) => (

                <Link
                  key={experience.id}
                  href={`/experiences/${experience.id}`}
                >

                  <div className="cursor-pointer rounded-2xl border border-gray-800 bg-zinc-900 p-6 transition hover:border-purple-500">
                                        <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="text-xl font-semibold">
                          {experience.title}
                        </h3>

                        <span className="mt-3 inline-block rounded-full bg-purple-600/20 px-3 py-1 text-sm text-purple-300">
                          {experience.category}
                        </span>

                      </div>

                      <p className="whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          experience.created_at
                        ).toLocaleDateString()}
                      </p>

                    </div>

                  </div>

                </Link>

              ))

            )}

          </div>

        </div>

      </section>

    </main>
  );
}
