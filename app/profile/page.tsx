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

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [profile, setProfile] = useState<Profile>({
    display_name: "",
    bio: "",
    avatar_url: "",
  });

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


    if (profileData) {
      setProfile(profileData);
    }


    const { data: experiencesData } = await supabase
      .from("experiences")
      .select("id,title,category,created_at")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });


    if (experiencesData) {
      setExperiences(experiencesData);
    }


    setLoading(false);
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



  return (
    <main className="min-h-screen bg-black text-white">


      <header className="border-b border-gray-800 bg-zinc-950">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">


          <Link href="/dashboard">

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


    </main>
  );
}