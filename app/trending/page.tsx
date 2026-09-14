"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AppNav from "@/components/AppNav";

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
  username: string | null;
  avatar_url: string | null;
};

type TrendingExperience = Experience & {
  profile: Profile | null;
  likeCount: number;
};

function cleanCategory(category: string) {
  return category
    .replace(
      /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u,
      ""
    )
    .trim();
}

function getCategoryIcon(category: string) {
  const normalized =
    cleanCategory(category).toLowerCase();

  if (normalized.includes("education")) {
    return "🎓";
  }

  if (normalized.includes("career")) {
    return "💼";
  }

  if (normalized.includes("travel")) {
    return "✈️";
  }

  if (normalized.includes("food")) {
    return "🍔";
  }

  if (
    normalized.includes("technology") ||
    normalized.includes("tech")
  ) {
    return "💻";
  }

  if (normalized.includes("health")) {
    return "❤️";
  }

  if (normalized.includes("finance")) {
    return "💰";
  }

  if (normalized.includes("relationship")) {
    return "❤️";
  }

  if (normalized.includes("college")) {
    return "🏫";
  }

  if (normalized.includes("life")) {
    return "🌱";
  }

  return "✨";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function getTrendingScore(
  likeCount: number,
  createdAt: string
) {
  const ageInHours =
    Math.max(
      1,
      (Date.now() -
        new Date(createdAt).getTime()) /
        (1000 * 60 * 60)
    );

  return (
    likeCount * 10 +
    100 /
      Math.pow(
        ageInHours + 2,
        0.65
      )
  );
}

export default function TrendingPage() {
  const [experiences, setExperiences] =
    useState<TrendingExperience[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadTrending();
  }, []);

  async function getLikeCount(
    experienceId: string
  ) {
    const { count } = await supabase
      .from("likes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "experience_id",
        experienceId
      );

    return count || 0;
  }

  async function loadTrending() {
    const {
      data: experiencesData,
      error,
    } = await supabase
      .from("experiences")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error || !experiencesData) {
      console.error(
        "Error loading trending feed:",
        error
      );

      setLoading(false);
      return;
    }

    const enriched =
      await Promise.all(
        experiencesData.map(
          async (experience) => {
            const { data: profile } =
              await supabase
                .from("profiles")
                .select(
                  "id, display_name, username, avatar_url"
                )
                .eq(
                  "id",
                  experience.user_id
                )
                .maybeSingle();

            const likeCount =
              await getLikeCount(
                experience.id
              );

            return {
              ...experience,
              profile,
              likeCount,
            };
          }
        )
      );

    const sorted =
      enriched.sort((a, b) => {
        const scoreA =
          getTrendingScore(
            a.likeCount,
            a.created_at
          );

        const scoreB =
          getTrendingScore(
            b.likeCount,
            b.created_at
          );

        return scoreB - scoreA;
      });

    setExperiences(sorted);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <AppNav />

        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6">
          <div className="h-10 w-56 animate-pulse rounded-xl bg-zinc-900" />

          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-zinc-900" />

          <div className="mt-10 h-72 w-full animate-pulse rounded-3xl bg-zinc-900" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20 md:pb-0">
      <AppNav />

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6">

        <div className="mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Trending
            </h1>

            <p className="mt-2 text-gray-500">
              Experiences people are engaging
              with right now.
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 px-5 py-4">
          <span className="text-2xl">
            🔥
          </span>

          <div>
            <p className="font-semibold text-white">
              What's trending
            </p>

            <p className="text-sm text-gray-500">
              Popular experiences get boosted,
              while newer stories get a freshness
              boost.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {experiences.map(
            (experience, index) => {
              const profile =
                experience.profile;

              const profileUrl = `/u/${
                profile?.username ||
                experience.user_id
              }`;

              const displayName =
                profile?.display_name ||
                "Anonymous";

              const username =
                profile?.username;

              const category =
                cleanCategory(
                  experience.category
                );

              return (
                <article
                  key={experience.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 transition hover:border-white/20"
                >
                  <div className="flex items-center justify-between px-5 pt-5 sm:px-7 sm:pt-7">
                    <Link
                      href={profileUrl}
                      className="group flex items-center gap-3"
                    >
                      <img
                        src={
                          profile?.avatar_url ||
                          "/default-avatar.png"
                        }
                        alt={`${displayName}'s avatar`}
                        className="h-12 w-12 rounded-full border border-white/10 object-cover"
                      />

                      <div>
                        <p className="font-semibold text-white transition group-hover:text-purple-300">
                          {displayName}
                        </p>

                        {username && (
                          <p className="text-sm text-purple-400">
                            @{username}
                          </p>
                        )}

                        <p className="text-xs text-gray-500">
                          {formatDate(
                            experience.created_at
                          )}
                        </p>
                      </div>
                    </Link>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-sm font-bold text-purple-300">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-5 sm:px-7 sm:pb-7">
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3.5 py-1.5 text-sm font-medium text-purple-300">
                        <span>
                          {getCategoryIcon(
                            category
                          )}
                        </span>

                        {category}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                      {experience.title}
                    </h2>

                    <p className="mt-4 line-clamp-4 text-[15px] leading-7 text-gray-400 sm:text-base">
                      {experience.story}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/experiences/${experience.id}`}
                        className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
                      >
                        Read Experience →
                      </Link>

                      <div className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-gray-300">
                        ❤️{" "}
                        {experience.likeCount}{" "}
                        {experience.likeCount ===
                        1
                          ? "like"
                          : "likes"}
                      </div>
                    </div>
                  </div>
                </article>
              );
            }
          )}

          {experiences.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-zinc-950 px-6 py-16 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-3xl">
                🔥
              </div>

              <h2 className="text-2xl font-bold">
                Nothing is trending yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-500">
                Once people start engaging with
                experiences, the most popular ones
                will appear here.
              </p>

              <Link
                href="/feed"
                className="mt-6 inline-flex rounded-xl bg-purple-600 px-5 py-2.5 font-semibold transition hover:bg-purple-500"
              >
                Explore Experiences
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}