import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Coins, Scaling, Edit3, Trash2, Plus, Search, X, Check, Eye } from 'lucide-react';
import { Land } from '../types';
import ImageUploader from './ImageUploader';

interface LandsPageProps {
  lands: Land[];
  isAdmin: boolean;
  onAddLand: (land: Omit<Land, 'id'>) => Promise<void>;
  onEditLand: (id: string, land: Partial<Land>) => Promise<void>;
  onDeleteLand: (id: string) => Promise<void>;
}

export default function LandsPage({ lands, isAdmin, onAddLand, onEditLand, onDeleteLand }: LandsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLandForDetail, setSelectedLandForDetail] = useState<Land | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Modal control states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<Land | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('₹45 Lakhs');
  const [size, setSize] = useState('1,200 sq.ft.');
  const [location, setLocation] = useState('Saravanampatti, Coimbatore');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setTitle('');
    setPrice('₹50 Lakhs');
    setSize('1,200 sq.ft.');
    setLocation('Coimbatore');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80');
    setIsAddOpen(true);
  };

  const openEditModal = (land: Land) => {
    setEditingLand(land);
    setTitle(land.title);
    setPrice(land.price);
    setSize(land.size);
    setLocation(land.location);
    setDescription(land.description);
    setImageUrl(land.imageUrl);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddLand({ title, price, size, location, description, imageUrl });
      setIsAddOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLand) return;
    setIsSubmitting(true);
    try {
      await onEditLand(editingLand.id, { title, price, size, location, description, imageUrl });
      setEditingLand(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const filteredLands = lands.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-200 pb-8 mb-12">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#800000] font-black font-mono bg-[#800000]/10 px-2.5 py-1">Investment Opportunities</span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mt-3">Premium plots & vacant land layouts</h1>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl">
            Highly demanding, handpicked real-estate properties with transparent registration documents and premium road templates ready for immediate construction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="input-search-lands"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by area or layout name..."
              className="w-full sm:w-64 rounded-none border border-slate-200 bg-white pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-all font-mono"
            />
          </div>

          {isAdmin && (
            <button
              id="btn-add-land"
              onClick={openAddModal}
              className="inline-flex items-center space-x-2 bg-[#800000] hover:bg-[#900000] text-white px-5 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Land</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid List */}
      {filteredLands.length === 0 ? (
        <div className="text-center py-20 rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white">
          <p className="text-slate-500 font-mono text-sm uppercase tracking-wider">No plots or configurations matched your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLands.map((land) => (
            <motion.div
              key={land.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex flex-col justify-between overflow-hidden rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white shadow-sm transition-all duration-300 hover:shadow-md"
            >
              
              {/* Media Part */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={land.imageUrl}
                  alt={land.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Admin quick triggers overlays */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex space-x-2 z-20">
                    <button
                      id={`edit-land-${land.id}`}
                      onClick={() => openEditModal(land)}
                      className="rounded-none bg-white/95 border border-slate-200 p-2 text-slate-700 hover:text-white hover:bg-[#800000] transition-all cursor-pointer shadow-sm"
                      title="Edit Properties"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      id={`delete-land-${land.id}`}
                      onClick={() => handleDelete(land.id)}
                      className="rounded-none bg-red-50 border border-red-200 p-2 text-red-700 hover:text-white hover:bg-red-700 transition-all cursor-pointer shadow-sm"
                      title="Delete Listing"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Badges price label overlay on media tag */}
                <div className="absolute bottom-3 left-3 bg-[#800000] px-3 py-1.5 rounded-none flex items-center space-x-1.5 shadow-md">
                  <Coins className="h-3.5 w-3.5 text-white" />
                  <span className="text-xs font-mono font-bold text-white">{land.price}</span>
                </div>
              </div>

              {/* Informational Cards Details */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-mono mb-2">
                    <MapPin className="h-3.5 w-3.5 text-[#800000]" />
                    <span className="truncate">{land.location}</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-900 line-clamp-1 group-hover:text-[#800000] transition-colors uppercase tracking-tight">
                    {land.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-6 mt-2">
                    {land.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-500 text-xs font-mono">
                    <Scaling className="h-4 w-4 text-slate-400" />
                    <span>Area Size: <span className="text-[#800000] font-bold">{land.size}</span></span>
                  </div>

                  <button
                    id={`view-land-details-${land.id}`}
                    onClick={() => setSelectedLandForDetail(land)}
                    className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-[#800000] hover:text-[#900000] cursor-pointer"
                  >
                    <span>View More</span>
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Slideover/Modal component */}
      <AnimatePresence>
        {selectedLandForDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white overflow-hidden shadow-2xl"
            >
              <div className="relative aspect-[16/9] bg-slate-100">
                <img
                  src={selectedLandForDetail.imageUrl}
                  alt={selectedLandForDetail.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
                <button
                  id="btn-close-land-detail"
                  onClick={() => setSelectedLandForDetail(null)}
                  className="absolute top-4 right-4 rounded-none bg-white border border-slate-200 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all font-mono"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-8 space-y-6 bg-white">
                <div>
                  <div className="flex items-center space-x-1.5 text-slate-500 text-xs uppercase tracking-wider font-semibold font-mono">
                    <MapPin className="h-3.5 w-3.5 text-[#800000]" />
                    <span>{selectedLandForDetail.location}</span>
                  </div>
                  <h3 className="font-display text-2xl font-black text-slate-900 mt-2 uppercase tracking-tight">{selectedLandForDetail.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                  <div className="bg-slate-50 p-4 rounded-none border border-slate-200 border-l-4 border-l-[#800000]">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black font-mono block">Valuation Cost</span>
                    <p className="text-lg font-bold text-[#800000] font-mono mt-1">{selectedLandForDetail.price}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-none border border-slate-200 border-l-4 border-l-[#800000]">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black font-mono block">Layout Size</span>
                    <p className="text-lg font-bold text-slate-900 font-mono mt-1">{selectedLandForDetail.size}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Property Description</span>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedLandForDetail.description}</p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-mono">ID: {selectedLandForDetail.id}</p>
                  <button
                    id="btn-enquire-land"
                    onClick={() => {
                      setAlertMessage(`Thank you for your interest in ${selectedLandForDetail.title}! Please reach out directly to us through the details configured on the About Page, or call +91 94432 54321.`);
                      setSelectedLandForDetail(null);
                    }}
                    className="bg-[#800000] hover:bg-[#900000] text-white px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest shadow-sm cursor-pointer"
                  >
                    Send Inquiries Call
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT CRUD MODALS */}
      <AnimatePresence>
        {(isAddOpen || editingLand) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white p-6 shadow-2xl my-8 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h3 className="font-display text-base font-bold text-slate-900 uppercase tracking-wide">
                  {isAddOpen ? 'Add New Land Plot Listing' : 'Edit Land Plot Configuration'}
                </h3>
                <button
                  id="btn-close-crud-modal"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingLand(null);
                  }}
                  className="rounded-none p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-950"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Land/Layout Banner Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Amman Garden Phase-2"
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Land Price (with Currency)</label>
                    <input
                      type="text"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. ₹55 Lakhs"
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Area Size</label>
                    <input
                      type="text"
                      required
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="e.g. 1,500 sq.ft. or 2.5 Cents"
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Location Area</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Peelamedu, Coimbatore"
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Property Highlighting Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter comprehensive details, approval states, road links, water etc..."
                    className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                {/* Integrated Media Uploader */}
                <ImageUploader
                  label="Directly Upload Land Layout Photo"
                  currentImageUrl={imageUrl}
                  onUploadSuccess={(url) => setImageUrl(url)}
                />

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Or Paste Custom Image Web Link</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddOpen(false);
                      setEditingLand(null);
                    }}
                    className="rounded-none border border-slate-200 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-none bg-[#800000] hover:bg-[#900000] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-none border-l-4 border-l-red-600 border-y border-r border-slate-200 bg-white p-6 shadow-2xl"
            >
              <h3 className="font-display text-base font-bold text-slate-900 uppercase tracking-wide">
                Confirm Deletion
              </h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Are you absolutely sure you want to remove this vacancy layout permanently? This cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="rounded-none border border-slate-200 bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const id = confirmDeleteId;
                    setConfirmDeleteId(null);
                    await onDeleteLand(id);
                  }}
                  className="rounded-none bg-red-600 hover:bg-red-700 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Delete Listing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BEAUTIFUL ALERT DIALOG MODAL */}
      <AnimatePresence>
        {alertMessage && (
          <div className="fixed inset-0 z-[115] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center space-x-2 text-[#800000] border-b border-slate-100 pb-3">
                <Check className="h-5 w-5" />
                <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Notification Center
                </h3>
              </div>
              <p className="text-slate-600 text-xs mt-4 leading-relaxed whitespace-pre-line">
                {alertMessage}
              </p>
              <div className="flex items-center justify-end pt-4 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAlertMessage(null)}
                  className="rounded-none bg-[#800000] hover:bg-[#900000] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-sm cursor-pointer"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
