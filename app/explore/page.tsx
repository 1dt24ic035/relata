"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

type ExploreExperience = Experience & {
  profile: Profile | null;
  likeCount: number;
  bookmarked: boolean;
};

export default function ExplorePage() {
  const [experiences, setExperiences] = useState<
    ExploreExperience[]
  >([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("experiences")
      .select(
        "id,user_id,title,category,story,created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (error || !data) {
      console.error(
        "Error loading experiences:",
        error
      );
      setExperiences([]);
      setLoading(false);
      return;
    }

    const enriched = await Promise.all(
      data.map(async (experience) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id,display_name,avatar_url")
          .eq("id", experience.user_id)
          .maybeSingle();

        const { count: likeCount } = await supabase
          .from("likes")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq(
            "experience_id",
            experience.id
          );

        let bookmarked = false;

        if (user) {
          const { data: bookmark } =
            await supabase
              .from("bookmarks")
              .select("id")
              .eq(
                "experience_id",
                experience.id
              )
              .eq("user_id", user.id)
              .maybeSingle();

          bookmarked = !!bookmark;
        }

        return {
          ...experience,
          profile,
          likeCount: likeCount || 0,
          bookmarked,
        };
      })
    );

    setExperiences(enriched);
    setLoading(false);
  }

  const categories = useMemo(() => {
    const list = Array.from(
      new Set(
        experiences.map(
          (experience) => experience.category
        )
      )
    );

    return ["All", ...list];
  }, [experiences]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return experiences.filter((experience) => {
      const matchesSearch =
        !query ||
        experience.title
          .toLowerCase()
          .includes(query) ||
        experience.story
          .toLowerCase()
          .includes(query) ||
        experience.profile?.display_name
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        experience.category ===
          selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [
    experiences,
    search,
    selectedCategory,
  ]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <header className="border-b border-gray-800 bg-zinc-950">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="h-10 w-72 animate-pulse rounded-lg bg-zinc-900" />
            <div className="mt-3 h-5 w-96 animate-pulse rounded bg-zinc-900" />
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="h-14 animate-pulse rounded-xl bg-zinc-900" />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl bg-zinc-900"
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-4xl font-bold">
            Explore Experiences
          </h1>

          <p className="mt-2 text-gray-400">
            Learn from people who have already
            been there.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search experiences, stories or people..."
          className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none transition focus:border-purple-500"
        />

        <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`whitespace-nowrap rounded-full px-5 py-2 transition ${
                selectedCategory === category
                  ? "bg-purple-600 text-white"
                  : "border border-gray-800 bg-zinc-900 text-gray-300 hover:border-purple-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-gray-800 bg-zinc-900 p-12 text-center">
            <div className="text-5xl">🔎</div>

            <h2 className="mt-4 text-2xl font-bold">
              No experiences found
            </h2>

            <p className="mt-2 text-gray-400">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {filtered.map((experience) => (
              <Link
                href={`/experiences/${experience.id}`}
                key={experience.id}
                className="group"
              >
                <article className="h-full rounded-3xl border border-gray-800 bg-zinc-900 p-7 transition hover:border-purple-500">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-purple-600/20 px-3 py-1 text-sm text-purple-300">
                      {experience.category}
                    </span>

                    <span className="text-sm text-gray-500">
                      {new Date(
                        experience.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    {experience.profile
                      ?.avatar_url ? (
                      <img
                        src={
                          experience.profile
                            .avatar_url
                        }
                        alt="Author avatar"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold">
                        {(
                          experience.profile
                            ?.display_name ||
                          "A"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {experience.profile
                          ?.display_name ||
                          "Anonymous"}
                      </p>

                      <p className="text-xs text-gray-500">
                        Author
                      </p>
                    </div>
                  </div>

                  <h2 className="mt-5 text-2xl font-bold transition group-hover:text-purple-300">
                    {experience.title}
                  </h2>

                  <p className="mt-4 line-clamp-4 text-gray-400">
                    {experience.story}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-5">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">
                        ❤️{" "}
                        {experience.likeCount}
                      </span>

                      <span
                        className={
                          experience.bookmarked
                            ? "text-yellow-300"
                            : "text-gray-500"
                        }
                      >
                        🔖
                      </span>
                    </div>

                    <span className="font-semibold text-purple-400 transition group-hover:text-purple-300">
                      Read →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}