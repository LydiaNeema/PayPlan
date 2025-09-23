"use client";

import { Calendar, Wallet, Clock } from "lucide-react";

export default function ServiceCard({ service, onPress, showNextPayment = true, onEdit, onDelete }) {
  const handlePress = () => {
    onPress();
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return frequency;
    }
  };

  const isOverdue = () => {
    const dueDate = new Date(service.nextDueDate);
    return dueDate < new Date();
  };

  const isDueSoon = () => {
    const dueDate = new Date(service.nextDueDate);
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    return dueDate <= threeDaysFromNow && dueDate >= now;
  };

  return (
    <div
      className="cursor-pointer rounded-xl overflow-hidden shadow-lg m-3 relative"
      style={{ background: `linear-gradient(to top right, ${service.color}, ${service.color}80)` }}
    >
      {/* Edit/Delete Buttons */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        {onEdit && (
          <button onClick={(e) => { e.stopPropagation(); onEdit(service); }} className="p-1 hover:bg-white/10 rounded-full">
            <Wallet size={20} className="text-blue-400" />
          </button>
        )}
        {onDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(service.id); }} className="p-1 hover:bg-red-600/30 rounded-full">
            <Wallet size={20} className="text-red-400" />
          </button>
        )}
      </div>

      <div onClick={handlePress} className="p-5 flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-3">
            <p className="text-white font-bold text-lg mb-1">{service.name}</p>
            <p className="text-white/50 font-medium text-sm">{service.category}</p>
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full">
            <Wallet size={16} className="text-white" />
            <span className="text-white font-bold text-sm">{formatAmount(service.amount)}</span>
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <p className="text-white/70 text-sm line-clamp-2">{service.description}</p>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-white/50" />
            <span className="text-white/50 text-xs font-medium">
              {getFrequencyText(service.frequency)}
            </span>
          </div>

          {showNextPayment && (
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-white/50" />
              <span
                className={`text-xs font-medium ${
                  isOverdue() ? "text-red-400 font-semibold" : ""
                } ${isDueSoon() && !isOverdue() ? "text-yellow-300 font-semibold" : ""}`}
              >
                {isOverdue() ? "Overdue" : `Due ${formatDate(service.nextDueDate)}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
