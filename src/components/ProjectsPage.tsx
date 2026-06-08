import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, Calendar, ClipboardList, Edit3, Trash2, Plus, Search, X, CheckCheck, Check } from 'lucide-react';
import { Project } from '../types';
import ImageUploader from './ImageUploader';

interface ProjectsPageProps {
  projects: Project[];
  isAdmin: boolean;
  onAddProject: (project: Omit<Project, 'id'>) => Promise<void>;
  onEditProject: (id: string, project: Partial<Project>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
}

export default function ProjectsPage({ projects, isAdmin, onAddProject, onEditProject, onDeleteProject }: ProjectsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjDetail, setSelectedProjDetail] = useState<Project | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Modal controls
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Peelamedu, Coimbatore');
  const [specification, setSpecification] = useState('');
  const [description, setDescription] = useState('');
  const [completionDate, setCompletionDate] = useState('September 2026');
  const [imageUrl, setImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setTitle('');
    setLocation('Coimbatore');
    setSpecification('RCC Framed Structure, Fe550 Reinforcements, 100% solar support');
    setDescription('');
    setCompletionDate('December 2026');
    setImageUrl('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80');
    setIsAddOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setLocation(proj.location);
    setSpecification(proj.specification);
    setDescription(proj.description);
    setCompletionDate(proj.completionDate);
    setImageUrl(proj.imageUrl);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddProject({ title, location, specification, description, imageUrl, completionDate });
      setIsAddOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSubmitting(true);
    try {
      await onEditProject(editingProject.id, { title, location, specification, description, imageUrl, completionDate });
      setEditingProject(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-200 pb-8 mb-12">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#800000] font-black font-mono bg-[#800000]/10 px-2.5 py-1">Showcase of Landmarks</span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mt-3">Our construction landmarks & civil works</h1>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl">
            From heavy commercial workspaces with advanced central utilities to elite high-end residential layouts, we translate precise blueprints into stable structural achievements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="search-projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specifications or titles..."
              className="w-full sm:w-64 rounded-none border border-slate-200 bg-white pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-all font-mono"
            />
          </div>

          {isAdmin && (
            <button
              id="btn-add-project"
              onClick={openAddModal}
              className="inline-flex items-center space-x-2 bg-[#800000] hover:bg-[#900000] text-white px-5 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid panel */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white">
          <p className="text-slate-500 font-mono text-sm uppercase tracking-wider">No landmarks matched your search queries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex flex-col justify-between overflow-hidden rounded-none border border-slate-200 border-l-4 border-l-[#800000] bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              
              {/* Card Banner Part */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlaid Date */}
                <div className="absolute top-3 left-3 bg-[#800000]/95 px-3 py-1.5 rounded-none flex items-center space-x-1.5 text-white text-[10px] font-mono font-bold shadow-md uppercase tracking-wider">
                  <Calendar className="h-3.5 w-3.5 text-white" />
                  <span>Completion: <span className="text-white underline">{project.completionDate}</span></span>
                </div>

                {/* Admin Quick Buttons */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex space-x-1.5 z-20">
                    <button
                      id={`edit-proj-${project.id}`}
                      onClick={() => openEditModal(project)}
                      className="rounded-none bg-white border border-slate-200 p-2 text-slate-700 hover:text-white hover:bg-[#800000] transition-all cursor-pointer shadow-sm"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      id={`delete-proj-${project.id}`}
                      onClick={() => handleDelete(project.id)}
                      className="rounded-none bg-red-50 border border-red-200 p-2 text-red-700 hover:text-white hover:bg-red-700 transition-all cursor-pointer shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Informational Details */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-mono">
                    <MapPin className="h-3.5 w-3.5 text-[#800000]" />
                    <span className="truncate">{project.location}</span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-[#800000] transition-colors uppercase tracking-tight">
                    {project.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Specifications strip */}
                <div className="pt-4 mt-6 border-t border-slate-150 space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <ClipboardList className="h-4 w-4 text-[#800000] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="text-slate-400 uppercase font-bold text-[9px] font-mono block">Specifications</span>
                      <p className="text-slate-700 line-clamp-2 mt-0.5">{project.specification}</p>
                    </div>
                  </div>

                  <button
                    id={`view-project-details-${project.id}`}
                    onClick={() => setSelectedProjDetail(project)}
                    className="w-full text-center block rounded-none border border-slate-200 bg-white py-2.5 text-xs font-bold uppercase tracking-widest text-[#800000] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Examine Specifications
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Details Slideover/Modal component */}
      <AnimatePresence>
        {selectedProjDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white overflow-hidden shadow-2xl"
            >
              <div className="relative aspect-[16/9] bg-slate-150">
                <img
                  src={selectedProjDetail.imageUrl}
                  alt={selectedProjDetail.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
                <button
                  id="btn-close-project-detail"
                  onClick={() => setSelectedProjDetail(null)}
                  className="absolute top-4 right-4 rounded-none bg-white border border-slate-200 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all font-mono"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-8 space-y-6 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5 text-slate-550 text-xs uppercase tracking-wider font-mono font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-[#800000]" />
                      <span>{selectedProjDetail.location}</span>
                    </div>
                    <h3 className="font-display text-2xl font-black text-slate-900 mt-2 uppercase tracking-tight">{selectedProjDetail.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-mono uppercase block tracking-widest">Timeline Date</span>
                    <span className="text-xs bg-slate-50 border border-slate-200 px-3 py-1 rounded-none font-bold font-mono mt-1 inline-block text-slate-900">{selectedProjDetail.completionDate}</span>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-5 rounded-none border border-slate-200 border-l-4 border-l-[#800000]">
                  <span className="text-xs font-bold text-[#800000] flex items-center gap-1.5 uppercase tracking-wide">
                    <ClipboardList className="h-4 w-4" /> Hard Core Specifications & Approved Materials
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed">{selectedProjDetail.specification}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Project Architectural Context & Overview</span>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedProjDetail.description}</p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-mono">ID: {selectedProjDetail.id}</p>
                  <button
                    id="btn-project-site-visit"
                    onClick={() => {
                      setAlertMessage(`Site engineering schedule has been prompted for ${selectedProjDetail.title}! One of our engineers will ring back dynamically to finalize safe slot timings.`);
                      setSelectedProjDetail(null);
                    }}
                    className="bg-[#800000] hover:bg-[#900000] text-white px-6 py-3 rounded-none text-xs font-bold uppercase tracking-widest shadow-sm cursor-pointer"
                  >
                    Schedule Direct Site Visit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CRUD MODALS PANEL */}
      <AnimatePresence>
        {(isAddOpen || editingProject) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-none border-l-4 border-l-[#800000] border-y border-r border-slate-200 bg-white p-6 shadow-2xl my-8 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h3 className="font-display text-base font-bold text-slate-900 uppercase tracking-wide">
                  {isAddOpen ? 'Add Elite Landmark Project' : 'Edit Project Specifications'}
                </h3>
                <button
                  id="btn-close-project-modal"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingProject(null);
                  }}
                  className="rounded-none p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-955"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Landmark Project Name</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Amman Corporate Center"
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Project Area Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Saravanampatti, Coimbatore"
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Structural Timeline / Date</label>
                    <input
                      type="text"
                      required
                      value={completionDate}
                      onChange={(e) => setCompletionDate(e.target.value)}
                      placeholder="e.g. December 2026 or Delivered"
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Image Upload / Photo link</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Strict Structural Specifications</label>
                  <input
                    type="text"
                    required
                    value={specification}
                    onChange={(e) => setSpecification(e.target.value)}
                    placeholder="e.g. B+G+5 layouts, Teak Entries, Eco Rain harvesting..."
                    className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase font-mono">Descriptive Historical Context</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail structural phases, client scopes, design templates, and engineering milestones..."
                    className="w-full rounded-none border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
                  />
                </div>

                {/* Integrated Media Uploader */}
                <ImageUploader
                  label="Directly Upload Landmark Site Photo"
                  currentImageUrl={imageUrl}
                  onUploadSuccess={(url) => setImageUrl(url)}
                />

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddOpen(false);
                      setEditingProject(null);
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
                Are you absolutely sure you want to remove this landmark project listing? This cannot be undone.
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
                    await onDeleteProject(id);
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
