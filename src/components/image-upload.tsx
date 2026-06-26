// src/components/image-upload.tsx
// Drag-and-drop + click image uploader for crop listings.
// Uses Cloudinary unsigned upload. Shows progress bar and preview.
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Listing photo" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, progress, error } = useCloudinaryUpload();
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const result = await upload(file);
    if (result) onChange(result.secure_url);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-[#1E293B]">{label}</span>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0]">
          <img
            src={value}
            alt="Listing preview"
            className="w-full h-44 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed h-44 cursor-pointer transition ${
            dragging
              ? "border-[#2E7D32] bg-[#E8F5E9]"
              : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#2E7D32] hover:bg-[#F0FDF4]"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3 w-full px-8">
              <Loader2 className="h-8 w-8 text-[#2E7D32] animate-spin" />
              <div className="w-full bg-[#E2E8F0] rounded-full h-1.5">
                <div
                  className="bg-[#2E7D32] h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-[#64748B]">{progress}%</span>
            </div>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-[#94A3B8] mb-2" />
              <span className="text-sm font-medium text-[#1E293B]">
                Click or drag to upload
              </span>
              <span className="text-xs text-[#64748B] mt-0.5">
                JPG, PNG, WebP — max 5 MB
              </span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}