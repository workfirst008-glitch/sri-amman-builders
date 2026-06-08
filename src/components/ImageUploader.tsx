import React, { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ currentImageUrl, onUploadSuccess, label = "Upload Image" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // 1. Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;

        // 2. Submit to backend API gate
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64data })
        });

        const result = await response.json();
        if (response.ok && result.success) {
          onUploadSuccess(result.imageUrl);
        } else {
          setError(result.message || 'Image upload session failed. Please check your file size or retry.');
        }
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setIsUploading(false);
      };
    } catch (err: any) {
      setError(err.message || 'Network exception during image upload.');
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-zinc-300">{label}</label>
        {currentImageUrl && (
          <span className="text-[10px] bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Image Active
          </span>
        )}
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all ${
          dragActive 
            ? 'border-[#800000] bg-[#800000]/5 scale-[0.99]' 
            : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-2 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#800000]" />
            <p className="text-sm font-medium text-zinc-400">Processing upload file...</p>
          </div>
        ) : (
          <div className="text-center">
            {currentImageUrl ? (
              <div className="mb-4 flex justify-center">
                <img
                  src={currentImageUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="h-28 w-44 rounded-lg object-cover border border-zinc-800 shadow-xl"
                />
              </div>
            ) : (
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                <Upload className="h-5 w-5" />
              </div>
            )}
            
            <p className="text-sm font-medium text-white">
              Drag & drop files here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#800000] underline font-semibold hover:text-[#900000] focus:outline-none"
              >
                browse
              </button>
            </p>
            <p className="mt-1.5 text-xs text-zinc-500">Supports PNG, JPG, JPEG or WEBP (Max 15MB)</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start space-x-2 rounded-lg bg-red-950/20 border border-red-900/30 p-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
