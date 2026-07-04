"use client";

import { User } from "@supabase/supabase-js";

type UserCardProps = {
  user: User;
};

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-zinc-900 p-5">

      <img
        src={user.user_metadata.avatar_url}
        alt="Profile"
        className="h-14 w-14 rounded-full"
      />

      <div>
        <h2 className="text-xl font-bold text-white">
          {user.user_metadata.full_name}
        </h2>

        <p className="text-gray-400">
          {user.email}
        </p>
      </div>

    </div>
  );
}