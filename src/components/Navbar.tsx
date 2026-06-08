import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Map, Building2, Briefcase, Info, ShieldCheck, Menu, X } from 'lucide-react';
import { ActivePage } from '../types';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ activePage, setActivePage, isAdminLoggedIn, onLogout }: NavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'lands', label: 'Lands', icon: Map },
    { id: 'buildings', label: 'Buildings', icon: Building2 },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
  ] as const;

  const handleNavClick = (pageId: ActivePage) => {
    setActivePage(pageId);
    setIsMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#800000] text-white shadow-lg border-b border-[#900000] select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand Header */}
          <div 
            className="flex cursor-pointer items-center space-x-3"
            onClick={() => handleNavClick('home')}
          >
            <div className="relative flex h-8 w-8 items-center justify-center border-2 border-white rotate-45 bg-[#800000] transition-transform hover:rotate-135 duration-500">
              <span className="-rotate-45 font-display font-extrabold text-xs text-white">SA</span>
            </div>
            <div className="flex flex-col">
              <span className="animate-blink-logo font-display text-base font-black tracking-wide text-white sm:text-lg md:text-xl leading-tight">
                SRI AMMAN BUILDERS
              </span>
              <span className="text-[9px] uppercase tracking-widest text-rose-200/90 font-medium leading-none">
                Structural Integrity & Balance
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
                    isActive 
                      ? 'text-white border-b-2 border-white' 
                      : 'text-rose-100 hover:text-white hover:opacity-85'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-rose-200'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {isAdminLoggedIn && (
              <button
                id="btn-nav-logout"
                onClick={onLogout}
                className="ml-4 rounded-sm bg-white text-[#800000] px-4 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              id="btn-mobile-menu"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-rose-100 hover:bg-[#900000] hover:text-white transition-all focus:outline-none"
            >
              {isMobileOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#900000] bg-[#800000]"
          >
            <div className="space-y-1 px-4 py-3 pb-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex w-full items-center space-x-3 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive 
                        ? 'bg-white text-[#800000] shadow-md font-extrabold' 
                        : 'text-rose-100 hover:bg-[#900000] hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {isAdminLoggedIn && (
                <button
                  id="mobile-nav-logout"
                  onClick={() => {
                    onLogout();
                    setIsMobileOpen(false);
                  }}
                  className="flex w-full items-center space-x-3 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider text-rose-200 hover:bg-rose-900"
                >
                  <X className="h-4 w-4 text-rose-300" />
                  <span>Sign Out of Admin</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
