import React from 'react';
import { Shield, Building, Mail, MapPin, Phone, Github, Linkedin, Award, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'home' | 'lands' | 'buildings' | 'projects' | 'about' | 'admin') => void;
  email: string;
  phone: string;
  address: string;
}

export default function Footer({ onNavigate, email, phone, address }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-zinc-900 text-zinc-400 select-none">
      
      {/* Top Banner section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-zinc-900 pb-12 mb-12">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded bg-[#800000] text-white flex items-center justify-center font-display font-extrabold text-lg">
                S
              </div>
              <span className="font-display text-lg font-black text-white tracking-widest uppercase">
                SRI AMMAN BUILDERS
              </span>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Coimbatore's premium civil engineers and gated plot developers. Over a decade of uncompromised structural integrity, beautiful home architectures, and absolute legal transparency.
            </p>

            <div className="flex items-center space-x-3 text-zinc-400 text-xs">
              <Award className="h-5 w-5 text-[#800000]" />
              <span className="font-semibold text-white">Govt. Registered Class I Contractors</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-4 max-w-md">
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-[#800000] font-black">Menu Links</h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button 
                    onClick={() => onNavigate('home')} 
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Home Overview
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('lands')} 
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Lands & Plots
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('buildings')} 
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Buildings & Villas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('projects')} 
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Civil Projects
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-black">Legal Info</h4>
              <ul className="space-y-2.5 text-xs text-zinc-500">
                <li>Approved Layouts</li>
                <li>Vaastu Guidelines</li>
                <li>RERA Registered</li>
                <li>DTCP Clearances</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#800000] font-black">Direct Contacts</h4>
            
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-4.5 w-4.5 text-[#800000] shrink-0" />
                <span className="line-clamp-2 leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4.5 w-4.5 text-zinc-500 shrink-0" />
                <span className="truncate">{email}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4.5 w-4.5 text-[#800000] shrink-0" />
                <span className="font-bold text-white tracking-wider">{phone}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600 font-medium">
          <p>© {currentYear} Sri Amman Builders. All civil and structural rights reserved.</p>
          <div className="flex items-center space-x-1.5 grayscale opacity-60">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
            <span className="font-mono text-[9px] uppercase tracking-wider">Secure SSL Sandboxed Server Interface</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
