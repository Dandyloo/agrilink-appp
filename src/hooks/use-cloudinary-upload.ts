// src/hooks/use-cloudinary-upload.ts
// Uploads images to Cloudinary via unsigned upload preset.
// Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env
import { useState } from "react";

interface UploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const CLOUD_NAME =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "";
  const UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "agrilink_listings";

  async function upload(file: File): Promise<UploadResult | null> {
    if (!CLOUD_NAME) {
      setError("Cloudinary cloud name not configured.");
      return null;
    }
    setError(null);
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "agrilink/listings");
    // Auto-optimize: convert to webp, limit to 800px width
    formData.append("transformation", "c_limit,w_800,f_webp,q_auto");

    try {
      const xhr = new XMLHttpRequest();
      const result = await new Promise<UploadResult>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener("load", () => {
          if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
          else reject(new Error(`Upload failed: ${xhr.statusText}`));
        });
        xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
        xhr.send(formData);
      });
      return result;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, progress, error };
}