"use client";

import { useState, useEffect } from "react";
import { X, Check, Wallet, Search, Bell } from "lucide-react";
import Navbar from "../../components/Navbar";
import ServiceCard from "../../components/ServiceCard";
import { getServices, createService, updateService, deleteService } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const categories = [ "Entertainment", "Utilities", "Health & Fitness",
  "Transportation", "Food & Dining", "Shopping", "Education", "Other" ];

const frequencies = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const serviceColors = ["#f97316","#6366f1","#10b981","#f43f5e","#eab308","#8b5cf6","#14b8a6","#f59e0b"];

export default function ServicePage() {
  const { user } = useAuth();

  const [formVisible, setFormVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [category, setCategory] = useState("Entertainment");
  const [selectedColor, setSelectedColor] = useState(serviceColors[0]);
  const [nextDueDate, setNextDueDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => { fetchAllServices(); }, []);

  const fetchAllServices = async () => {
    try {
      const data = await getServices("default-token");
      setServices(data || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const resetForm = () => {
    setName(""); setDescription(""); setAmount("");
    setFrequency("monthly"); setCategory("Entertainment");
    setSelectedColor(serviceColors[0]);
    setNextDueDate(new Date().toISOString().split("T")[0]);
    setEditingService(null);
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("Please enter a service name");
    if (!amount.trim() || isNaN(parseFloat(amount))) return alert("Please enter a valid amount");

    const payload = {
      name: name.trim(),
      description: description.trim(),
      amount: parseFloat(amount),
      frequency,
      category,
      color: selectedColor,
      nextDueDate: new Date(nextDueDate).toISOString(),
      userId: "default-user",
    };

    try {
      setLoading(true);
      if (editingService) {
        await updateService(editingService.id, payload, "default-token");
        alert("Service updated successfully!");
      } else {
        await createService(payload, "default-token");
        alert("Service added successfully!");
      }
      resetForm();
      setFormVisible(false);
      fetchAllServices();
    } catch (err) {
      console.error(err);
      alert("Error saving service. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setAmount(service.amount.toString());
    setFrequency(service.frequency);
    setCategory(service.category);
    setSelectedColor(service.color);
    setNextDueDate(new Date(service.nextDueDate).toISOString().split("T")[0]);
    setFormVisible(true);
  };

  const handleDelete = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService(serviceId, "default-token");
      alert("Service deleted!");
      setServices(services.filter((s) => s.id !== serviceId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete service.");
    }
  };

  const displayName =
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "User");

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33] text-white">
      <Navbar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur-md">
          <h1 className="text-xl font-bold tracking-wide">Service</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search services"
                className="bg-white/5 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/20"
              />
            </div>
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <Bell size={20} className="text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#1E3A8A] to-blue-500 flex items-center justify-center font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-white text-sm">{displayName}</span>
            </div>
          </div>
        </div>

        {/* Add Service Button */}
        <div className="px-6 py-4 border-b border-white/5">
          <button
            onClick={() => { resetForm(); setFormVisible(!formVisible); }}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Add Service +
          </button>
        </div>

        {/* Form */}
        {formVisible && (
          <div className="flex justify-center px-4 py-10">
            <div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8 space-y-8">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setFormVisible(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={24} className="text-white/70" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="p-2 rounded-full hover:bg-green-600/30 transition-colors"
                >
                  <Check size={24} className="text-green-400" />
                </button>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Service Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Netflix, Spotify"
                  className="w-full rounded-lg px-4 py-3 bg-white/10 border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description or notes"
                  rows={3}
                  className="w-full rounded-lg px-4 py-3 bg-white/10 border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Amount *</label>
                  <div className="flex items-center rounded-lg px-4 py-3 bg-white/10 border border-white/20">
                    <Wallet size={20} className="text-white/60 mr-2" />
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="KES 0.00"
                      className="flex-1 bg-transparent placeholder-white/50 outline-none"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Next Due Date</label>
                  <input
                    type="date"
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Frequency</label>
                <div className="flex gap-3">
                  {frequencies.map((freq) => (
                    <button
                      key={freq.key}
                      onClick={() => setFrequency(freq.key)}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                        frequency === freq.key
                          ? "bg-green-600 text-white"
                          : "bg-white/10 text-white/60 hover:bg-white/20"
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-full font-semibold ${
                        category === cat
                          ? "bg-white/20 border border-white/30 text-white"
                          : "bg-white/10 text-white/60 hover:bg-white/20"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Service Color</label>
                <div className="flex gap-3 flex-wrap">
                  {serviceColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-white scale-110"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {services.length === 0 ? (
            <p className="text-gray-400">No services added yet.</p>
          ) : (
            services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => handleEdit(service)}
                onDelete={() => handleDelete(service.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
