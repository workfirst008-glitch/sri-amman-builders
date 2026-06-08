import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Target, Award, MapPin, Mail, Phone, Edit3, X, Save, ShieldCheck } from 'lucide-react';
import { About } from '../types';

interface AboutUsPageProps {
  about: About;
  isAdmin: boolean;
  onUpdateAbout: (aboutData: Partial<About>) => Promise<void>;
}

export default function AboutUsPage({ about, isAdmin, onUpdateAbout }: AboutUsPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [history, setHistory] = useState(about.companyHistory);
  const [mission, setMission] = useState(about.mission);
  const [vision, setVision] = useState(about.vision);
  const [achievements, setAchievements] = useState(about.achievements);
  const [address, setAddress] = useState(about.address);
  const [email, setEmail] = useState(about.email);
  const [phone, setPhone] = useState(about.phone);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateAbout({
        companyHistory: history,
        mission,
        vision,
        achievements,
        address,
        email,
        phone,
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAbout = () => {
    setHistory(about.companyHistory);
    setMission(about.mission);
    setVision(about.vision);
    setAchievements(about.achievements);
    setAddress(about.address);
    setEmail(about.email);
    setPhone(about.phone);
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Header section with fast triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200 pb-8 mb-12">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#800000] font-black font-mono bg-[#800000]/10 px-2.5 py-1">Sri Amman Builders Corporate</span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mt-3">Our legacy, values, & operational contacts</h1>
          <p className="text-slate-600 text-sm mt-1 max-w-xl">
            Engineering safety and trust through transparent parameters, experienced site execution, and robust civil standards.
          </p>
        </div>

        {isAdmin && !isEditing && (
          <button
            id="btn-edit-about-us"
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-[#800000] hover:bg-[#900000] text-white px-5 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all shadow-sm cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Corporate Info</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Editorial Corporate history info */}
        <div className="lg:col-span-7 space-y-10 text-slate-900">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#800000]">
              <History className="h-5 w-5" />
              <h3 className="font-display text-lg font-bold uppercase tracking-wide">Company Heritage & Foundation</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {about.companyHistory}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-200 pt-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[#800000]">
                <Target className="h-5 w-5 animate-pulse" />
                <h4 className="font-display text-base font-bold uppercase tracking-tight text-slate-900">Our Core Mission</h4>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                {about.mission}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[#800000]">
                <Target className="h-5 w-5" />
                <h4 className="font-display text-base font-bold uppercase tracking-tight text-slate-900">Our Long Term Vision</h4>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                {about.vision}
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-200 pt-8">
            <div className="flex items-center space-x-2 text-[#800000]">
              <Award className="h-5 w-5" />
              <h3 className="font-display text-lg font-bold uppercase tracking-wide">Pinnacle Accomplishments</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {about.achievements}
            </p>
          </div>

        </div>

        {/* Right Side: Quick Contact details panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white p-8 shadow-sm relative overflow-hidden">
            
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-slate-900 mb-6">HQ Engineering Office</h3>
            
            <div className="space-y-6">
              
              <div className="flex items-start space-x-4">
                <div className="rounded-none bg-slate-50 border border-slate-200 p-3 text-[#800000]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block tracking-widest font-mono font-bold">Registered Office Address</span>
                  <p className="text-slate-700 text-xs font-semibold leading-relaxed mt-1">
                    {about.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 border-t border-slate-100 pt-5">
                <div className="rounded-none bg-slate-50 border border-slate-200 p-3 text-[#800000]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block tracking-widest font-mono font-bold">Pre-Sales & General Inquiries</span>
                  <a href={`mailto:${about.email}`} className="text-[#800000] hover:underline text-xs font-bold font-mono block mt-1">
                    {about.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 border-t border-slate-100 pt-5">
                <div className="rounded-none bg-slate-50 border border-slate-200 p-3 text-[#800000]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block tracking-widest font-mono font-bold">Contact Support Hotline</span>
                  <p className="text-slate-900 text-base font-bold font-mono tracking-wide mt-1">
                    {about.phone}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Timings: 9:00 AM to 7:00 PM (Monday-Saturday)</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ADMIN INLINE ABOUT UPDATE PANEL SLIDEOVER */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white p-6 shadow-2xl my-8 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center space-x-2 text-slate-900">
                  <ShieldCheck className="h-5 w-5 text-[#800000]" />
                  <h3 className="font-display text-base font-bold uppercase tracking-wide">Edit Brand & Contacts</h3>
                </div>
                <button
                  id="btn-close-edit-about"
                  onClick={handleResetAbout}
                  className="rounded-none p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-950"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Corporate Foundation & History</label>
                  <textarea
                    rows={4}
                    required
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Institutional Mission Goal</label>
                    <textarea
                      rows={3}
                      required
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Institutional Long Term Vision</label>
                    <textarea
                      rows={3}
                      required
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Pinnacle Historical Accomplishments</label>
                  <textarea
                    rows={3}
                    required
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">HQ Office Registered Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Pre-sales email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Contact Support Number</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleResetAbout}
                    className="rounded-none border border-slate-200 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-none bg-[#800000] hover:bg-[#900000] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Corporate Profile'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
