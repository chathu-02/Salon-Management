"use client";

import { useEffect, useState } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import { Service } from '@/lib/types';
import {
  Scissors,
  Plus,
  Edit,
  Trash2,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  X,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

export default function OwnerServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Service Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    category: "Hair Care",
    price: "",
    duration_minutes: "",
    description: "",
    image_url: "",
    is_active: true,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Edit Service Modal
  const [editService, setEditService] = useState<Service | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services?all=true");
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (err) {
      console.error("Failed to load services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newService,
          price: Number(newService.price),
          duration_minutes: Number(newService.duration_minutes),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAddModalOpen(false);
        setNewService({
          name: "",
          category: "Hair Care",
          price: "",
          duration_minutes: "",
          description: "",
          image_url: "",
          is_active: true,
        });
        fetchServices();
      } else {
        setAddError(data.error || "Failed to create service");
      }
    } catch (err: any) {
      setAddError(err.message || "Network error");
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editService) return;
    setEditLoading(true);
    setEditError("");
    try {
      const res = await fetch(`/api/services/${editService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editService,
          price: Number(editService.price),
          duration_minutes: Number(editService.duration_minutes),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditService(null);
        fetchServices();
      } else {
        setEditError(data.error || "Failed to update service");
      }
    } catch (err: any) {
      setEditError(err.message || "Network error");
    } finally {
      setEditLoading(false);
    }
  };

  const toggleServiceActive = async (srv: Service) => {
    try {
      const res = await fetch(`/api/services/${srv.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !srv.is_active }),
      });
      const data = await res.json();
      if (data.success) {
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (srv: Service) => {
    if (confirm(`Are you sure you want to delete service "${srv.name}"?`)) {
      try {
        const res = await fetch(`/api/services/${srv.id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          fetchServices();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <DashboardLayout
      allowedRole="OWNER"
      title="Salon Service Offerings"
      subtitle="Define beauty menu items, pricing, durations, categories, and availability."
    >
      <div className="space-y-6">
        
        {/* Header Action Bar */}
        <div className="flex justify-between items-center bg-[#021a12] border border-[#B38B4D]/30 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-3">
            <Scissors className="w-5 h-5 text-[#B38B4D]" />
            <span className="text-sm font-semibold text-[#F5F5F0]">
              {services.length} Total Services in Salon Menu
            </span>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold flex items-center space-x-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-white/60 bg-[#021a12] rounded-2xl border border-[#B38B4D]/30">
            <Scissors className="w-12 h-12 mx-auto text-white/20 mb-3" />
            <h4 className="text-base font-bold text-white/80">No services added</h4>
            <p className="text-xs">Click the button above to add your first salon service.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between group hover:border-[#B38B4D] transition-all relative overflow-hidden"
              >
                <div>
                  <div className="h-40 rounded-xl overflow-hidden mb-4 relative bg-black/40 border border-white/5">
                    <img
                      src={srv.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop"}
                      alt={srv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[#B38B4D] border border-[#B38B4D]/40">
                        {srv.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-[#F5F5F0] font-serif leading-tight">
                      {srv.name}
                    </h3>
                  </div>

                  <p className="text-xs text-white/60 line-clamp-2 mb-4 leading-relaxed">
                    {srv.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 mb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block">Price</span>
                      <span className="text-lg font-bold text-[#F5F5F0] font-serif">
                        Rs. {srv.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block">Duration</span>
                      <span className="text-xs font-semibold text-[#B38B4D] flex items-center justify-end">
                        <Clock className="w-3 h-3 mr-1" /> {srv.duration_minutes} Mins
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => toggleServiceActive(srv)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                        srv.is_active
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {srv.is_active ? "Available" : "Deactivated"}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditService(srv)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#B38B4D] border border-white/10 transition-colors"
                        title="Edit Service"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteService(srv)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add Service Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#021a12] border border-[#B38B4D]/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-[#B38B4D]" />
                <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">
                  Add New Salon Service
                </h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="e.g. Royal Keratin Treatment"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Category
                  </label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  >
                    <option value="Hair Care">Hair Care</option>
                    <option value="Hair Coloring">Hair Coloring</option>
                    <option value="Skincare & Spa">Skincare & Spa</option>
                    <option value="Scalp Spa">Scalp Spa</option>
                    <option value="Nail Lounge">Nail Lounge</option>
                    <option value="Bridal & Glamour">Bridal & Glamour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    required
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    placeholder="3500"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    value={newService.duration_minutes}
                    onChange={(e) => setNewService({ ...newService, duration_minutes: e.target.value })}
                    placeholder="45"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newService.image_url}
                    onChange={(e) => setNewService({ ...newService, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Service Description
                </label>
                <textarea
                  rows={3}
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Describe treatment benefits and details..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold shadow-lg"
                >
                  {addLoading ? "Creating..." : "Add to Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#021a12] border border-[#B38B4D]/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Edit className="w-5 h-5 text-[#B38B4D]" />
                <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">
                  Edit Service: {editService.name}
                </h3>
              </div>
              <button
                onClick={() => setEditService(null)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={editService.name}
                  onChange={(e) => setEditService({ ...editService, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Category
                  </label>
                  <select
                    value={editService.category}
                    onChange={(e) => setEditService({ ...editService, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  >
                    <option value="Hair Care">Hair Care</option>
                    <option value="Hair Coloring">Hair Coloring</option>
                    <option value="Skincare & Spa">Skincare & Spa</option>
                    <option value="Scalp Spa">Scalp Spa</option>
                    <option value="Nail Lounge">Nail Lounge</option>
                    <option value="Bridal & Glamour">Bridal & Glamour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    required
                    value={editService.price}
                    onChange={(e) => setEditService({ ...editService, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    value={editService.duration_minutes}
                    onChange={(e) => setEditService({ ...editService, duration_minutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editService.image_url}
                    onChange={(e) => setEditService({ ...editService, image_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Service Description
                </label>
                <textarea
                  rows={3}
                  value={editService.description}
                  onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditService(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold shadow-lg"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
