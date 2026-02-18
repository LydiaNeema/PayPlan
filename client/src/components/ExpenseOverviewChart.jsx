"use client";

import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { getServices } from "../utils/api";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];

export default function ExpenseOverviewChart() {
  const { token } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getServices(token);

        // Group services by category
        const categoryTotals = {};
        services.forEach((s) => {
          const category = s.category || "Other";
          categoryTotals[category] = (categoryTotals[category] || 0) + (s.monthlyCost || 0);
        });

        // Format into chart data
        const chartData = Object.keys(categoryTotals).map((cat) => ({
          name: cat,
          value: categoryTotals[cat],
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    if (token) fetchServices();
  }, [token]);

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("en-KE", {
                style: "currency",
                currency: "KES",
                minimumFractionDigits: 0,
              }).format(value)
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}