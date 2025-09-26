"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ServiceCard from "../../components/ServiceCard";
import FormikServiceForm from "../../components/FormikServiceForm";
import { getServices, createService, updateService, deleteService } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function ServicePage() {
  const { user } = useAuth();

  const [formVisible, setFormVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAllServices(); }, []);

  const fetchAllServices = async () => {
    try {
      const data = await getServices("default-token");
      setServices(data || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const handleSave = async (values, { setSubmitting }) => {
    const payload = {
      ...values,
      amount: parseFloat(values.amount),
      next_due_date: new Date(values.nextDueDate).toISOString(),
      userId: user?.id || "default-user",
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
      setFormVisible(false);
      setEditingService(null);
      fetchAllServices();
    } catch (err) {
      console.error(err);
      alert("Error saving service. Try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
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
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#1E3A8A] to-blue-500 flex items-center justify-center font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-white text-sm">{displayName}</span>
          </div>
        </div>

        {/* Add Service Button */}
        <div className="px-6 py-4 border-b border-white/5">
          <button
            onClick={() => { setEditingService(null); setFormVisible(!formVisible); }}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Add Service +
          </button>
        </div>

        {/* Form */}
        {formVisible && (
          <div className="flex justify-center px-4 py-10">
            <FormikServiceForm
              initialValues={
                editingService || {
                  name: "",
                  description: "",
                  amount: "",
                  frequency: "monthly",
                  category: "Entertainment",
                  color: "#f97316",
                  nextDueDate: new Date().toISOString().split("T")[0],
                }
              }
              onSubmit={handleSave}
              onCancel={() => { setFormVisible(false); setEditingService(null); }}
              loading={loading}
            />
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
