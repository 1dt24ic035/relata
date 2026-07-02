export default function Categories() {
  const categories = [
    "🎓 Education",
    "💼 Career",
    "❤️ Relationships",
    "💰 Finance",
    "🏋️ Health",
    "✈️ Travel",
    "🚀 Startups",
    "📈 Investing",
  ];

  return (
    <section className="bg-black text-white py-28">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">
            Explore Experiences
          </h2>

          <p className="text-gray-400 mt-4 text-lg">
            Browse real-life stories across different areas of life.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {categories.map((category) => (
            <div
              key={category}
              className="rounded-2xl border border-gray-800 bg-zinc-900 hover:border-purple-500 hover:-translate-y-2 transition-all duration-300 p-8 text-center cursor-pointer"
            >
              <h3 className="text-xl font-semibold">
                {category}
              </h3>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}