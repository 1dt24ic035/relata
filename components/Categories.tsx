import Link from "next/link";

export default function Categories() {
  const categories = [
    {
      emoji: "🎓",
      title: "Education",
      description: "College, degrees, study abroad and learning.",
    },
    {
      emoji: "💼",
      title: "Career",
      description: "Jobs, interviews, promotions and career growth.",
    },
    {
      emoji: "❤️",
      title: "Relationships",
      description: "Love, friendships, marriage and family.",
    },
    {
      emoji: "💰",
      title: "Finance",
      description: "Money, saving, debt and financial decisions.",
    },
    {
      emoji: "🏋️",
      title: "Health",
      description: "Fitness, mental health and personal wellbeing.",
    },
    {
      emoji: "✈️",
      title: "Travel",
      description: "Moving abroad, trips and travel experiences.",
    },
    {
      emoji: "🚀",
      title: "Startups",
      description: "Building companies and entrepreneurial journeys.",
    },
    {
      emoji: "📈",
      title: "Investing",
      description: "Stocks, crypto, business and wealth creation.",
    },
  ];

  return (
    <section
      id="categories"
      className="bg-black py-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-20 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
            EXPLORE
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Discover Experiences
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-400">
            Explore stories across every stage of life—from education and
            careers to relationships, startups and investing.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.title}
              href="/login"
              className="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="mb-6 text-5xl transition-transform duration-300 group-hover:scale-110">
                {category.emoji}
              </div>

              <h3 className="mb-4 text-2xl font-bold">
                {category.title}
              </h3>

              <p className="text-sm leading-7 text-gray-400">
                {category.description}
              </p>

              <p className="mt-6 text-sm font-semibold text-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Sign in to explore →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}