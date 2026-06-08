import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit3, CheckCircle2, ChevronRight, X } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface HeroSectionProps {
  imageUrl: string;
  isAdmin: boolean;
  onUpdateHero: (newUrl: string) => Promise<void>;
  onNavigate: (page: 'lands' | 'buildings' | 'projects') => void;
}

export default function HeroSection({ imageUrl, isAdmin, onUpdateHero, onNavigate }: HeroSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(imageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onUpdateHero(tempUrl);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] w-full overflow-hidden bg-slate-950 flex items-center">
      
      {/* Background Graphic Overlays */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src={imageUrl}
          alt="Sri Amman Builders Luxury Infrastructure"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-50 scale-105 transition-all duration-[1200ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="inline-flex items-center space-x-2.5 rounded-none border-l-4 border-l-[#800000] border-y border-r border-[#800000]/40 bg-[#800000]/10 px-4 py-2.5 text-xs font-semibold text-rose-200 tracking-wider uppercase">
              <span className="flex h-2 w-2 rounded-none bg-[#800000] animate-ping"></span>
              <span>Coimbatore’s Premium Elite Civil Engineers</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none uppercase tracking-tight">
              Crafting Structures <br />
              <span className="text-[#800000] block mt-2">That Stand For Generations</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              We engineer quality gated community layouts, spacious custom independent villas, and robust commercial builds. At <span className="font-semibold text-white">Sri Amman Builders</span>, we synthesize modern design aesthetics, flawless approvals, and bulletproof legal clarity.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                id="btn-hero-buildings"
                onClick={() => onNavigate('buildings')}
                className="inline-flex items-center space-x-2 bg-[#800000] hover:bg-[#900000] text-white px-8 py-4 rounded-none text-xs font-bold uppercase tracking-widest transition-transform duration-200 active:scale-95 cursor-pointer"
              >
                <span>View Buildings</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                id="btn-hero-lands"
                onClick={() => onNavigate('lands')}
                className="inline-flex items-center space-x-2 border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-white px-8 py-4 rounded-none text-xs font-bold uppercase tracking-widest transition-all backdrop-blur-sm active:scale-95 cursor-pointer"
              >
                <span>Browse Plots & Lands</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 border-t border-[#800000]/20 max-w-2xl">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#800000]">12+ Years</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono">Unblemished Legacy</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">150+ Houses</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono">Flawlessly Turned Over</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#800000]">1400+ Families</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono">Smiles & Satisfaction</p>
              </div>
            </div>

          </motion.div>

          <div className="hidden lg:col-span-4 lg:flex justify-end relative">
            {isAdmin && (
              <motion.button
                id="btn-hero-edit-image"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-[#800000] hover:bg-[#900000] text-white px-4 py-2.5 rounded-none text-[10px] uppercase tracking-wider font-bold shadow-lg transition-all cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Change Hero Banner</span>
              </motion.button>
            )}
            
            <div className="w-full max-w-[320px] aspect-[4/5] rounded-none border border-slate-800 bg-slate-900/40 p-3 backdrop-blur-md shadow-2xl relative overflow-hidden group">
              <img
                src={imageUrl}
                alt="Elite Real Estate Concept"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-none grayscale group-hover:grayscale-0 transition-all duration-555"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#800000] uppercase bg-white/95 px-2 py-0.5">Signature Quality</span>
                <p className="font-display text-sm font-semibold text-white mt-2">Ready for custom possession.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating admin edit trigger for small/medium devices */}
      {isAdmin && (
        <button
          id="btn-hero-edit-image-mobile"
          onClick={() => setIsEditing(true)}
          className="lg:hidden absolute bottom-4 right-4 z-30 flex items-center space-x-2 bg-[#800000] hover:bg-[#900000] text-white rounded-none px-4 py-3 text-xs font-black shadow-lg cursor-pointer"
        >
          <Edit3 className="h-4 w-4" />
          <span>Edit Banner</span>
        </button>
      )}

      {/* Hero Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-display text-base font-bold text-slate-900 uppercase tracking-wide">Edit Hero Section Image</h3>
              <button
                id="btn-close-hero-modal"
                onClick={() => setIsEditing(false)}
                className="rounded-none p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 pt-6">
              <ImageUploader
                label="Directly Upload Cover Image File"
                currentImageUrl={tempUrl}
                onUploadSuccess={(url) => setTempUrl(url)}
              />

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase font-mono">Or Enter Direct Image URL</label>
                <input
                  type="text"
                  id="input-hero-image-url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-none border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  id="btn-cancel-hero"
                  onClick={() => setIsEditing(false)}
                  className="rounded-none border border-slate-200 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-hero"
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="rounded-none bg-[#800000] hover:bg-[#900000] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
