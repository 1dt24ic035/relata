import Link from "next/link";

type Experience = {
  id: string;
  title: string;
  category: string;
  story: string;
  created_at: string;
  display_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  like_count?: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
};

type ExperienceCardProps = {
  experience: Experience;
};

export default function ExperienceCard({
  experience,
}: ExperienceCardProps) {
  const displayName =
    experience.display_name ||
    experience.username ||
    "Anonymous";

  const initial = displayName
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-800 bg-zinc-950 transition hover:border-purple-500/50">
      <div className="p-7">

        {/* Author */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-800 bg-zinc-900">
            {experience.avatar_url ? (
              <img
                src={experience.avatar_url}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-purple-400">
                {initial || "U"}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-white">
              {displayName}
            </p>

            <div className="flex items-center gap-2">
              {experience.username && (
                <span className="truncate text-sm text-purple-400">
                  @{experience.username}
                </span>
              )}

              <span className="text-gray-700">•</span>

              <span className="whitespace-nowrap text-sm text-gray-500">
                {new Date(
                  experience.created_at
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Category */}
        <span className="inline-flex rounded-full bg-purple-600/15 px-4 py-2 text-sm font-medium text-purple-300">
          {experience.category}
        </span>

        {/* Title */}
        <Link
          href={`/experiences/${experience.id}`}
          className="group block"
        >
          <h3 className="mt-5 text-2xl font-bold leading-tight text-white transition group-hover:text-purple-300">
            {experience.title}
          </h3>
        </Link>

        {/* Story */}
        <p className="mt-5 line-clamp-4 text-[16px] leading-7 text-gray-400">
          {experience.story}
        </p>

        {/* Read More */}
        <Link
          href={`/experiences/${experience.id}`}
          className="mt-6 inline-flex items-center font-semibold text-purple-400 transition hover:text-purple-300"
        >
          Read More
          <span className="ml-1">→</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 border-t border-gray-800 px-7 py-4">
        <span
          className={`rounded-xl border px-4 py-2 text-sm ${
            experience.is_liked
              ? "border-red-500/40 bg-red-500/10 text-red-300"
              : "border-gray-700 text-gray-400"
          }`}
        >
          ❤️ {experience.like_count ?? 0}
        </span>

        <span
          className={`rounded-xl border px-4 py-2 text-sm ${
            experience.is_bookmarked
              ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-300"
              : "border-gray-700 text-gray-400"
          }`}
        >
          🔖{" "}
          {experience.is_bookmarked
            ? "Bookmarked"
            : "Bookmark"}
        </span>
      </div>
    </article>
  );
}