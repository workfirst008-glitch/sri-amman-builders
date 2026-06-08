import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, KeyRound, LayoutDashboard, Map, Building2, Briefcase, Plus, RefreshCw, Eye, Save, Lock, User, FileText } from 'lucide-react';
import { Land, Building, Project } from '../types';

interface AdminPanelProps {
  isAdminLoggedIn: boolean;
  onLogin: (password: string, username: string) => Promise<boolean>;
  onLogout: () => void;
  onUpdateAdminPassword: (newPass: string) => Promise<boolean>;
  lands: Land[];
  buildings: Building[];
  projects: Project[];
  onNavigate: (page: 'lands' | 'buildings' | 'projects' | 'about') => void;
  onGoogleLogin?: () => void;
}

export default function AdminPanel({
  isAdminLoggedIn,
  onLogin,
  onLogout,
  onUpdateAdminPassword,
  lands,
  buildings,
  projects,
  onNavigate,
  onGoogleLogin,
}: AdminPanelProps) {
  // Login credentials states
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLogInLoading, setIsLogInLoading] = useState(false);

  // Password reset states
  const [newPassword, setNewPassword] = useState('');
  const [passMessage, setPassMessage] = useState<string | null>(null);
  const [isResetLoading, setIsResetLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLogInLoading(true);

    try {
      const success = await onLogin(password, username);
      if (!success) {
        setLoginError('Invalid Administrator credentials.');
      }
    } catch (err: any) {
      setLoginError('Authentication service error.');
    } finally {
      setIsLogInLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);
    if (!newPassword) return;
    setIsResetLoading(true);

    try {
      const result = await onUpdateAdminPassword(newPassword);
      if (result) {
        setPassMessage('Administrative passcode has been updated successfully!');
        setNewPassword('');
      } else {
        setPassMessage('Failed to reset passcode.');
      }
    } catch (err) {
      setPassMessage('An error occurred during password changes.');
    } finally {
      setIsResetLoading(false);
    }
  };

  // Pre-load dynamic list of simulated admin activity states based on item lists
  const activities = [
    { id: 1, action: "Admin authentication terminal loaded", date: "Just now", user: "system" },
    { id: 2, action: `Successfully parsed ${lands.length} land plots`, date: "1 minute ago", user: "system" },
    { id: 3, action: `Loaded ${buildings.length} building structures`, date: "2 minutes ago", user: "system" },
    { id: 4, action: `Registered ${projects.length} completion landmarks`, date: "2 minutes ago", user: "system" },
  ];

  if (!isAdminLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 select-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white p-8 shadow-sm relative overflow-hidden text-slate-900"
        >

          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-none bg-[#800000]/10 border border-[#800000]/30 text-[#800000]">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-black uppercase tracking-tight text-slate-900">Sri Amman Admin Console</h2>
            <p className="text-slate-500 text-xs">Enter protected administrative credentials to manage listings.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase font-mono flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-[#800000]" /> Username
              </label>
              <input
                type="text"
                id="admin-username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase font-mono flex items-center gap-1">
                <KeyRound className="h-3.5 w-3.5 text-[#800000]" /> Password
              </label>
              <input
                type="password"
                id="admin-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
              />
            </div>

            {loginError && (
              <div className="rounded-none bg-red-50 border border-red-200 p-3 text-center text-xs text-red-700 font-mono">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              id="btn-admin-login-submit"
              disabled={isLogInLoading}
              className="w-full rounded-none bg-[#800000] hover:bg-[#900000] py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all cursor-pointer"
            >
              {isLogInLoading ? 'Authorizing Access...' : 'Authenticate Admin Session'}
            </button>

            {onGoogleLogin && (
              <>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-mono uppercase">or secure cloud sync</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  onClick={onGoogleLogin}
                  className="w-full inline-flex items-center justify-center space-x-2 rounded-none bg-slate-900 hover:bg-slate-950 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all cursor-pointer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.55 0-6.429-2.88-6.429-6.429s2.88-6.429 6.43-6.429c1.547 0 2.943.548 4.028 1.448l2.915-2.915C18.815 2.1 15.685 1 12.24 1c-6.074 0-11 4.926-11 11s4.926 11 11 11c5.807 0 10.158-4.148 10.158-10.286 0-.61-.053-1.15-.158-1.729H12.24z" />
                  </svg>
                  <span>Connect with Google</span>
                </button>
              </>
            )}
            
            <div className="text-center pt-3">
              <p className="text-[10px] text-slate-400 font-mono">Demo Default Passcode: <span className="text-slate-600 font-bold underline">sri_amman_2026</span></p>
            </div>

          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#800000] font-black font-mono bg-[#800000]/10 px-2.5 py-1">Administrative Headquarters</span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 mt-3 uppercase tracking-tight">Sri Amman Builders Dashboard</h1>
          <p className="text-slate-600 text-sm mt-1">
            Analyze property metrics, audit media uploads, and execute quick records modifications across pages.
          </p>
        </div>

        <button
          id="btn-admin-logout"
          onClick={onLogout}
          className="self-start sm:self-center rounded-none border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-red-700 hover:bg-slate-50 hover:text-red-900 transition-all cursor-pointer shadow-sm uppercase tracking-wider"
        >
          Terminate Protected Session
        </button>
      </div>

      {/* Grid counters summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Lands Counter */}
        <div className="rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white p-6 shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
          <div className="h-12 w-12 rounded-none bg-[#800000]/10 border border-[#800000]/30 text-[#800000] flex items-center justify-center shrink-0">
            <Map className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-400 text-[9px] uppercase font-mono font-bold block tracking-widest">Total Active Lands</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{lands.length} Plots</span>
            <button
              id="dash-nav-lands"
              onClick={() => onNavigate('lands')}
              className="text-xs text-[#800000] font-bold uppercase tracking-wider hover:underline mt-2 cursor-pointer flex items-center gap-1"
            >
              Add/Edit Layouts <Eye className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Buildings Counter */}
        <div className="rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white p-6 shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
          <div className="h-12 w-12 rounded-none bg-[#800000]/10 border border-[#800000]/30 text-[#800000] flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-400 text-[9px] uppercase font-mono font-bold block tracking-widest">Active Buildings</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{buildings.length} Villas</span>
            <button
              id="dash-nav-buildings"
              onClick={() => onNavigate('buildings')}
              className="text-xs text-[#800000] font-bold uppercase tracking-wider hover:underline mt-2 cursor-pointer flex items-center gap-1"
            >
              Manage Residential <Eye className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Projects Counter */}
        <div className="rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white p-6 shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
          <div className="h-12 w-12 rounded-none bg-[#800000]/10 border border-[#800000]/30 text-[#800000] flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <span className="text-slate-400 text-[9px] uppercase font-mono font-bold block tracking-widest">Major Landmarks</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{projects.length} Works</span>
            <button
              id="dash-nav-projects"
              onClick={() => onNavigate('projects')}
              className="text-xs text-[#800000] font-bold uppercase tracking-wider hover:underline mt-2 cursor-pointer flex items-center gap-1"
            >
              Examine Specs <Eye className="h-3 w-3" />
            </button>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 grid-rows-none lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Activities feed log block */}
        <div className="lg:col-span-7 rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white p-6 shadow-sm space-y-6">
          <h3 className="font-display text-base font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#800000]" /> Recent Platform Activities Log
          </h3>

          <div className="divide-y divide-slate-100 font-mono">
            {activities.map((act) => (
              <div key={act.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-800 font-bold">{act.action}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{act.user} database interface</p>
                </div>
                <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">{act.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Password update controls */}
        <div className="lg:col-span-5 rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white p-6 shadow-sm space-y-6">
          <h3 className="font-display text-base font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-[#800000]" /> Reset Password
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Change the default login passcode to double-secure your admin profile. This modifies state records.
          </p>

          <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">New Password Passcode</label>
              <input
                type="password"
                required
                id="reset-new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter strong password link..."
                className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
              />
            </div>

            {passMessage && (
              <div className="rounded-none bg-slate-50 border border-slate-200 p-3 text-center text-xs text-slate-700 font-mono">
                {passMessage}
              </div>
            )}

            <button
              type="submit"
              id="btn-submit-reset-password"
              disabled={isResetLoading}
              className="w-full inline-flex items-center justify-center space-x-2 rounded-none bg-slate-50 border border-slate-200 px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#800000] hover:bg-[#800000] hover:text-white transition-colors cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{isResetLoading ? 'Updating Key...' : 'Update Administrative Key'}</span>
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
