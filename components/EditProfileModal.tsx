"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  userId: string;
  displayName: string;
  bio: string;
};

export default function EditProfileModal({
  open,
  onClose,
  onSaved,
  userId,
  displayName,
  bio,
}: Props) {
  const [name, setName] = useState(displayName);
  const [about, setAbout] = useState(bio);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(displayName);
    setAbout(bio);
  }, [displayName, bio, open]);

  if (!open) return null;

  async function handleSave() {
    if (!name.trim()) {
      alert("Display Name is required.");
      return;
    }

    if (name.length > 40) {
      alert("Display Name must be under 40 characters.");
      return;
    }

    if (about.length > 200) {
      alert("Bio must be under 200 characters.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: name.trim(),
        bio: about.trim(),
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-lg rounded-3xl border border-gray-800 bg-zinc-900 p-8">

        <h2 className="text-2xl font-bold">
          Edit Profile
        </h2>

        <div className="mt-8">

          <label className="mb-2 block text-sm text-gray-400">
            Display Name
          </label>

          <input
            type="text"
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3 outline-none focus:border-purple-500"
          />

        </div>

        <div className="mt-6">

          <label className="mb-2 block text-sm text-gray-400">
            Bio
          </label>

          <textarea
            rows={5}
            maxLength={200}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full resize-none rounded-xl border border-gray-700 bg-black px-4 py-3 outline-none focus:border-purple-500"
          />

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-gray-700 px-5 py-3 transition hover:bg-white hover:text-black"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold transition hover:scale-105 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>
    </div>
  );
}