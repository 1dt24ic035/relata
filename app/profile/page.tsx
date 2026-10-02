"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import ProfileHeader from "@/components/ProfileHeader";
import MyExperiences from "@/components/MyExperiences";

type Experience = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

type Profile = {
  display_name: string;
  bio: string;
  avatar_url: string;
};

type UserProfile = {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string;
};

type FollowListType = "followers" | "following" | null;

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [profile, setProfile] = useState<Profile>({
    display_name: "",
    bio: "",
    avatar_url: "",
  });

  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);

  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [listType, setListType] =
    useState<FollowListType>(null);

  const [listLoading, setListLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("display_name,bio,avatar_url")
      .eq("id", user.id)
      .single();

    const googleName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "";

    if (profileData) {
      setProfile({
        display_name:
          profileData.display_name?.trim() ||
          googleName,
        bio: profileData.bio || "",
        avatar_url:
          profileData.avatar_url ||
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          "",
      });
    } else {
      setProfile({
        display_name: googleName,
        bio: "",
        avatar_url:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          "",
      });
    }

    const { data: experiencesData } = await supabase
      .from("experiences")
      .select("id,title,category,created_at")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    setExperiences(experiencesData || []);

    const { count: followersTotal } = await supabase
      .from("follows")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("following_id", user.id);

    const { count: followingTotal } = await supabase
      .from("follows")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("follower_id", user.id);

    setFollowerCount(followersTotal || 0);
    setFollowingCount(followingTotal || 0);

    setLoading(false);
  }

  async function loadFollowList(
    type: "followers" | "following"
  ) {
    if (!user) return;

    setListType(type);
    setListLoading(true);

    if (type === "followers") {
      const { data: followsData } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("following_id", user.id);

      const ids =
        followsData?.map(
          (item) => item.follower_id
        ) || [];

      if (ids.length === 0) {
        setFollowers([]);
        setListLoading(false);
        return;
      }

      const { data: profilesData } = await supabase
        .from("profiles")
        .select(
          "id,display_name,username,avatar_url"
        )
        .in("id", ids);

      setFollowers(profilesData || []);
    } else {
      const { data: followsData } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      const ids =
        followsData?.map(
          (item) => item.following_id
        ) || [];

      if (ids.length === 0) {
        setFollowing([]);
        setListLoading(false);
        return;
      }

      const { data: profilesData } = await supabase
        .from("profiles")
        .select(
          "id,display_name,username,avatar_url"
        )
        .in("id", ids);

      setFollowing(profilesData || []);
    }

    setListLoading(false);
  }

  function closeFollowList() {
    setListType(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  if (!user) return null;

  const activeList =
    listType === "followers"
      ? followers
      : following;

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-zinc-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/feed">
            <h1 className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
              Relata
            </h1>
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-700 px-5 py-2 transition hover:bg-white hover:text-black"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">
          <ProfileHeader
            user={user}
            experienceCount={experiences.length}
            displayName={profile.display_name}
            bio={profile.bio}
            avatarUrl={profile.avatar_url}
            onProfileUpdated={loadProfile}
          />

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              onClick={() =>
                loadFollowList("followers")
              }
              className="rounded-2xl border border-gray-800 bg-black/30 p-5 text-center transition hover:border-purple-500"
            >
              <p className="text-sm text-gray-400">
                Followers
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-400">
                {followerCount}
              </p>
            </button>

            <button
              onClick={() =>
                loadFollowList("following")
              }
              className="rounded-2xl border border-gray-800 bg-black/30 p-5 text-center transition hover:border-purple-500"
            >
              <p className="text-sm text-gray-400">
                Following
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-400">
                {followingCount}
              </p>
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-800 bg-black/30 p-6">
            <h3 className="text-xl font-semibold">
              About
            </h3>

            <p className="mt-4">
              <span className="font-semibold">
                Display Name:
              </span>{" "}
              {profile.display_name || "Not set"}
            </p>

            <p className="mt-4">
              <span className="font-semibold">
                Bio:
              </span>{" "}
              {profile.bio || "No bio added yet."}
            </p>
          </div>

          <MyExperiences
            experiences={experiences}
          />
        </div>
      </section>

      {listType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
          <div className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-3xl border border-gray-800 bg-zinc-950">
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
              <h2 className="text-xl font-bold">
                {listType === "followers"
                  ? "Followers"
                  : "Following"}
              </h2>

              <button
                onClick={closeFollowList}
                className="rounded-lg px-3 py-2 text-gray-400 transition hover:bg-zinc-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {listLoading ? (
                <div className="py-10 text-center text-gray-400">
                  Loading...
                </div>
              ) : activeList.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  {listType === "followers"
                    ? "No followers yet."
                    : "Not following anyone yet."}
                </div>
              ) : (
                <div className="space-y-2">
                  {activeList.map((person) => (
                    <Link
                      key={person.id}
                      href={`/u/${person.username || person.id}`}
                      onClick={closeFollowList}
                      className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-zinc-900"
                    >
                      {person.avatar_url ? (
                        <img
                          src={person.avatar_url}
                          alt="Profile"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-lg font-bold">
                          {(
                            person.display_name ||
                            person.username ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {person.display_name ||
                            "Relata User"}
                        </p>

                        {person.username && (
                          <p className="truncate text-sm text-gray-500">
                            @{person.username}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}