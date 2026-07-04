export default function Categories() {
  const categories = [
    {
      emoji: "🎓",
      title: "Education",
      description: "College, degrees, study abroad and learning."
    },
    {
      emoji: "💼",
      title: "Career",
      description: "Jobs, interviews, promotions and career growth."
    },
    {
      emoji: "❤️",
      title: "Relationships",
      description: "Love, friendships, marriage and family."
    },
    {
      emoji: "💰",
      title: "Finance",
      description: "Money, saving, debt and financial decisions."
    },
    {
      emoji: "🏋️",
      title: "Health",
      description: "Fitness, mental health and personal wellbeing."
    },
    {
      emoji: "✈️",
      title: "Travel",
      description: "Moving abroad, trips and travel experiences."
    },
    {
      emoji: "🚀",
      title: "Startups",
      description: "Building companies and entrepreneurial journeys."
    },
    {
      emoji: "📈",
      title: "Investing",
      description: "Stocks, crypto, business and wealth creation."
    },
  ];

  return (
    <section className="bg-black py-28 text-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-20">

          <p className="text-purple-400 font-semibold uppercase tracking-[0.3em] mb-4">
            EXPLORE
          </p>

          <h2 className="text-4xl md:text-5xl font-bold">
            Discover Experiences
          </h2>

          <p className="mt-5 text-lg text-gray-400 max-w-3xl mx-auto">
            Explore stories across every stage of life—from education and
            careers to relationships, startups and investing.
          </p>

        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => (
            <div
              key={category.title}
              className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer"
            >
              <div className="text-5xl mb-6 transition-transform duration-300 group-hover:scale-110">
                {category.emoji}
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {category.title}
              </h3>

              <p className="text-gray-400 leading-7 text-sm">
                {category.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}