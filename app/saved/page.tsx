"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExperienceCard from "@/components/ExperienceCard";
import { supabase } from "@/lib/supabase";

type Experience = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  story: string;
  created_at: string;
};

type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
};

type SavedExperience = Experience & {
  profile: Profile | null;
};

export default function SavedPage() {
  const router = useRouter();

  const [experiences, setExperiences] = useState<
    SavedExperience[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedExperiences();
  }, []);

  async function loadSavedExperiences() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: bookmarks, error: bookmarkError } =
      await supabase
        .from("bookmarks")
        .select("experience_id")
        .eq("user_id", user.id);

    if (bookmarkError || !bookmarks) {
      setExperiences([]);
      setLoading(false);
      return;
    }

    if (bookmarks.length === 0) {
      setExperiences([]);
      setLoading(false);
      return;
    }

    const experienceIds = bookmarks.map(
      (bookmark) => bookmark.experience_id
    );

    const { data: experiencesData, error: experienceError } =
      await supabase
        .from("experiences")
        .select("*")
        .in("id", experienceIds)
        .order("created_at", {
          ascending: false,
        });

    if (experienceError || !experiencesData) {
      setExperiences([]);
      setLoading(false);
      return;
    }

    const enrichedExperiences = await Promise.all(
      experiencesData.map(async (experience) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .eq("id", experience.user_id)
          .single();

        return {
          ...experience,
          profile,
        };
      })
    );

    setExperiences(enrichedExperiences);
    setLoading(false);
  }

  async function removeBookmark(experienceId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("experience_id", experienceId)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    setExperiences((prev) =>
      prev.filter(
        (experience) =>
          experience.id !== experienceId
      )
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">
          Loading saved experiences...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link
              href="/feed"
              className="mb-4 inline-block text-purple-400 hover:text-purple-300"
            >
              ← Back to Feed
            </Link>

            <h1 className="text-5xl font-bold">
              Saved Experiences
            </h1>

            <p className="mt-3 text-gray-400">
              Experiences you bookmarked for later.
            </p>
          </div>
        </div>

        {experiences.length === 0 ? (
          <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-12 text-center">
            <div className="mb-4 text-5xl">
              🔖
            </div>

            <h2 className="text-2xl font-bold">
              No saved experiences yet
            </h2>

            <p className="mt-3 text-gray-400">
              Bookmark experiences from your feed and
              they will appear here.
            </p>

            <Link
              href="/feed"
              className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500"
            >
              Explore Experiences
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="rounded-3xl border border-gray-800 bg-zinc-950 p-6"
              >
                <Link
                  href={`/u/${experience.user_id}`}
                  className="mb-5 flex items-center gap-4"
                >
                  <img
                    src={
                      experience.profile?.avatar_url ||
                      "/default-avatar.png"
                    }
                    alt="avatar"
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-semibold">
                      {experience.profile?.display_name ||
                        "Anonymous"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        experience.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </Link>

                <ExperienceCard
                  experience={experience}
                />

                <div className="mt-5">
                  <button
                    onClick={() =>
                      removeBookmark(experience.id)
                    }
                    className="rounded-xl border border-yellow-500 bg-yellow-500/20 px-5 py-3 text-yellow-300 transition hover:bg-yellow-500/30"
                  >
                    🔖 Remove Bookmark
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}