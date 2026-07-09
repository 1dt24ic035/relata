"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Experience = {
  id: string;
  title: string;
  category: string;
  story: string;
  created_at: string;
};

export default function ExplorePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    const { data, error } = await supabase
  .from("experiences")
  .select("*")
  .order("created_at", { ascending: false });

console.log("DATA:", data);
console.log("ERROR OBJECT:", JSON.stringify(error, null, 2));

if (data) {
  setExperiences(data);
}
  }

  const categories = useMemo(() => {
    const list = Array.from(
      new Set(experiences.map((e) => e.category))
    );

    return ["All", ...list];
  }, [experiences]);

  const filtered = experiences.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      exp.story.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      exp.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="border-b border-gray-800 bg-zinc-950">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <h1 className="text-4xl font-bold">
            Explore Experiences
          </h1>

          <p className="text-gray-400 mt-2">
            Learn from people who have already been there.
          </p>

        </div>

      </header>

      <section className="max-w-7xl mx-auto px-6 py-10">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search experiences..."
          className="w-full rounded-xl bg-zinc-900 border border-gray-800 px-5 py-4 outline-none focus:border-purple-500"
        />

        <div className="flex gap-3 overflow-x-auto mt-8 pb-2">

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-purple-600"
                  : "bg-zinc-900 border border-gray-800"
              }`}
            >
              {cat}
            </button>

          ))}

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {filtered.map((experience) => (

            <Link
              href={`/experiences/${experience.id}`}
              key={experience.id}
            >
              <div className="rounded-3xl bg-zinc-900 border border-gray-800 p-7 hover:border-purple-500 transition cursor-pointer">

                <div className="flex justify-between items-center">

                  <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                    {experience.category}
                  </span>

                  <span className="text-sm text-gray-500">
                    {new Date(
                      experience.created_at
                    ).toLocaleDateString()}
                  </span>

                </div>

                <h2 className="text-2xl font-bold mt-5">
                  {experience.title}
                </h2>

                <p className="mt-4 text-gray-400 line-clamp-4">
                  {experience.story}
                </p>

                <div className="mt-6 text-purple-400 font-semibold">
                  Read →
                </div>

              </div>
            </Link>

          ))}

        </div>

      </section>

    </main>
  );
}