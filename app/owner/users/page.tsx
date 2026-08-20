"use client";

import { useEffect, useState } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import { User, UserRole } from '@/lib/types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Phone,
  Mail,
  Lock,
} from "lucide-react";

export default function OwnerUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Create Staff Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "RECEPTIONIST" as UserRole,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit User Modal State
  const [editModalUser, setEditModalUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    role: "RECEPTIONIST" as UserRole,
    is_active: true,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append("role", roleFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });
      const data = await res.json();
      if (data.success) {
        setCreateModalOpen(false);
        setNewStaff({ name: "", email: "", password: "", phone: "", role: "RECEPTIONIST" });
        fetchUsers();
      } else {
        setCreateError(data.error || "Failed to create user");
      }
    } catch (err: any) {
      setCreateError(err.message || "Network error");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalUser) return;
    setEditLoading(true);
    setEditError("");
    try {
      const res = await fetch(`/api/admin/users/${editModalUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setEditModalUser(null);
        fetchUsers();
      } else {
        setEditError(data.error || "Failed to update user");
      }
    } catch (err: any) {
      setEditError(err.message || "Network error");
    } finally {
      setEditLoading(false);
    }
  };

  const toggleUserActive = async (user: User) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Are you sure you want to permanently remove account for ${user.name}?`)) {
      try {
        const res = await fetch(`/api/admin/users/${user.id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          fetchUsers();
        } else {
          alert(data.error || "Could not delete user");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getRoleBadge = (role: UserRole) => {
    if (role === "OWNER") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <ShieldCheck className="w-3 h-3 mr-1" /> Owner
        </span>
      );
    }
    if (role === "RECEPTIONIST") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <UserCheck className="w-3 h-3 mr-1" /> Receptionist
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
        <UserIcon className="w-3 h-3 mr-1" /> Client
      </span>
    );
  };

  return (
    <DashboardLayout
      allowedRole="OWNER"
      title="User & Staff Management"
      subtitle="The Owner is the sole authority with access to manage salon staff accounts, roles, and client profiles."
    >
      <div className="space-y-6">
        
        {/* Controls & Add Staff Button */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search user name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] placeholder-white/30 focus:outline-none focus:border-[#B38B4D]"
            />
          </form>

          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-black/40 border border-[#B38B4D]/30 text-xs text-[#F5F5F0] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#B38B4D]"
            >
              <option value="">All Roles</option>
              <option value="RECEPTIONIST">Receptionists</option>
              <option value="CLIENT">Clients</option>
              <option value="OWNER">Owners</option>
            </select>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold flex items-center space-x-2 shadow-lg transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Receptionist</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-white/60 space-y-2">
              <Users className="w-12 h-12 mx-auto text-white/20" />
              <h4 className="text-base font-bold text-white/80">No users found</h4>
              <p className="text-xs">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 border-b border-[#B38B4D]/20 text-[11px] font-bold uppercase tracking-wider text-white/50">
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-[#B38B4D]/20 border border-[#B38B4D]/30 flex items-center justify-center text-xs font-bold text-[#B38B4D]">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#F5F5F0]">{u.name}</p>
                            <p className="text-xs text-white/50">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {getRoleBadge(u.role)}
                      </td>

                      <td className="p-4 text-xs text-white/70">
                        {u.phone || <span className="text-white/30 italic">Not set</span>}
                      </td>

                      <td className="p-4">
                        <button
                          disabled={u.role === "OWNER"}
                          onClick={() => toggleUserActive(u)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                            u.is_active
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/30"
                          }`}
                          title={u.role === "OWNER" ? "Owner cannot be deactivated" : "Click to toggle status"}
                        >
                          {u.is_active ? "Active" : "Deactivated"}
                        </button>
                      </td>

                      <td className="p-4 text-xs text-white/50">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditModalUser(u);
                              setEditForm({
                                name: u.name,
                                phone: u.phone || "",
                                role: u.role,
                                is_active: u.is_active,
                              });
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#B38B4D] border border-white/10 transition-colors"
                            title="Edit user details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {u.role !== "OWNER" && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Create Staff Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#021a12] border border-[#B38B4D]/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-[#B38B4D]" />
                <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">
                  Add New Reception Staff
                </h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Staff Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Elena Rostova"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Staff Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="elena@thecrown.com"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="+94 77 123 4567"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Assigned Password
                </label>
                <input
                  type="password"
                  required
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold shadow-lg"
                >
                  {createLoading ? "Creating Staff..." : "Create Staff Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#021a12] border border-[#B38B4D]/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Edit className="w-5 h-5 text-[#B38B4D]" />
                <h3 className="text-lg font-bold text-[#F5F5F0] font-serif">
                  Edit User: {editModalUser.name}
                </h3>
              </div>
              <button
                onClick={() => setEditModalUser(null)}
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

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              {editModalUser.role !== "OWNER" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Assigned Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                  >
                    <option value="RECEPTIONIST">Receptionist</option>
                    <option value="CLIENT">Client</option>
                    <option value="OWNER">Owner / Admin</option>
                  </select>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold shadow-lg"
                >
                  {editLoading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
