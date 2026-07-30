"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, CheckCircle2, Loader2, Link2, Trash2 } from "lucide-react";

interface CloudinaryUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export default function CloudinaryUploader({
  label,
  value,
  onChange,
  placeholder = "/images/templates/couple-photo.jpg",
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Helper to delete an image from Cloudinary
  const deleteOldCloudinaryImage = async (imageUrl: string) => {
    if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) return;

    try {
      setDeleting(true);
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      });
    } catch (err) {
      console.error("Failed to delete old Cloudinary image:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previousUrl = value;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (data.url) {
        // Automatically delete the replaced old image from Cloudinary
        if (previousUrl && previousUrl.includes("res.cloudinary.com")) {
          deleteOldCloudinaryImage(previousUrl);
        }
        onChange(data.url);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (value && value.includes("res.cloudinary.com")) {
      await deleteOldCloudinaryImage(value);
    }
    onChange("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#221C17]/80">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-[#7A1F2B] font-bold hover:underline flex items-center gap-1"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? "Device Upload" : "Paste Image URL"}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {/* Native File Input Trigger */}
            <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#7A1F2B] text-[#F8F3EA] text-xs font-bold shadow-md hover:bg-[#601822] transition-all relative overflow-hidden group">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#D9A441] animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#D9A441] group-hover:scale-110 transition-transform" />
                  <span>Upload Image from System / Mobile</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading || deleting}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>

            {Boolean(value && value.trim()) && (
              <div className="relative group/preview shrink-0">
                <div className="w-12 h-12 rounded-xl border-2 border-[#D9A441] overflow-hidden bg-black/10 shadow-sm">
                  <img
                    src={value.trim()}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Delete / Remove Icon Overlay */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={deleting}
                  title="Delete image from Cloudinary"
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#7A1F2B] text-white flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
                >
                  {deleting ? (
                    <Loader2 className="w-3 h-3 animate-spin text-[#D9A441]" />
                  ) : (
                    <Trash2 className="w-2.5 h-2.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {Boolean(value && value.trim()) && (
            <p className="text-[10px] text-[#5B8C69] font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-[#5B8C69]" />
                <span className="truncate">Active Image: {value}</span>
              </span>
              {value.includes("res.cloudinary.com") && (
                <span className="text-[9px] text-[#7A1F2B] bg-[#7A1F2B]/10 px-2 py-0.5 rounded-full shrink-0 font-bold">
                  Cloudinary Auto-Cleanup
                </span>
              )}
            </p>
          )}

          {error && (
            <p className="text-[10px] text-[#7A1F2B] font-semibold">
              ⚠️ {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
