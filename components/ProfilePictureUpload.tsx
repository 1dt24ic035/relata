"use client";

import { ChangeEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  userId: string;
  currentAvatar: string;
  onUploadComplete: (url: string) => void;
};

export default function ProfilePictureUpload({
  userId,
  onUploadComplete,
}: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB.");
      return;
    }

    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) {
      setUploading(false);
      alert(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
      })
      .eq("id", userId);

    setUploading(false);

    if (updateError) {
      alert(updateError.message);
      return;
    }

    onUploadComplete(publicUrl);
  }

  return (
    <label className="mt-4 block cursor-pointer rounded-xl border border-purple-500 px-5 py-3 text-center font-semibold text-purple-300 transition hover:bg-purple-600 hover:text-white">
      {uploading ? "Uploading..." : "📷 Change Profile Picture"}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
    </label>
  );
}