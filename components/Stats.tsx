export default function Stats() {
  const stats = [
    {
      number: "100K+",
      label: "Experiences Shared",
    },
    {
      number: "50K+",
      label: "Decisions Helped",
    },
    {
      number: "500+",
      label: "Topics Covered",
    },
    {
      number: "95%",
      label: "Users Found Helpful",
    },
  ];

  return (
    <section className="bg-black text-white py-24 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((item) => (
            <div key={item.label}>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {item.number}
              </h2>

              <p className="mt-3 text-gray-400 text-lg">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}