import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, MapPin, Coins, Scaling, Edit3, Trash2, Plus, Search, X, Check, ArrowUpRight } from 'lucide-react';
import { Building } from '../types';
import ImageUploader from './ImageUploader';

interface BuildingsPageProps {
  buildings: Building[];
  isAdmin: boolean;
  onAddBuilding: (building: Omit<Building, 'id'>) => Promise<void>;
  onEditBuilding: (id: string, building: Partial<Building>) => Promise<void>;
  onDeleteBuilding: (id: string) => Promise<void>;
}

export default function BuildingsPage({ buildings, isAdmin, onAddBuilding, onEditBuilding, onDeleteBuilding }: BuildingsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuildingDetail, setSelectedBuildingDetail] = useState<Building | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Modal controls
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('₹75 Lakhs');
  const [size, setSize] = useState('1,500 sq.ft.');
  const [location, setLocation] = useState('Vadavalli, Coimbatore');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setTitle('');
    setPrice('₹80 Lakhs');
    setSize('1,600 sq.ft.');
    setLocation('Coimbatore');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80');
    setIsAddOpen(true);
  };

  const openEditModal = (building: Building) => {
    setEditingBuilding(building);
    setTitle(building.title);
    setPrice(building.price);
    setSize(building.size);
    setLocation(building.location);
    setDescription(building.description);
    setImageUrl(building.imageUrl);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddBuilding({ title, price, size, location, description, imageUrl });
      setIsAddOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBuilding) return;
    setIsSubmitting(true);
    try {
      await onEditBuilding(editingBuilding.id, { title, price, size, location, description, imageUrl });
      setEditingBuilding(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const filteredBuildings = buildings.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Header sections */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-200 pb-8 mb-12">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#800000] font-black font-mono bg-[#800000]/10 px-2.5 py-1">Completed & Ongoing Properties</span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mt-3">Independent Villas & Buildings</h1>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl">
            Exquisitely structured, fully finished architectural homes and modern multi-family flats featuring top tier construction materials, rich interiors, and clear structural clearances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="search-buildings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search complexes & houses..."
              className="w-full sm:w-64 rounded-none border border-slate-200 bg-white pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-all font-mono"
            />
          </div>

          {isAdmin && (
            <button
              id="btn-add-building"
              onClick={openAddModal}
              className="inline-flex items-center space-x-2 bg-[#800000] hover:bg-[#900000] text-white px-5 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Property</span>
            </button>
          )}
        </div>
      </div>

      {/* Buildings Grid list */}
      {filteredBuildings.length === 0 ? (
        <div className="text-center py-20 rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white">
          <p className="text-slate-500 font-mono text-sm uppercase tracking-wider">No villas or properties match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBuildings.map((building) => (
            <motion.div
              key={building.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group flex flex-col md:flex-row overflow-hidden rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              
              {/* Image side block */}
              <div className="relative w-full md:w-2/5 aspect-[12/10] md:aspect-auto overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={building.imageUrl}
                  alt={building.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Admin control panel over image */}
                {isAdmin && (
                  <div className="absolute top-3 left-3 flex space-x-1.5 z-20">
                    <button
                      id={`edit-building-${building.id}`}
                      onClick={() => openEditModal(building)}
                      className="rounded-none bg-white border border-slate-200 p-2 text-slate-700 hover:text-white hover:bg-[#800000] transition-all cursor-pointer shadow-sm"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      id={`delete-building-${building.id}`}
                      onClick={() => handleDelete(building.id)}
                      className="rounded-none bg-red-50 border border-red-200 p-2 text-red-700 hover:text-white hover:bg-red-750 transition-all cursor-pointer shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Contents block of building card */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-mono">
                    <MapPin className="h-3.5 w-3.5 text-[#800000]" />
                    <span className="truncate">{building.location}</span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 leading-snug group-hover:text-[#800000] transition-colors uppercase tracking-tight">
                    {building.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {building.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">Ready Price Quote</span>
                    <span className="text-base font-bold font-mono text-[#800000]">{building.price}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block">Carpet Area</span>
                    <span className="text-xs font-bold text-slate-900 font-mono">{building.size}</span>
                  </div>

                  <button
                    id={`view-building-${building.id}`}
                    onClick={() => setSelectedBuildingDetail(building)}
                    className="h-10 w-10 flex items-center justify-center rounded-none border border-slate-200 bg-white hover:bg-[#800000] hover:border-[#800000] hover:text-white text-slate-500 transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Slideover/Modal component */}
      <AnimatePresence>
        {selectedBuildingDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white overflow-hidden shadow-2xl"
            >
              <div className="relative aspect-[16/9] bg-slate-100">
                <img
                  src={selectedBuildingDetail.imageUrl}
                  alt={selectedBuildingDetail.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
                <button
                  id="btn-close-building-detail"
                  onClick={() => setSelectedBuildingDetail(null)}
                  className="absolute top-4 right-4 rounded-none bg-white border border-slate-200 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all font-mono"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-8 space-y-6 bg-white">
                <div>
                  <div className="flex items-center space-x-1.5 text-slate-500 text-xs uppercase tracking-wider font-mono font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-[#800000]" />
                    <span>{selectedBuildingDetail.location}</span>
                  </div>
                  <h3 className="font-display text-2xl font-black text-slate-900 mt-2 uppercase tracking-tight">{selectedBuildingDetail.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                  <div className="bg-slate-50 p-4 rounded-none border border-slate-200 border-l-4 border-l-[#800000]">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black font-mono block">Direct Quotation</span>
                    <p className="text-lg font-bold text-[#800000] font-mono mt-1">{selectedBuildingDetail.price}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-none border border-slate-200 border-l-4 border-l-[#800000]">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black font-mono block">Plinth Area Space</span>
                    <p className="text-lg font-bold text-slate-900 font-mono mt-1">{selectedBuildingDetail.size}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Property Details & Amenities</span>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedBuildingDetail.description}</p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-mono">ID: {selectedBuildingDetail.id}</p>
                  <button
                    id="btn-enquire-building"
                    onClick={() => {
                      setAlertMessage(`Thank you for calling. We have noted down interest for ${selectedBuildingDetail.title}! Our Senior Engineers will call you at the email/phone provided in the About configuration tab within 2 hours.`);
                      setSelectedBuildingDetail(null);
                    }}
                    className="bg-[#800000] hover:bg-[#900000] text-white px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest shadow-sm cursor-pointer"
                  >
                    Setup Callback Session
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT CRUD MODALS */}
      <AnimatePresence>
        {(isAddOpen || editingBuilding) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white p-6 shadow-2xl my-8 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h3 className="font-display text-base font-bold text-slate-900 uppercase tracking-wide">
                  {isAddOpen ? 'Add Architectural Building' : 'Edit Property Configuration'}
                </h3>
                <button
                  id="btn-close-building-modal"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingBuilding(null);
                  }}
                  className="rounded-none p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-950"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Property Model Name</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Amman Heritage Mansion"
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Property Price Quote</label>
                    <input
                      type="text"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. ₹95 Lakhs"
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Total Built-up Carpet Area</label>
                    <input
                      type="text"
                      required
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="e.g. 2,100 sq.ft."
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Geographical Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Singanallur, Coimbatore"
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Fascinating Property Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide highlights like 3 BHK structures, marble finishings, wooden entries, gardens..."
                    className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                {/* Integrated Media Uploader */}
                <ImageUploader
                  label="Directly Upload Property Banner Image"
                  currentImageUrl={imageUrl}
                  onUploadSuccess={(url) => setImageUrl(url)}
                />

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Or Paste Direct Web Link</label>
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
                      setEditingBuilding(null);
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
                Are you absolutely sure you want to remove this building listing permanently? This cannot be undone.
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
                    await onDeleteBuilding(id);
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
