import Link from "next/link";

type Experience = {
  id: string;
  title: string;
  category: string;
  story: string;
  lesson?: string;
  created_at: string;
};

type ExperienceCardProps = {
  experience: Experience;
};

export default function ExperienceCard({
  experience,
}: ExperienceCardProps) {
  return (
    <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-7 transition hover:border-purple-500">

      {/* Category + Date */}
      <div className="mb-4 flex items-center justify-between gap-4">

        <span className="rounded-full bg-purple-600/20 px-3 py-1 text-sm text-purple-300">
          {experience.category}
        </span>

        <span className="whitespace-nowrap text-sm text-gray-500">
          {new Date(
            experience.created_at
          ).toLocaleDateString()}
        </span>

      </div>

      {/* Title */}
      <h3 className="mb-4 text-2xl font-bold">
        {experience.title}
      </h3>

      {/* Story Preview */}
      <p className="line-clamp-4 leading-7 text-gray-400">
        {experience.story}
      </p>

      {/* Biggest Lesson */}
      {experience.lesson && (
        <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">

          <p className="mb-2 text-sm font-semibold text-purple-400">
            💡 Biggest Lesson
          </p>

          <p className="line-clamp-3 leading-6 text-gray-300">
            {experience.lesson}
          </p>

        </div>
      )}

      {/* Read More */}
      <Link
        href={`/experiences/${experience.id}`}
        className="mt-6 inline-block font-semibold text-purple-400 transition hover:text-purple-300"
      >
        Read More →
      </Link>

    </div>
  );
}