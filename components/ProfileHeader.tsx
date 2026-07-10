"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import EditProfileModal from "@/components/EditProfileModal";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

type ProfileHeaderProps = {
  user: User;
  experienceCount: number;
  displayName: string;
  bio: string;
  avatarUrl: string;
  onProfileUpdated: () => void;
};

export default function ProfileHeader({
  user,
  experienceCount,
  displayName,
  bio,
  avatarUrl,
  onProfileUpdated,
}: ProfileHeaderProps) {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState(avatarUrl);

  const name =
    displayName ||
    user.user_metadata.full_name ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-6">

          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-600 text-4xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>

            <h2 className="text-3xl font-bold">
              {name}
            </h2>

            <p className="mt-2 text-gray-400">
              {user.email}
            </p>

            <p className="mt-4 text-gray-500">
              {bio || "No bio added yet."}
            </p>

            <ProfilePictureUpload
              userId={user.id}
              currentAvatar={avatar}
              onUploadComplete={(url) => setAvatar(url)}
            />

          </div>

        </div>


        <button
          onClick={() => setOpen(true)}
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


      <EditProfileModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={onProfileUpdated}
        userId={user.id}
        displayName={displayName}
        bio={bio}
      />

    </>
  );
}