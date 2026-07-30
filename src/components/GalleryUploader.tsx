"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

export type ExistingGalleryImage = {
  key: string;
  url: string;
  alt?: string;
};

export type GalleryUploaderHandle = {
  /** Clears the currently selected files/previews (call after a successful save). */
  reset: () => void;
};

export const GalleryUploader = forwardRef<
  GalleryUploaderHandle,
  { name?: string; existingImages?: ExistingGalleryImage[] }
>(function GalleryUploader({ name = "gallery", existingImages = [] }, ref) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [inputKey, setInputKey] = useState(0); // bump to force-clear the <input>
  const [removedKeys, setRemovedKeys] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    reset() {
      setPreviews([]);
      setInputKey((k) => k + 1); // remounts the file input with an empty value
    },
  }));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  function removeExisting(key: string) {
    setRemovedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  const visibleExisting = existingImages.filter((img) => !removedKeys.includes(img.key));

  return (
    <div>
      {visibleExisting.length > 0 && (
        <div className="mb-3 grid grid-cols-4 gap-2">
          {visibleExisting.map((img) => (
            <div key={img.key} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? ""}
                className="h-20 w-full rounded-md border border-slate-200 object-cover"
              />
              <button
                type="button"
                onClick={() => removeExisting(img.key)}
                aria-label="Remove image"
                className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tells the server action which existing gallery items to unset */}
      {removedKeys.map((key) => (
        <input key={key} type="hidden" name="removeGalleryKeys" value={key} />
      ))}

      <input
        key={inputKey}
        type="file"
        name={name}
        accept="image/*"
        multiple
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-700"
      />

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-20 w-full rounded-md border border-slate-200 object-cover" />
          ))}
        </div>
      )}
    </div>
  );
});