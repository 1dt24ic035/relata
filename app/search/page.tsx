"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  username: string | null;
  avatar_url: string | null;
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [query, setQuery] = useState(
    searchParams.get("q") || ""
  );

  const [activeQuery, setActiveQuery] = useState(
    searchParams.get("q") || ""
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSearchData();
  }, []);

  async function loadSearchData() {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/login");
      return;
    }

    const {
      data: experiencesData,
      error: experienceError,
    } = await supabase
      .from("experiences")
      .select(
        "id, user_id, title, category, story, created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (experienceError) {
      console.error(
        "Experience search data error:",
        experienceError
      );

      setExperiences([]);
    } else {
      setExperiences(experiencesData || []);
    }

    const {
      data: profilesData,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        "id, display_name, username, avatar_url"
      )
      .order("display_name", {
        ascending: true,
      });

    if (profileError) {
      console.error(
        "Profile search data error:",
        profileError
      );

      setProfiles([]);
    } else {
      setProfiles(profilesData || []);
    }

    setLoading(false);
  }

  const filteredExperiences = useMemo(() => {
    const searchText = activeQuery
      .trim()
      .toLowerCase();

    if (!searchText) {
      return [];
    }

    return experiences.filter((experience) => {
      return (
        experience.title
          .toLowerCase()
          .includes(searchText) ||
        experience.story
          .toLowerCase()
          .includes(searchText) ||
        experience.category
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [experiences, activeQuery]);

  const filteredProfiles = useMemo(() => {
    const searchText = activeQuery
      .trim()
      .toLowerCase()
      .replace(/^@/, "");

    if (!searchText) {
      return [];
    }

    return profiles.filter((profile) => {
      const displayName =
        profile.display_name || "";

      const username =
        profile.username || "";

      return (
        displayName
          .toLowerCase()
          .includes(searchText) ||
        username
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [profiles, activeQuery]);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    setActiveQuery(trimmedQuery);

    if (trimmedQuery) {
      router.replace(
        `/search?q=${encodeURIComponent(
          trimmedQuery
        )}`
      );
    } else {
      router.replace("/search");
    }
  }

  const hasSearch =
    activeQuery.trim().length > 0;

  const hasResults =
    filteredExperiences.length > 0 ||
    filteredProfiles.length > 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <div className="text-gray-400">
            Loading search...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        <div className="mb-10">
          <Link
            href="/feed"
            className="mb-6 inline-block text-purple-400 transition hover:text-purple-300"
          >
            ← Back to Feed
          </Link>

          <h1 className="text-5xl font-bold">
            Search Relata
          </h1>

          <p className="mt-3 text-gray-400">
            Find experiences and people from the Relata
            community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-12 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search people, @username, or experiences..."
            className="flex-1 rounded-2xl border border-gray-800 bg-zinc-900 px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500"
          />

          <button
            type="submit"
            className="rounded-2xl bg-purple-600 px-8 py-4 font-semibold transition hover:bg-purple-500"
          >
            Search
          </button>
        </form>

        {!hasSearch && (
          <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-16 text-center">
            <div className="mb-5 text-6xl">
              🔎
            </div>

            <h2 className="text-2xl font-bold">
              What are you looking for?
            </h2>

            <p className="mt-3 text-gray-400">
              Search for experiences, topics, or people.
            </p>
          </div>
        )}

        {hasSearch && (
          <div className="space-y-12">

            {filteredProfiles.length > 0 && (
              <section>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    People
                  </h2>

                  <span className="text-sm text-gray-500">
                    {filteredProfiles.length} result
                    {filteredProfiles.length !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProfiles.map((profile) => (
                    <Link
                      key={profile.id}
                      href={`/u/${
                        profile.username || profile.id
                      }`}
                      className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-zinc-900 p-5 transition hover:border-purple-500 hover:bg-zinc-800"
                    >
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="avatar"
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xl font-bold">
                          {(profile.display_name ||
                            profile.username ||
                            "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {profile.display_name ||
                            "Relata User"}
                        </p>

                        {profile.username && (
                          <p className="mt-1 truncate text-sm text-purple-400">
                            @{profile.username}
                          </p>
                        )}

                        <p className="mt-1 text-sm text-gray-500">
                          View profile →
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Experiences
                </h2>

                <span className="text-sm text-gray-500">
                  {filteredExperiences.length} result
                  {filteredExperiences.length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              {filteredExperiences.length > 0 ? (
                <div className="space-y-5">
                  {filteredExperiences.map(
                    (experience) => (
                      <Link
                        key={experience.id}
                        href={`/experiences/${experience.id}`}
                        className="block rounded-3xl border border-gray-800 bg-zinc-900 p-7 transition hover:border-purple-500"
                      >
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <span className="rounded-full bg-purple-600/20 px-3 py-1 text-sm text-purple-300">
                            {experience.category}
                          </span>

                          <span className="text-sm text-gray-500">
                            {new Date(
                              experience.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="mb-3 text-2xl font-bold">
                          {experience.title}
                        </h3>

                        <p className="line-clamp-3 leading-7 text-gray-400">
                          {experience.story}
                        </p>

                        <p className="mt-5 font-semibold text-purple-400">
                          Read Experience →
                        </p>
                      </Link>
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-12 text-center">
                  <div className="mb-4 text-5xl">
                    🔍
                  </div>

                  <h3 className="text-2xl font-bold">
                    No experiences found
                  </h3>

                  <p className="mt-3 text-gray-400">
                    Try a different search term.
                  </p>
                </div>
              )}
            </section>

            {!hasResults && (
              <div className="rounded-3xl border border-gray-800 bg-zinc-950 p-8 text-center text-gray-500">
                Nothing matched your search.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white">
          <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
            <div className="text-gray-400">
              Loading search...
            </div>
          </div>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}