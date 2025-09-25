"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Crown, UserCheck, Mail, Trash2, Search, Bell } from "lucide-react";
import Navbar from "../../components/Navbar";
import HouseholdCard from "../../components/HouseholdCard";
import { getHousehold, createMember, updateMember, deleteMember } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function HouseholdPage() {
  const { user } = useAuth();
  const [household, setHousehold] = useState(null);
  const [members, setMembers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteData, setInviteData] = useState({ name: "", email: "", password: "", role: "member" });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  // Try to get token from localStorage
  useEffect(() => {
    const t = localStorage.getItem("pp_token");
    if (t) setToken(t);
    fetchHousehold(t);
  }, []);

  const fetchHousehold = async (tkn) => {
    try {
      const data = await getHousehold(tkn || token);
      setHousehold(data);
      setMembers(data.members || []);
    } catch (err) {
      console.error("Failed to fetch household", err);
      setHousehold(null);
      setMembers([]);
    }
  };

  const handleInvite = async () => {
    if (!inviteData.name.trim() || !inviteData.email.trim() || !inviteData.password.trim()) {
      alert("Please fill name, email and password");
      return;
    }
    try {
      setLoading(true);
      const created = await createMember(
        {
          name: inviteData.name,
          email: inviteData.email,
          password: inviteData.password,
          role: inviteData.role,
        },
        token
      );
      setMembers((prev) => [...prev, created]);
      setInviteData({ name: "", email: "", password: "", role: "member" });
      setShowInvite(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (member) => {
    if (member.role === "owner") {
      alert("Cannot remove the household owner");
      return;
    }
    if (!confirm(`Remove ${member.name}?`)) return;
    try {
      await deleteMember(member.id, token);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    } catch (err) {
      console.error(err);
      alert("Failed to remove member");
    }
  };

  const handleEdit = async (member) => {
    const newName = prompt("New name", member.name);
    const newEmail = prompt("New email", member.email);
    const newRole = prompt("Role (owner/admin/member)", member.role) || member.role;

    if (!newName || !newEmail) return;
    try {
      const updated = await updateMember(member.id, { name: newName, email: newEmail, role: newRole }, token);
      setMembers(members.map((m) => (m.id === updated.id ? updated : m)));
    } catch (err) {
      console.error(err);
      alert("Failed to update member");
    }
  };

  const displayName =
    user?.username || user?.name || (user?.email ? user.email.split("@")[0] : "User");

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33] text-white">
      <Navbar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur-md">
          <h1 className="text-xl font-bold tracking-wide">Household</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search members"
                className="bg-white/5 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/20"
              />
            </div>
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <Bell size={20} className="text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-[#0A1A33] flex items-center justify-center font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-white text-sm">{displayName}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-6 py-6">
          {/* Household Info */}
          <div className="mb-8">
            {household ? (
              <HouseholdCard household={household} />
            ) : (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow p-6">
                <p className="text-white/70">
                  No household found — make sure you're logged in and belong to a
                  household.
                </p>
              </div>
            )}
          </div>

          {/* Members Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Members</h2>
            <button
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md transition-colors"
              onClick={() => setShowInvite(true)}
            >
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {members.length === 0 ? (
              <div className="text-center py-10 text-white/60">
                <p className="text-lg font-semibold">No members yet</p>
                <p>Add members to start sharing your household expenses.</p>
              </div>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-white/60">{member.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {member.role === "owner" ? (
                        <Crown className="text-amber-400 w-4 h-4" />
                      ) : null}
                      {member.role === "admin" ? (
                        <UserCheck className="text-indigo-500 w-4 h-4" />
                      ) : null}
                      <span
                        className={`text-sm font-medium ${
                          member.role === "owner"
                            ? "text-amber-400"
                            : member.role === "admin"
                            ? "text-indigo-500"
                            : "text-gray-400"
                        }`}
                      >
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-md hover:bg-white/10"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>
                    {member.role !== "owner" && (
                      <button
                        className="p-2 rounded-md hover:bg-red-600/30 transition-colors"
                        onClick={() => handleRemove(member)}
                      >
                        <Trash2 className="text-red-400 w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg w-96 p-6">
            <div className="flex justify-between mb-4">
              <button
                className="text-white/70"
                onClick={() => setShowInvite(false)}
              >
                Cancel
              </button>
              <h3 className="font-semibold text-lg text-white">Create Member</h3>
              <button
                className="text-indigo-400 font-semibold"
                onClick={handleInvite}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/70">
                Name
              </label>
              <input
                className="w-full rounded-md bg-transparent border border-white/20 px-3 py-2 text-white"
                type="text"
                value={inviteData.name}
                onChange={(e) =>
                  setInviteData({ ...inviteData, name: e.target.value })
                }
              />
              <label className="block text-sm font-medium text-white/70">
                Email
              </label>
              <input
                className="w-full rounded-md bg-transparent border border-white/20 px-3 py-2 text-white"
                type="email"
                value={inviteData.email}
                onChange={(e) =>
                  setInviteData({ ...inviteData, email: e.target.value })
                }
              />
              <label className="block text-sm font-medium text-white/70">
                Password
              </label>
              <input
                className="w-full rounded-md bg-transparent border border-white/20 px-3 py-2 text-white"
                type="password"
                value={inviteData.password}
                onChange={(e) =>
                  setInviteData({ ...inviteData, password: e.target.value })
                }
              />
              <label className="block text-sm font-medium text-white/70">
                Role
              </label>
              <select
                className="w-full rounded-md bg-transparent border border-white/20 px-3 py-2 text-white"
                value={inviteData.role}
                onChange={(e) =>
                  setInviteData({ ...inviteData, role: e.target.value })
                }
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-sm text-white/50">
                The created member will be able to login using the email and
                password you provide.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
