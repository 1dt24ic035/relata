type Experience = {
  id: string;
  title: string;
  category: string;
  story: string;
  created_at: string;
};

type ExperienceCardProps = {
  experience: Experience;
};

export default function ExperienceCard({
  experience,
}: ExperienceCardProps) {
  return (
    <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-7 hover:border-purple-500 transition">

      <div className="flex items-center justify-between mb-4">

        <span className="rounded-full bg-purple-600/20 px-3 py-1 text-sm text-purple-300">
          {experience.category}
        </span>

        <span className="text-sm text-gray-500">
          {new Date(experience.created_at).toLocaleDateString()}
        </span>

      </div>

      <h3 className="text-2xl font-bold mb-4">
        {experience.title}
      </h3>

      <p className="text-gray-400 leading-7 line-clamp-4">
        {experience.story}
      </p>

      <button className="mt-6 text-purple-400 hover:text-purple-300 font-semibold">
        Read More →
      </button>

    </div>
  );
}