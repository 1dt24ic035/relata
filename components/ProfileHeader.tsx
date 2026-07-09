"use client";

import { User } from "@supabase/supabase-js";

type ProfileHeaderProps = {
  user: User;
  experienceCount: number;
};

export default function ProfileHeader({
  user,
  experienceCount,
}: ProfileHeaderProps) {
  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-6">

          {user.user_metadata.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="h-24 w-24 rounded-full"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-600 text-4xl font-bold">
              {user.user_metadata.full_name?.charAt(0) ??
                user.email?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <div>

            <h2 className="text-3xl font-bold">
              {user.user_metadata.full_name}
            </h2>

            <p className="mt-2 text-gray-400">
              {user.email}
            </p>

            <p className="mt-4 text-gray-500">
              No bio added yet.
            </p>

          </div>

        </div>

        <button
          className="rounded-xl border border-purple-500 px-6 py-3 font-semibold text-purple-300 transition hover:bg-purple-600 hover:text-white"
        >
          ✏️ Edit Profile
        </button>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl border border-gray-800 bg-black/30 p-6">
          <p className="text-sm text-gray-400">
            Total Experiences
          </p>

          <h3 className="mt-2 text-4xl font-bold text-purple-400">
            {experienceCount}
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-black/30 p-6">
          <p className="text-sm text-gray-400">
            Total Likes
          </p>

          <h3 className="mt-2 text-4xl font-bold">
            Coming Soon
          </h3>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-black/30 p-6">
          <p className="text-sm text-gray-400">
            Saved Experiences
          </p>

          <h3 className="mt-2 text-4xl font-bold">
            Coming Soon
          </h3>
        </div>

      </div>
    </>
  );
}