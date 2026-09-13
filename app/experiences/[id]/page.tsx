"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Experience = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  decision: string;
  story: string;
  lesson: string;
  advice: string;
  created_at: string;
};

type Profile = {
  display_name: string;
};

type Comment = {
  id: string;
  user_id: string;
  experience_id: string;
  content: string;
  created_at: string;
  profile: {
    display_name: string;
  } | null;
};

export default function ExperienceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [experience, setExperience] =
    useState<Experience | null>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] = useState(true);

  const [isOwner, setIsOwner] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] =
    useState(false);

  const [bookmarked, setBookmarked] =
    useState(false);

  const [comments, setComments] =
    useState<Comment[]>([]);

  const [commentText, setCommentText] =
    useState("");

  const [commentLoading, setCommentLoading] =
    useState(false);

  const [commentError, setCommentError] =
    useState("");

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  useEffect(() => {
    loadExperience();
  }, []);

  async function refreshLikeCount() {
    const { count } = await supabase
      .from("likes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("experience_id", id);

    return count || 0;
  }

  async function loadComments() {
    const { data, error } = await supabase
      .from("comments")
      .select(
        "id, user_id, experience_id, content, created_at"
      )
      .eq("experience_id", id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Load comments error:",
        error.message,
        error.code,
        error.details,
        error.hint
      );

      setComments([]);
      return;
    }

    if (!data) {
      setComments([]);
      return;
    }

    const enrichedComments = await Promise.all(
      data.map(async (comment) => {
        const { data: profileData } =
          await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", comment.user_id)
            .single();

        return {
          ...comment,
          profile: profileData,
        };
      })
    );

    setComments(enrichedComments);
  }

  async function loadExperience() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setCurrentUserId(user.id);
    }

    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      router.push("/feed");
      return;
    }

    setExperience(data);

    const { data: profileData } =
      await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", data.user_id)
        .single();

    setProfile(profileData);

    if (user) {
      setIsOwner(user.id === data.user_id);

      const { data: myLike } =
        await supabase
          .from("likes")
          .select("id")
          .eq("experience_id", id)
          .eq("user_id", user.id)
          .maybeSingle();

      setLiked(!!myLike);

      const { data: myBookmark } =
        await supabase
          .from("bookmarks")
          .select("id")
          .eq("experience_id", id)
          .eq("user_id", user.id)
          .maybeSingle();

      setBookmarked(!!myBookmark);
    }

    setLikeCount(await refreshLikeCount());

    await loadComments();

    setLoading(false);
  }

  async function toggleLike() {
    if (likeLoading) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setLikeLoading(true);

    const previousLiked = liked;
    const previousCount = likeCount;

    const optimisticLiked = !liked;

    setLiked(optimisticLiked);

    setLikeCount(
      optimisticLiked
        ? previousCount + 1
        : Math.max(0, previousCount - 1)
    );

    try {
      if (previousLiked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("experience_id", id)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({
            user_id: user.id,
            experience_id: id,
          });

        if (
          error &&
          error.code !== "23505"
        ) {
          throw error;
        }
      }

      const latestCount =
        await refreshLikeCount();

      setLikeCount(latestCount);
    } catch (error: any) {
      console.error(
        "Like error:",
        error?.message,
        error?.code,
        error?.details,
        error?.hint
      );

      setLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setLikeLoading(false);
    }
  }

  async function toggleBookmark() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (bookmarked) {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("experience_id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error(
          "Bookmark delete error:",
          error.message
        );
        return;
      }

      setBookmarked(false);
    } else {
      const { error } = await supabase
        .from("bookmarks")
        .insert({
          user_id: user.id,
          experience_id: id,
        });

      if (error) {
        console.error(
          "Bookmark insert error:",
          error.message
        );
        return;
      }

      setBookmarked(true);
    }
  }

  async function addComment() {
    setCommentError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      const message =
        userError.message ||
        "Unable to verify your login session.";

      console.error("Auth error:", message);
      setCommentError(message);
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    const content = commentText.trim();

    if (!content) return;

    setCommentLoading(true);

    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        experience_id: id,
        content,
      })
      .select(
        "id, user_id, experience_id, content, created_at"
      )
      .single();

    if (error) {
      const message = [
        error.message,
        error.code
          ? `Code: ${error.code}`
          : "",
        error.details
          ? `Details: ${error.details}`
          : "",
        error.hint
          ? `Hint: ${error.hint}`
          : "",
      ]
        .filter(Boolean)
        .join(" | ");

      console.error("Comment insert error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      setCommentError(
        message || "Failed to post comment."
      );

      setCommentLoading(false);
      return;
    }

    if (data) {
      const { data: profileData } =
        await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();

      setComments((prev) => [
        {
          ...data,
          profile: profileData,
        },
        ...prev,
      ]);
    }

    setCommentText("");
    setCommentLoading(false);
  }

  async function deleteComment(
    commentId: string
  ) {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error(
        "Delete comment error:",
        error.message,
        error.code,
        error.details,
        error.hint
      );
      return;
    }

    setComments((prev) =>
      prev.filter(
        (comment) => comment.id !== commentId
      )
    );
  }

  async function deleteExperience() {
    const confirmed = confirm(
      "Delete this experience permanently?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/profile");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  if (!experience) return null;

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <button
            onClick={() => router.back()}
            className="mb-6 text-purple-400 hover:text-purple-300"
          >
            ← Back
          </button>

          <span className="inline-block rounded-full bg-purple-600/20 px-4 py-2 text-sm text-purple-300">
            {experience.category}
          </span>

          <h1 className="mt-5 text-5xl font-bold">
            {experience.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-gray-500">
              {new Date(
                experience.created_at
              ).toLocaleDateString()}
            </p>

            <span className="text-gray-600">
              •
            </span>

            <Link
              href={`/u/${experience.user_id}`}
              className="font-medium text-purple-400 hover:text-purple-300"
            >
              By{" "}
              {profile?.display_name ||
                "Anonymous"}
            </Link>

            {isOwner && (
              <>
                <Link
                  href={`/edit/${experience.id}`}
                  className="rounded-lg border border-purple-500 px-4 py-2 text-sm text-purple-300 hover:bg-purple-600 hover:text-white"
                >
                  ✏️ Edit
                </Link>

                <button
                  onClick={
                    deleteExperience
                  }
                  className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white"
                >
                  🗑 Delete
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl space-y-10 px-6 py-12">
        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">
          <h2 className="mb-4 text-2xl font-bold">
            🤔 Decision
          </h2>

          <p className="leading-8 text-gray-300">
            {experience.decision}
          </p>
        </div>

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">
          <h2 className="mb-4 text-2xl font-bold">
            📖 Full Story
          </h2>

          <p className="whitespace-pre-wrap leading-8 text-gray-300">
            {experience.story}
          </p>
        </div>

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">
          <h2 className="mb-4 text-2xl font-bold">
            💡 Biggest Lesson
          </h2>

          <p className="leading-8 text-gray-300">
            {experience.lesson}
          </p>
        </div>

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">
          <h2 className="mb-4 text-2xl font-bold">
            🎯 Advice for Others
          </h2>

          <p className="leading-8 text-gray-300">
            {experience.advice}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={toggleLike}
            disabled={likeLoading}
            className={`rounded-xl px-6 py-3 font-semibold transition ${
              liked
                ? "bg-red-600 text-white"
                : "bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105"
            } ${
              likeLoading
                ? "cursor-not-allowed"
                : ""
            }`}
          >
            {liked
              ? "❤️ Liked"
              : "🤍 Like"}{" "}
            ({likeCount})
          </button>

          <button
            onClick={toggleBookmark}
            className={`rounded-xl px-6 py-3 font-semibold transition ${
              bookmarked
                ? "border border-yellow-500 bg-yellow-500/20 text-yellow-300"
                : "border border-gray-700 hover:bg-zinc-800"
            }`}
          >
            {bookmarked
              ? "🔖 Bookmarked"
              : "🔖 Bookmark"}
          </button>
        </div>

        {/* Comments */}
        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">
          <h2 className="mb-6 text-2xl font-bold">
            💬 Comments ({comments.length})
          </h2>

          <div className="mb-8 flex flex-col gap-4">
            <textarea
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                setCommentError("");
              }}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full resize-none rounded-2xl border border-gray-700 bg-black px-5 py-4 text-white outline-none placeholder:text-gray-600 focus:border-purple-500"
            />

            {commentError && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {commentError}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={addComment}
                disabled={
                  commentLoading ||
                  !commentText.trim()
                }
                className="rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Post Comment
              </button>
            </div>
          </div>

          {comments.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-black p-8 text-center">
              <p className="text-gray-400">
                No comments yet. Be the first to
                share your thoughts.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl border border-gray-800 bg-black p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <Link
                      href={`/u/${comment.user_id}`}
                      className="font-semibold text-purple-400 hover:text-purple-300"
                    >
                      {comment.profile
                        ?.display_name ||
                        "Anonymous"}
                    </Link>

                    <span className="text-sm text-gray-600">
                      {new Date(
                        comment.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap leading-7 text-gray-300">
                    {comment.content}
                  </p>

                  {currentUserId ===
                    comment.user_id && (
                    <button
                      onClick={() =>
                        deleteComment(
                          comment.id
                        )
                      }
                      className="mt-4 text-sm text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}