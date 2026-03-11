"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useImageUpload(bucket: string = "site-content") {
  const [uploading, setUploading] = useState(false);

  async function uploadImage(
    file: File,
    path: string
  ): Promise<string | null> {
    setUploading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error);
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      return publicUrl;
    } finally {
      setUploading(false);
    }
  }

  async function deleteImage(path: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);
    return !error;
  }

  return { uploadImage, deleteImage, uploading };
}
