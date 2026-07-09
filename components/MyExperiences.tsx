"use client";

import Link from "next/link";

type Experience = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

type Props = {
  experiences: Experience[];
};

export default function MyExperiences({
  experiences,
}: Props) {
  return (
    <div className="mt-12 border-t border-gray-800 pt-10">

      <h3 className="text-2xl font-bold">
        My Experiences
      </h3>

      <p className="mt-2 text-gray-400">
        All experiences you've shared on Relata.
      </p>

      {experiences.length === 0 ? (

        <div className="mt-8 rounded-2xl border border-dashed border-gray-700 p-10 text-center">

          <p className="text-lg text-gray-300">
            You haven't shared any experiences yet.
          </p>

          <p className="mt-2 text-gray-500">
            Start helping others by sharing your first experience.
          </p>

          <Link href="/create">
            <button className="mt-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold transition hover:scale-105">
              ✍️ Create Experience
            </button>
          </Link>

        </div>

      ) : (

        <div className="mt-8 space-y-5">

          {experiences.map((experience) => (

            <Link
              key={experience.id}
              href={`/experiences/${experience.id}`}
            >

              <div className="cursor-pointer rounded-2xl border border-gray-800 bg-black/30 p-6 transition hover:border-purple-500 hover:bg-zinc-900">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h4 className="text-xl font-semibold">
                      {experience.title}
                    </h4>

                    <p className="mt-2 inline-block rounded-full bg-purple-600/20 px-3 py-1 text-sm text-purple-300">
                      {experience.category}
                    </p>

                  </div>

                  <span className="whitespace-nowrap text-sm text-gray-500">
                    {new Date(
                      experience.created_at
                    ).toLocaleDateString()}
                  </span>

                </div>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>
  );
}