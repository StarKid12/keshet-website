"use client";

import { useState } from "react";

export function useImageUpload(bucket: string = "site-content") {
  const [uploading, setUploading] = useState(false);

  async function uploadImage(
    file: File,
    path: string
  ): Promise<string | null> {
    setUploading(true);
    try {
      // Build a safe path: keep folder prefix, use timestamp + random for filename
      const parts = path.split("/");
      const ext = parts[parts.length - 1].split(".").pop() || "jpg";
      const folder = parts.slice(0, -1).join("/").replace(/[^a-zA-Z0-9\-_/]/g, "") || "uploads";
      const safePath = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", safePath);
      formData.append("bucket", bucket);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Upload error:", json.error);
        alert(`שגיאה בהעלאת תמונה: ${json.error}`);
        return null;
      }

      return json.url;
    } catch (err) {
      console.error("Upload error:", err);
      alert("שגיאה בהעלאת תמונה");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function deleteImage(path: string): Promise<boolean> {
    // For now, just return true - deletion can be added later
    return true;
  }

  return { uploadImage, deleteImage, uploading };
}
