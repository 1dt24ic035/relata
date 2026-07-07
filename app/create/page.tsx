"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CreateExperiencePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("🎓 Education");
  const [customCategory, setCustomCategory] = useState("");
  const [decision, setDecision] = useState("");
  const [story, setStory] = useState("");
  const [lesson, setLesson] = useState("");
  const [advice, setAdvice] = useState("");

  const titleValid = title.trim().length >= 10;
  const decisionValid = decision.trim().length >= 20;
  const storyValid = story.trim().length >= 100;
  const lessonValid = lesson.trim().length >= 30;
  const adviceValid = advice.trim().length >= 30;
  const customCategoryValid =
    category !== "📦 Other" || customCategory.trim().length >= 3;

  const formValid =
    titleValid &&
    decisionValid &&
    storyValid &&
    lessonValid &&
    adviceValid &&
    customCategoryValid;

  async function publishExperience() {
    if (!formValid) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("experiences").insert({
      user_id: user.id,
      title: title.trim(),
      category:
        category === "📦 Other"
          ? customCategory.trim()
          : category,
      decision: decision.trim(),
      story: story.trim(),
      lesson: lesson.trim(),
      advice: advice.trim(),
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("🎉 Experience Published Successfully!");

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold">
            ✍️ Share Your Experience
          </h1>

          <p className="mt-2 text-gray-400">
            Help thousands of people make better decisions.
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-10">

        <div className="space-y-8">

          {/* TITLE */}

          <div>

            <label className="block mb-2 font-medium">
              Experience Title
            </label>

            <input
              type="text"
              placeholder="Example: I switched from Mechanical to CSE..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            />

            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">
                {title.length}/10 minimum
              </span>

              {!titleValid && title.length > 0 && (
                <span className="text-red-400">
                  Minimum 10 characters
                </span>
              )}
            </div>

          </div>

          {/* CATEGORY */}

          <div>

            <label className="block mb-2 font-medium">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            >
              <option>🎓 Education</option>
              <option>💼 Career</option>
              <option>🚀 Startup</option>
              <option>💰 Finance</option>
              <option>📈 Investing</option>
              <option>❤️ Relationships</option>
              <option>🏠 Family</option>
              <option>🧠 Mental Health</option>
              <option>🏋️ Health & Fitness</option>
              <option>✈️ Travel</option>
              <option>🌍 Study Abroad</option>
              <option>💻 Technology</option>
              <option>🎨 Creativity</option>
              <option>⚖️ Legal</option>
              <option>🌱 Personal Growth</option>
              <option>📦 Other</option>
            </select>

            {category === "📦 Other" && (

              <div className="mt-5">

                <input
                  type="text"
                  placeholder="Specify category..."
                  value={customCategory}
                  onChange={(e) =>
                    setCustomCategory(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
                />

                {!customCategoryValid &&
                  customCategory.length > 0 && (
                    <p className="mt-2 text-sm text-red-400">
                      Minimum 3 characters
                    </p>
                  )}

              </div>

            )}

          </div>

          {/* DECISION */}

          <div>

            <label className="block mb-2 font-medium">
              What decision did you make?
            </label>

            <textarea
              rows={3}
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            />

            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">
                {decision.length}/20 minimum
              </span>

              {!decisionValid &&
                decision.length > 0 && (
                  <span className="text-red-400">
                    Minimum 20 characters
                  </span>
                )}
            </div>

          </div>

          {/* STORY */}

          <div>

            <label className="block mb-2 font-medium">
              Tell your story
            </label>

            <textarea
              rows={7}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            />

            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">
                {story.length}/100 minimum
              </span>

              {!storyValid &&
                story.length > 0 && (
                  <span className="text-red-400">
                    Minimum 100 characters
                  </span>
                )}
            </div>

          </div>

          {/* LESSON */}

          <div>

            <label className="block mb-2 font-medium">
              Biggest Lesson
            </label>

            <textarea
              rows={4}
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            />

            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">
                {lesson.length}/30 minimum
              </span>

              {!lessonValid &&
                lesson.length > 0 && (
                  <span className="text-red-400">
                    Minimum 30 characters
                  </span>
                )}
            </div>

          </div>

          {/* ADVICE */}

          <div>

            <label className="block mb-2 font-medium">
              Advice for others
            </label>

            <textarea
              rows={4}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            />

            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">
                {advice.length}/30 minimum
              </span>

              {!adviceValid &&
                advice.length > 0 && (
                  <span className="text-red-400">
                    Minimum 30 characters
                  </span>
                )}
            </div>

          </div>

          <button
            disabled={!formValid || loading}
            onClick={publishExperience}
            className={`w-full rounded-xl py-4 text-lg font-semibold transition-all duration-300 ${
              formValid
                ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02]"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading
              ? "Publishing..."
              : "🚀 Publish Experience"}
          </button>

        </div>

      </section>

    </main>
  );
}