"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

type FeedExperience = Experience & {
  profile: Profile | null;
  liked: boolean;
  bookmarked: boolean;
  likeCount: number;
  likeLoading: boolean;
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

export default function FeedPage() {
  const router = useRouter();

  const [experiences, setExperiences] =
    useState<FeedExperience[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  useEffect(() => {
    loadFeed();
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

  async function loadFeed() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

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
        "Error loading feed:",
        error
      );

      setLoading(false);
      return;
    }

    const enrichedExperiences =
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

            let liked = false;
            let bookmarked = false;

            if (user) {
              const {
                data: likeData,
              } = await supabase
                .from("likes")
                .select("id")
                .eq(
                  "experience_id",
                  experience.id
                )
                .eq(
                  "user_id",
                  user.id
                )
                .maybeSingle();

              liked = !!likeData;

              const {
                data: bookmarkData,
              } = await supabase
                .from("bookmarks")
                .select("id")
                .eq(
                  "experience_id",
                  experience.id
                )
                .eq(
                  "user_id",
                  user.id
                )
                .maybeSingle();

              bookmarked =
                !!bookmarkData;
            }

            return {
              ...experience,
              profile,
              liked,
              bookmarked,
              likeCount,
              likeLoading: false,
            };
          }
        )
      );

    setExperiences(
      enrichedExperiences
    );

    setLoading(false);
  }

  async function toggleLike(
    experienceId: string
  ) {
    const item = experiences.find(
      (experience) =>
        experience.id === experienceId
    );

    if (!item || item.likeLoading) {
      return;
    }

    setExperiences((previous) =>
      previous.map((experience) =>
        experience.id === experienceId
          ? {
              ...experience,
              likeLoading: true,
            }
          : experience
      )
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setExperiences((previous) =>
        previous.map((experience) =>
          experience.id === experienceId
            ? {
                ...experience,
                likeLoading: false,
              }
            : experience
        )
      );

      router.push("/login");
      return;
    }

    try {
      if (item.liked) {
        const { error } =
          await supabase
            .from("likes")
            .delete()
            .eq(
              "experience_id",
              experienceId
            )
            .eq(
              "user_id",
              user.id
            );

        if (error) {
          console.error(
            "Error removing like:",
            error
          );
          return;
        }
      } else {
        const { error } =
          await supabase
            .from("likes")
            .insert({
              user_id: user.id,
              experience_id:
                experienceId,
            });

        if (
          error &&
          error.code !== "23505"
        ) {
          console.error(
            "Error adding like:",
            error
          );
          return;
        }
      }

      const latestCount =
        await getLikeCount(
          experienceId
        );

      setExperiences((previous) =>
        previous.map((experience) =>
          experience.id === experienceId
            ? {
                ...experience,
                liked: !item.liked,
                likeCount: latestCount,
              }
            : experience
        )
      );
    } finally {
      setExperiences((previous) =>
        previous.map((experience) =>
          experience.id === experienceId
            ? {
                ...experience,
                likeLoading: false,
              }
            : experience
        )
      );
    }
  }

  async function toggleBookmark(
    experienceId: string
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const item = experiences.find(
      (experience) =>
        experience.id === experienceId
    );

    if (!item) {
      return;
    }

    if (item.bookmarked) {
      const { error } =
        await supabase
          .from("bookmarks")
          .delete()
          .eq(
            "experience_id",
            experienceId
          )
          .eq(
            "user_id",
            user.id
          );

      if (error) {
        console.error(
          "Error removing bookmark:",
          error
        );
        return;
      }

      setExperiences((previous) =>
        previous.map((experience) =>
          experience.id === experienceId
            ? {
                ...experience,
                bookmarked: false,
              }
            : experience
        )
      );
    } else {
      const { error } =
        await supabase
          .from("bookmarks")
          .insert({
            user_id: user.id,
            experience_id:
              experienceId,
          });

      if (error) {
        console.error(
          "Error adding bookmark:",
          error
        );
        return;
      }

      setExperiences((previous) =>
        previous.map((experience) =>
          experience.id === experienceId
            ? {
                ...experience,
                bookmarked: true,
              }
            : experience
        )
      );
    }
  }

  const categories = useMemo(() => {
    const uniqueCategories =
      new Map<string, string>();

    experiences.forEach(
      (experience) => {
        const clean =
          cleanCategory(
            experience.category
          );

        if (!uniqueCategories.has(clean)) {
          uniqueCategories.set(
            clean,
            experience.category
          );
        }
      }
    );

    return [
      "All",
      ...Array.from(
        uniqueCategories.keys()
      ),
    ];
  }, [experiences]);

  const filteredExperiences =
    useMemo(() => {
      const searchTerm =
        search.trim().toLowerCase();

      return experiences.filter(
        (experience) => {
          const cleanExperienceCategory =
            cleanCategory(
              experience.category
            );

          const matchesSearch =
            !searchTerm ||
            experience.title
              .toLowerCase()
              .includes(searchTerm) ||
            experience.story
              .toLowerCase()
              .includes(searchTerm) ||
            cleanExperienceCategory
              .toLowerCase()
              .includes(searchTerm) ||
            experience.profile?.display_name
              ?.toLowerCase()
              .includes(searchTerm) ||
            experience.profile?.username
              ?.toLowerCase()
              .includes(searchTerm);

          const matchesCategory =
            selectedCategory === "All" ||
            cleanExperienceCategory ===
              selectedCategory;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      experiences,
      search,
      selectedCategory,
    ]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <AppNav />

        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-zinc-900" />

          <div className="mt-8 h-14 w-full animate-pulse rounded-2xl bg-zinc-900" />

          <div className="mt-8 h-80 w-full animate-pulse rounded-3xl bg-zinc-900" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20 md:pb-0">
      <AppNav />

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6">

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Home Feed
          </h1>

          <p className="mt-2 text-gray-500">
            Real experiences from people like you.
          </p>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search experiences, people, or topics..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
          />
        </div>

        <div className="mb-10 flex gap-3 overflow-x-auto pb-2">
          {categories.map(
            (category) => {
              const isSelected =
                selectedCategory ===
                category;

              const isAll =
                category === "All";

              return (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                  className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                      : "border border-white/10 bg-zinc-900 text-gray-300 hover:border-purple-500/40 hover:text-white"
                  }`}
                >
                  {!isAll && (
                    <span>
                      {getCategoryIcon(
                        category
                      )}
                    </span>
                  )}

                  {category}
                </button>
              );
            }
          )}
        </div>

        <div className="space-y-6">
          {filteredExperiences.map(
            (experience) => {
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

                      <div className="min-w-0">
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

                    <Link
                      href={`/experiences/${experience.id}`}
                      className="mt-5 inline-flex items-center font-semibold text-purple-400 transition hover:text-purple-300"
                    >
                      Read More
                      <span className="ml-1">
                        →
                      </span>
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-5 py-4 sm:px-7">
                    <button
                      onClick={() =>
                        toggleLike(
                          experience.id
                        )
                      }
                      disabled={
                        experience.likeLoading
                      }
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        experience.liked
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "border border-white/10 bg-zinc-900 text-gray-300 hover:border-red-500/40 hover:text-white"
                      } ${
                        experience.likeLoading
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      {experience.liked
                        ? "❤️ Liked"
                        : "🤍 Like"}{" "}
                      ({experience.likeCount})
                    </button>

                    <button
                      onClick={() =>
                        toggleBookmark(
                          experience.id
                        )
                      }
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        experience.bookmarked
                          ? "border border-yellow-500/50 bg-yellow-500/10 text-yellow-300"
                          : "border border-white/10 bg-zinc-900 text-gray-300 hover:border-yellow-500/40 hover:text-white"
                      }`}
                    >
                      {experience.bookmarked
                        ? "🔖 Bookmarked"
                        : "🔖 Bookmark"}
                    </button>
                  </div>
                </article>
              );
            }
          )}

          {filteredExperiences.length ===
            0 && (
            <div className="rounded-3xl border border-white/10 bg-zinc-950 px-6 py-16 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-3xl">
                🔎
              </div>

              <h2 className="text-2xl font-bold">
                No experiences found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-500">
                Try another search or choose
                a different category.
              </p>

              {(search ||
                selectedCategory !==
                  "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory(
                      "All"
                    );
                  }}
                  className="mt-6 rounded-xl bg-purple-600 px-5 py-2.5 font-semibold transition hover:bg-purple-500"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}