"use client";

import { useEffect, useMemo, useState } from "react";
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

type FeedExperience = Experience & {
  profile: Profile | null;
  liked: boolean;
  bookmarked: boolean;
  likeCount: number;
  likeLoading: boolean;
};

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

    const { data: experiencesData, error } =
      await supabase
        .from("experiences")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error || !experiencesData) {
      setLoading(false);
      return;
    }

    const enrichedExperiences =
      await Promise.all(
        experiencesData.map(async (experience) => {
          const { data: profile } =
            await supabase
              .from("profiles")
              .select(
                "id, display_name, avatar_url"
              )
              .eq("id", experience.user_id)
              .single();

          const likeCount =
            await getLikeCount(
              experience.id
            );

          let liked = false;
          let bookmarked = false;

          if (user) {
            const { data: likeData } =
              await supabase
                .from("likes")
                .select("id")
                .eq(
                  "experience_id",
                  experience.id
                )
                .eq("user_id", user.id)
                .maybeSingle();

            liked = !!likeData;

            const { data: bookmarkData } =
              await supabase
                .from("bookmarks")
                .select("id")
                .eq(
                  "experience_id",
                  experience.id
                )
                .eq("user_id", user.id)
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
        })
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
      (e) => e.id === experienceId
    );

    if (!item) return;

    if (item.likeLoading) return;

    setExperiences((prev) =>
      prev.map((e) =>
        e.id === experienceId
          ? {
              ...e,
              likeLoading: true,
            }
          : e
      )
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setExperiences((prev) =>
        prev.map((e) =>
          e.id === experienceId
            ? {
                ...e,
                likeLoading: false,
              }
            : e
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
          console.error(error);
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
          error.code !==
            "23505"
        ) {
          console.error(error);
          return;
        }
      }

      const latestCount =
        await getLikeCount(
          experienceId
        );

      setExperiences((prev) =>
        prev.map((e) =>
          e.id === experienceId
            ? {
                ...e,
                liked:
                  !item.liked,
                likeCount:
                  latestCount,
              }
            : e
        )
      );
    } finally {
      setExperiences((prev) =>
        prev.map((e) =>
          e.id === experienceId
            ? {
                ...e,
                likeLoading:
                  false,
              }
            : e
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
      (e) =>
        e.id ===
        experienceId
    );

    if (!item) return;

    if (item.bookmarked) {
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

      setExperiences((prev) =>
        prev.map((e) =>
          e.id ===
          experienceId
            ? {
                ...e,
                bookmarked:
                  false,
              }
            : e
        )
      );
    } else {
      await supabase
        .from("bookmarks")
        .insert({
          user_id: user.id,
          experience_id:
            experienceId,
        });

      setExperiences((prev) =>
        prev.map((e) =>
          e.id ===
          experienceId
            ? {
                ...e,
                bookmarked:
                  true,
              }
            : e
        )
      );
    }
  }

  const categories =
    useMemo(() => {
      return [
        "All",
        ...new Set(
          experiences.map(
            (e) =>
              e.category
          )
        ),
      ];
    }, [experiences]);

  const filteredExperiences =
    experiences.filter(
      (e) => {
        const matchesSearch =
          e.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          e.story
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          selectedCategory ===
            "All" ||
          e.category ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading feed...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">

        <h1 className="text-5xl font-bold mb-8">
          Home Feed
        </h1>

        <input
          type="text"
          placeholder="Search experiences..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
                    className="w-full rounded-2xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none mb-6"
        />

        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(
            (category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className={`rounded-full px-4 py-2 transition ${
                  selectedCategory ===
                  category
                    ? "bg-purple-600"
                    : "bg-zinc-900 border border-gray-800"
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>

        <div className="space-y-8">
          {filteredExperiences.map(
            (experience) => (
              <div
                key={experience.id}
                className="rounded-3xl border border-gray-800 bg-zinc-950 p-6"
              >
                <Link
                  href={`/u/${experience.user_id}`}
                  className="flex items-center gap-4 mb-5"
                >
                  <img
                    src={
                      experience.profile
                        ?.avatar_url ||
                      "/default-avatar.png"
                    }
                    alt="avatar"
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-semibold">
                      {experience
                        .profile
                        ?.display_name ||
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
                  experience={
                    experience
                  }
                />

                <div className="mt-5 flex gap-4">

                  <button
                    onClick={() =>
                      toggleLike(
                        experience.id
                      )
                    }
                    disabled={
                      experience.likeLoading
                    }
                    className={`rounded-xl px-5 py-3 transition ${
                      experience.liked
                        ? "bg-red-600 text-white"
                        : "bg-purple-600 text-white"
                    } ${
                      experience.likeLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {experience.liked
                      ? "❤️ Liked"
                      : "🤍 Like"}{" "}
                    (
                    {
                      experience.likeCount
                    }
                    )
                  </button>

                  <button
                    onClick={() =>
                      toggleBookmark(
                        experience.id
                      )
                    }
                    className={`rounded-xl px-5 py-3 ${
                      experience.bookmarked
                        ? "border border-yellow-500 bg-yellow-500/20 text-yellow-300"
                        : "border border-gray-700"
                    }`}
                  >
                    {experience.bookmarked
                      ? "🔖 Bookmarked"
                      : "🔖 Bookmark"}
                  </button>

                </div>

              </div>
            )
          )}

          {filteredExperiences.length ===
            0 && (
            <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-12 text-center">
              <h2 className="text-2xl font-bold mb-3">
                No experiences found
              </h2>

              <p className="text-gray-400">
                Try another search or
                category.
              </p>
            </div>
          )}

        </div>

      </div>

    </main>
  );
}