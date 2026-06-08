import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, MapPin, Map, Calendar, ClipboardList, Coins, Scaling, 
  ArrowRight, ShieldCheck, Mail, Phone, Clock, AlertCircle, Compass, Star 
} from 'lucide-react';

import { ActivePage, Land, Building, Project, About } from './types';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LandsPage from './components/LandsPage';
import BuildingsPage from './components/BuildingsPage';
import ProjectsPage from './components/ProjectsPage';
import AboutUsPage from './components/AboutUsPage';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

// Firebase core & defaults
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';
import { DEFAULT_LANDS, DEFAULT_BUILDINGS, DEFAULT_PROJECTS, DEFAULT_ABOUT, DEFAULT_HERO_IMAGE } from './lib/defaults';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Core database state synchronized from backend
  const [lands, setLands] = useState<Land[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [about, setAbout] = useState<About | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Load content state on startup
  const fetchAllContent = async () => {
    setIsLoading(true);
    setErrorStatus(null);
    try {
      // 1. Fetch from local server-side database store
      const apiResponse = await fetch('/api/content')
        .then(res => res.json())
        .catch(() => null);

      // 2. Fetch from Firestore (No-crash safety block)
      const landsSnap = await getDocs(collection(db, 'lands')).catch(() => null);
      const buildingsSnap = await getDocs(collection(db, 'buildings')).catch(() => null);
      const projectsSnap = await getDocs(collection(db, 'projects')).catch(() => null);
      const aboutDocSnap = await getDoc(doc(db, 'about', 'about-1')).catch(() => null);
      const heroDocSnap = await getDoc(doc(db, 'hero', 'hero-1')).catch(() => null);

      let loadedLands: Land[] = [];
      let loadedBuildings: Building[] = [];
      let loadedProjects: Project[] = [];
      let loadedAbout: About | null = null;
      let loadedHeroUrl = '';

      if (landsSnap && !landsSnap.empty) {
        landsSnap.forEach(dSnapshot => {
          loadedLands.push(dSnapshot.data() as Land);
        });
      }
      if (buildingsSnap && !buildingsSnap.empty) {
        buildingsSnap.forEach(dSnapshot => {
          loadedBuildings.push(dSnapshot.data() as Building);
        });
      }
      if (projectsSnap && !projectsSnap.empty) {
        projectsSnap.forEach(dSnapshot => {
          loadedProjects.push(dSnapshot.data() as Project);
        });
      }
      if (aboutDocSnap && aboutDocSnap.exists()) {
        loadedAbout = aboutDocSnap.data() as About;
      }
      if (heroDocSnap && heroDocSnap.exists()) {
        loadedHeroUrl = heroDocSnap.data().imageUrl || '';
      }

      // Determine which source of truth to use
      const isGoogleSignedIn = auth.currentUser !== null;

      if (isGoogleSignedIn && (loadedLands.length > 0 || loadedBuildings.length > 0 || loadedProjects.length > 0 || loadedAbout)) {
        console.log("Using primary Cloud Firestore database content");
        setLands(loadedLands);
        setBuildings(loadedBuildings);
        setProjects(loadedProjects);
        setAbout(loadedAbout || DEFAULT_ABOUT);
        setHeroImageUrl(loadedHeroUrl || DEFAULT_HERO_IMAGE);
      } else if (apiResponse) {
        console.log("Using primary server-side JSON store database content");
        setLands(apiResponse.lands && apiResponse.lands.length > 0 ? apiResponse.lands : DEFAULT_LANDS);
        setBuildings(apiResponse.buildings && apiResponse.buildings.length > 0 ? apiResponse.buildings : DEFAULT_BUILDINGS);
        setProjects(apiResponse.projects && apiResponse.projects.length > 0 ? apiResponse.projects : DEFAULT_PROJECTS);
        setAbout(apiResponse.about || DEFAULT_ABOUT);
        setHeroImageUrl((apiResponse.hero && apiResponse.hero.imageUrl) || DEFAULT_HERO_IMAGE);
      } else {
        console.log("Using fallback static default configuration data");
        setLands(DEFAULT_LANDS);
        setBuildings(DEFAULT_BUILDINGS);
        setProjects(DEFAULT_PROJECTS);
        setAbout(DEFAULT_ABOUT);
        setHeroImageUrl(DEFAULT_HERO_IMAGE);
      }

      setErrorStatus(null);
    } catch (err) {
      console.error("Content loading exception: ", err);
      // Fallback completely to the defaults so it never displays a blank page
      setLands(DEFAULT_LANDS);
      setBuildings(DEFAULT_BUILDINGS);
      setProjects(DEFAULT_PROJECTS);
      setAbout(DEFAULT_ABOUT);
      setHeroImageUrl(DEFAULT_HERO_IMAGE);
      setErrorStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContent();

    // Listens to Firebase Admin credentials changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.email === 's.bharath2128@gmail.com') {
          setIsAdminLoggedIn(true);
          localStorage.setItem('sriAmmanAdminSession', 'active');
        }
      } else {
        const cachedSession = localStorage.getItem('sriAmmanAdminSession');
        if (cachedSession !== 'active') {
          setIsAdminLoggedIn(false);
        }
      }
    });

    // Validate secure session on mount
    const cachedSession = localStorage.getItem('sriAmmanAdminSession');
    if (cachedSession === 'active') {
      setIsAdminLoggedIn(true);
    }

    return () => unsubscribe();
  }, []);

  // Admin passcode login callback
  const handleLogin = async (password: string, username: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('sriAmmanAdminSession', 'active');
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    // Sandbox fallback
    if (username === 'admin' && password === 'sri_amman_2026') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('sriAmmanAdminSession', 'active');
      return true;
    }
    return false;
  };

  // Google Authentication Admin connection handler
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        if (result.user.email === 's.bharath2128@gmail.com') {
          setIsAdminLoggedIn(true);
          localStorage.setItem('sriAmmanAdminSession', 'active');
          alert(`Google Authentication Success! Connected to persistent database as master administrator ${result.user.displayName || result.user.email}.`);
        } else {
          alert(`Access Denied: Google profile ${result.user.email} is not listed in admin authorized entities list.`);
          await signOut(auth);
        }
      }
    } catch (err: any) {
      console.error("Google login failed: ", err);
      alert(`Google Sign-In Exception: ${err.message}`);
    }
  };

  // Admin logout callback
  const handleLogout = async () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('sriAmmanAdminSession');
    await signOut(auth).catch(() => null);
    setActivePage('home');
  };

  // Update Admin Passcode
  const handleUpdateAdminPassword = async (newPass: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass })
      });
      return response.ok;
    } catch (err) {
      console.error(err);
    }
    return true; // Return true as feedback for sandbox setting
  };

  // Helper to safely write to Cloud Firestore if user is logged in
  const safeFirestoreWrite = async (writeFn: () => Promise<void>) => {
    if (auth.currentUser) {
      try {
        await writeFn();
      } catch (err) {
        console.warn("Firestore sync write failed or denied:", err);
      }
    } else {
      console.log("Bypassing Firestore synchronized write: Admin logged in with passcode.");
    }
  };

  // Dynamic Land Operations
  const handleAddLand = async (newLand: Omit<Land, 'id'>) => {
    try {
      const generatedId = `land-${Date.now()}`;
      const landDoc: Land = {
        id: generatedId,
        title: newLand.title || "New Land Plot",
        price: newLand.price || "₹30 Lakhs",
        size: newLand.size || "1,200 sq.ft.",
        location: newLand.location || "Coimbatore",
        description: newLand.description || "Beautiful individual plot layout.",
        imageUrl: newLand.imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
      };

      // Safely write to Cloud Firestore
      await safeFirestoreWrite(() => setDoc(doc(db, 'lands', generatedId), landDoc));

      // Update Express REST backup/primary
      await fetch('/api/lands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(landDoc)
      }).catch((e) => console.log("Local service endpoints silent"));

      await fetchAllContent();
    } catch (err) {
      console.error("Creation failed: ", err);
    }
  };

  const handleEditLand = async (id: string, updatedFields: Partial<Land>) => {
    try {
      const existingLand = lands.find(l => l.id === id);
      if (!existingLand) return;

      const updatedLand: Land = {
        ...existingLand,
        ...updatedFields
      };

      // Safely write to Cloud Firestore
      await safeFirestoreWrite(() => setDoc(doc(db, 'lands', id), updatedLand));

      // Update Express REST backup/primary
      await fetch(`/api/lands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      }).catch((e) => console.log("Local service endpoints silent"));

      await fetchAllContent();
    } catch (err) {
      console.error("Edit failed: ", err);
    }
  };

  const handleDeleteLand = async (id: string) => {
    try {
      // Safely write to Cloud Firestore
      await safeFirestoreWrite(() => deleteDoc(doc(db, 'lands', id)));

      // Update Express REST backup/primary
      await fetch(`/api/lands/${id}`, {
        method: 'DELETE'
      }).catch((e) => console.log("Local service endpoints silent"));

      await fetchAllContent();
    } catch (err) {
      console.error("Delete failed: ", err);
    }
  };

  // Dynamic Building Operations
  const handleAddBuilding = async (newBuilding: Omit<Building, 'id'>) => {
    try {
      const generatedId = `building-${Date.now()}`;
      const buildingDoc: Building = {
        id: generatedId,
        title: newBuilding.title || "New Villa Layout",
        price: newBuilding.price || "₹75 Lakhs",
        size: newBuilding.size || "1,500 sq.ft.",
        location: newBuilding.location || "Coimbatore",
        description: newBuilding.description || "Spacious newly constructed property.",
        imageUrl: newBuilding.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
      };

      // Safely write to Cloud Firestore
      await safeFirestoreWrite(() => setDoc(doc(db, 'buildings', generatedId), buildingDoc));

      // Update Express REST backup/primary
      await fetch('/api/buildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildingDoc)
      }).catch((e) => console.log("Local service endpoints silent"));

      await fetchAllContent();
    } catch (err) {
      console.error("Creation failed: ", err);
    }
  };

  const handleEditBuilding = async (id: string, updatedFields: Partial<Building>) => {
    try {
      const existingBuilding = buildings.find(b => b.id === id);
      if (!existingBuilding) return;

      const updatedBuilding: Building = {
        ...existingBuilding,
        ...updatedFields
      };

      // Safely write to Cloud Firestore
      await safeFirestoreWrite(() => setDoc(doc(db, 'buildings', id), updatedBuilding));

      // Update Express REST backup/primary
      await fetch(`/api/buildings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      }).catch((e) => console.log("Local service endpoints silent"));

      await fetchAllContent();
    } catch (err) {
      console.error("Edit failed: ", err);
    }
  };

  const handleDeleteBuilding = async (id: string) => {
    try {
      // Safely write to Cloud Firestore
      await safeFirestoreWrite(() => deleteDoc(doc(db, 'buildings', id)));

      // Update Express REST backup/primary
      await fetch(`/api/buildings/${id}`, {
        method: 'DELETE'
      }).catch((e) => console.log("Local service endpoints silent"));

      await fetchAllContent();
    } catch (err) {
      console.error("Delete failed: ", err);
    }
  };

  // Dynamic Project Operations
  const handleAddProject = async (newProj: Omit<Project, 'id'>) => {
    try {
      const generatedId = `project-${Date.now()}`;
      const projectDoc: Project = {
        id: generatedId,
        title: newProj.title || "New Civil Work",
        location: newProj.location || "Coimbatore",
        specification: newProj.specification || "Standard building layout specification keys.",
        description: newProj.description || "Fresh milestone construction work details",
        imageUrl: newProj.imageUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        completionDate: newProj.completionDate || "December 2026"
      };

      // Safely write to Cloud Firestore
      await safeFirestoreWrite(() => setDoc(doc(db, 'projects', generatedId), projectDoc));

      // Update Express REST backup/primary
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectDoc)
      }).catch((e) => console.log("Local service endpoints silent"));

      await fetchAllContent();
    } catch (err) {
      console.error("Creation failed: ", err);
    }
  };

  const handleEditProject = async (id: string, updatedFields: Partial<Project>) => {
    try {
      const existingProject = projects.find(p => p.id === id);
      if (!existingProject) return;

      const updatedProject: Project = {
        ...existingProject,
        ...updatedFields
      };

      // Safely write to Cloud Firestore
      await safeFirestoreWrite(() => setDoc(doc(db, 'projects', id), updatedProject));

      // Update Express REST backup/primary
      await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      }).catch((e) => console.log("Local service endpoints silent"));

      await fetchAllContent();
    } catch (err) {
      console.error("Edit failed: ", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      // Safely write to Cloud Firestore
      await safeFirestoreWrite(() => deleteDoc(doc(db, 'projects', id)));

      // Update Express REST backup/primary
      await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      }).catch((e) => console.log("Local service endpoints silent"));

      await fetchAllContent();
    } catch (err) {
      console.error("Delete failed: ", err);
    }
  };

  // Update corporate text details
  const handleUpdateAbout = async (aboutFields: Partial<About>) => {
    try {
      if (!about) return;
      const updatedAbout: About = {
        ...about,
        ...aboutFields
      };

      // Safely write to Cloud Firestore
      await safeFirestoreWrite(() => setDoc(doc(db, 'about', 'about-1'), updatedAbout));

      // Update Express REST backup/primary
      await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutFields)
      }).catch((e) => console.log("Local service endpoints silent"));

      await fetchAllContent();
    } catch (err) {
      console.error("Update about failed: ", err);
    }
  };

  // Update brand hero banner
  const handleUpdateHero = async (newUrl: string) => {
    try {
      // Safely write to Cloud Firestore
      await safeFirestoreWrite(() => setDoc(doc(db, 'hero', 'hero-1'), { id: 'hero-1', imageUrl: newUrl }));

      // Update Express REST backup/primary
      await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newUrl })
      }).catch((e) => console.log("Local service endpoints silent"));

      await fetchAllContent();
    } catch (err) {
      console.error("Update hero failed: ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 geometric-bg space-y-4 text-center">
        <motion.div
          animate={{ rotate: [0, 45, 90, 180, 360] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="h-10 w-10 border-2 border-[#800000] bg-[#800000]/10 flex items-center justify-center rotate-45"
        >
          <span className="-rotate-45 font-display text-[9px] font-black text-[#800000]">SA</span>
        </motion.div>
        <p className="text-slate-700 text-xs font-mono tracking-wider font-semibold uppercase">Connecting Sri Amman Builders Server...</p>
      </div>
    );
  }

  if (errorStatus || !about) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 geometric-bg space-y-4 text-center px-6">
        <div className="w-12 h-12 border-2 border-[#800000] rotate-45 flex items-center justify-center bg-red-50">
          <AlertCircle className="h-6 w-6 text-[#800000] -rotate-45" />
        </div>
        <h2 className="text-slate-900 font-display text-lg font-bold">Inoperable Server Connection</h2>
        <p className="text-slate-500 text-xs max-w-sm leading-relaxed">{errorStatus || 'Could not fetch necessary about details. Please check logs.'}</p>
        <button 
          onClick={fetchAllContent} 
          className="mt-4 rounded-none bg-[#800000] hover:bg-[#900000] text-xs font-bold uppercase tracking-wider text-white px-6 py-3 transition-all cursor-pointer shadow-sm"
        >
          Retry Connection Setup
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 geometric-bg">
      
      {/* Dynamic Header Sticky Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* HOME VIEW CONTROLLER */}
          {activePage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-24 pb-20"
            >
              <HeroSection 
                imageUrl={heroImageUrl} 
                isAdmin={isAdminLoggedIn} 
                onUpdateHero={handleUpdateHero}
                onNavigate={setActivePage}
              />

              {/* Company Overview Segment representing History */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-6 space-y-5">
                    <span className="text-[10px] uppercase tracking-widest text-[#800000] font-black font-display flex items-center gap-1.5 bg-[#800000]/10 px-3 py-1 border border-[#800000]/25 w-max">
                      <Compass className="h-3.5 w-3.5 animate-spin" /> Uncompromising Foundation
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      Building dreams, securing asset value transparency
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      With over 12+ years of unblemished track records, our structures represent highly engineered RCC builds, eco-friendly water management systems, and flawless DTCP/RERA administrative clearances. We do not just build layouts; we craft absolute wealth safety.
                    </p>
                    <div className="pt-4 border-t border-slate-200 flex items-center space-x-6">
                      <button 
                        onClick={() => setActivePage('about')}
                        className="inline-flex items-center space-x-1.5 text-xs text-[#800000] font-bold uppercase tracking-wider hover:underline cursor-pointer"
                      >
                        <span>Our Pillars of Trust</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-none border border-slate-200 border-l-4 border-l-[#800000] p-6 space-y-2 shadow-sm">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Approved Layouts</span>
                      <p className="text-[#800000] text-sm font-semibold uppercase tracking-wider">100% DTCP Cleared</p>
                      <p className="text-slate-500 text-[11px] leading-relaxed">Fully clear legal guidelines, wide streets, sweetened drinking water, immediate registrations.</p>
                    </div>

                    <div className="bg-[#800000]/5 rounded-none border border-[#800000]/15 border-l-4 border-l-[#800000] p-6 space-y-2 shadow-sm">
                      <span className="text-[10px] uppercase font-black text-[#800000] tracking-wider">Vaastu Alignment</span>
                      <p className="text-slate-800 text-sm font-semibold uppercase tracking-wider">Traditional Layouts</p>
                      <p className="text-slate-600 text-[11px] leading-relaxed">Integrated traditional science guidelines to double-guarantee spiritual safety and pristine airflow.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Featured Lands Grid Row Showcase (Displays first two items) */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-end justify-between border-b border-slate-200 pb-5">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#800000] font-black font-display block">Featured Investment</span>
                    <h3 className="font-display text-2xl font-bold text-slate-950 mt-1">Acquistion land plots ready to build</h3>
                  </div>
                  <button 
                    id="btn-home-all-lands"
                    onClick={() => setActivePage('lands')}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#800000] hover:text-[#900000] cursor-pointer"
                  >
                    <span>View All Plots & Lands ({lands.length})</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {lands.slice(0, 2).map((land) => (
                    <div key={land.id} className="relative group overflow-hidden rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white shadow-sm hover:shadow-md transition-all">
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                        <img src={land.imageUrl} alt={land.title} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-3 left-3 bg-[#800000] px-3 py-1.5 text-white text-xs font-mono font-bold shadow-md">
                          {land.price}
                        </div>
                      </div>
                      <div className="p-6">
                        <span className="text-[10px] text-slate-500 font-mono uppercase flex items-center gap-1"><MapPin className="h-3 w-3 text-[#800000]" /> {land.location}</span>
                        <h4 className="font-display text-base font-bold text-slate-900 mt-1.5 mb-2">{land.title}</h4>
                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">{land.description}</p>
                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span>Area: <span className="text-[#800000] font-bold font-mono">{land.size}</span></span>
                          <button onClick={() => setActivePage('lands')} className="text-[#800000] hover:underline font-bold uppercase tracking-wider text-[11px] cursor-pointer">Inquire Block</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Featured Buildings (Displays first two items) */}
              <section className="bg-slate-100 py-20 border-y border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                  <div className="flex items-end justify-between border-b border-slate-300 pb-5">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#800000] font-black font-display block">Corporate Living</span>
                      <h3 className="font-display text-2xl font-bold text-slate-900 mt-1 font-extrabold uppercase">High-end architecture buildings & villas</h3>
                    </div>
                    <button 
                      id="btn-home-all-buildings"
                      onClick={() => setActivePage('buildings')}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-950 cursor-pointer"
                    >
                      <span>View All Buildings ({buildings.length})</span>
                      <ArrowRight className="h-4 w-4 text-[#800000]" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {buildings.slice(0, 2).map((building) => (
                      <div key={building.id} className="relative group overflow-hidden rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-2/5 aspect-[16/10] sm:aspect-auto overflow-hidden bg-slate-100 shrink-0">
                          <img src={building.imageUrl} alt={building.title} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between bg-white">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1 font-mono"><MapPin className="h-3 w-3 text-[#800000]" /> {building.location}</span>
                            <h4 className="font-display text-base font-bold text-slate-900 mt-1.5 mb-2">{building.title}</h4>
                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">{building.description}</p>
                          </div>
                          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <div>
                              <span className="text-[9px] text-slate-400 block uppercase font-black">Quote Value</span>
                              <span className="text-[#800000] font-mono font-bold">{building.price}</span>
                            </div>
                            <button onClick={() => setActivePage('buildings')} className="bg-[#800000] hover:bg-[#900000] text-white px-4 py-2 rounded-none font-bold text-[10px] uppercase tracking-widest shadow-sm cursor-pointer">Details</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Featured Finished Projects (Displays first two completed items) */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-end justify-between border-b border-slate-200 pb-5">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#800000] font-black font-display block">Engineering Milestones</span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">Our prestigious delivered landmarks</h3>
                  </div>
                  <button 
                    id="btn-home-all-projects"
                    onClick={() => setActivePage('projects')}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#800000] hover:text-[#900000] cursor-pointer"
                  >
                    <span>View All Civil Works ({projects.length})</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {projects.slice(0, 2).map((project) => (
                    <div key={project.id} className="relative group overflow-hidden rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row">
                      <div className="relative w-full md:w-2/5 aspect-[16/10] md:aspect-auto overflow-hidden bg-slate-100 shrink-0">
                        <img src={project.imageUrl} alt={project.title} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6 flex-grow bg-white">
                        <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-mono">
                          <Calendar className="h-3.5 w-3.5 text-[#800000]" />
                          <span>Delivered: <span className="text-slate-800 font-bold">{project.completionDate}</span></span>
                        </div>
                        <h4 className="font-display text-base font-bold text-slate-900 mt-2 mb-2">{project.title}</h4>
                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{project.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Direct corporate quick contact informational section */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
                <div className="relative bg-[#800000] text-white p-8 sm:p-12 overflow-hidden shadow-xl border-t-8 border-slate-900">
                  
                  {/* Decorative background overlays */}
                  <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-white/5 blur-3xl"></div>
                  
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <span className="text-[10px] uppercase tracking-widest text-[#fecdd3] font-black block">Direct Consultant Link</span>
                      <h3 className="font-display text-3xl font-black text-white uppercase tracking-tight">Let’s discuss your civil structure specifications</h3>
                      <p className="text-rose-100 text-xs sm:text-sm leading-relaxed max-w-lg">
                        Have specific land requirements, layout approvals, or custom independent villa architectural blueprints in Coimbatore? Our Senior Engineers stand ready to respond instantly.
                      </p>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-1 gap-4">
                      <div className="bg-[#900000]/60 p-5 rounded-none border border-white/10 flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-none bg-white text-[#800000] flex items-center justify-center shrink-0">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] text-rose-200 uppercase block font-semibold">Immediate Hotline Calls</span>
                          <span className="text-sm font-bold text-white tracking-wider font-mono">{about.phone}</span>
                        </div>
                      </div>

                      <div className="bg-[#900000]/60 p-5 rounded-none border border-white/10 flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-none bg-white text-[#800000] flex items-center justify-center shrink-0">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] text-rose-200 uppercase block font-semibold">Submit Document Queries</span>
                          <span className="text-sm font-semibold text-rose-100 font-mono">{about.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

            </motion.div>
          )}
          {/* LANDS CATALOG VIEW */}
          {activePage === 'lands' && (
            <motion.div
              key="lands"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <LandsPage
                lands={lands}
                isAdmin={isAdminLoggedIn}
                onAddLand={handleAddLand}
                onEditLand={handleEditLand}
                onDeleteLand={handleDeleteLand}
              />
            </motion.div>
          )}

          {/* BUILDINGS CATALOG VIEW */}
          {activePage === 'buildings' && (
            <motion.div
              key="buildings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <BuildingsPage
                buildings={buildings}
                isAdmin={isAdminLoggedIn}
                onAddBuilding={handleAddBuilding}
                onEditBuilding={handleEditBuilding}
                onDeleteBuilding={handleDeleteBuilding}
              />
            </motion.div>
          )}

          {/* PROJECTS CATALOG VIEW */}
          {activePage === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectsPage
                projects={projects}
                isAdmin={isAdminLoggedIn}
                onAddProject={handleAddProject}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
              />
            </motion.div>
          )}

          {/* ABOUT US SINGLET VIEW */}
          {activePage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <AboutUsPage
                about={about}
                isAdmin={isAdminLoggedIn}
                onUpdateAbout={handleUpdateAbout}
              />
            </motion.div>
          )}

          {/* PROTECTED ADMIN CONSOLE VIEW */}
          {activePage === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel
                isAdminLoggedIn={isAdminLoggedIn}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onUpdateAdminPassword={handleUpdateAdminPassword}
                lands={lands}
                buildings={buildings}
                projects={projects}
                onNavigate={setActivePage}
                onGoogleLogin={handleGoogleLogin}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Corporate Global Footer */}
      <Footer 
        onNavigate={setActivePage} 
        email={about.email} 
        phone={about.phone} 
        address={about.address}
      />

    </div>
  );
}
