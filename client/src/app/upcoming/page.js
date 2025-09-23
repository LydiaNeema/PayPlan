import { useEffect, useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import { getExpenses, markReimbursed } from "../utils/api";

export default function UpcomingPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const fetchUpcoming = async () => {
    setLoading(true);
    const allExpenses = await getExpenses();
    // Filter to show only unreimbursed/future payments
    const upcoming = allExpenses.filter(exp => !exp.reimbursed);
    setExpenses(upcoming);
    setLoading(false);
  };

  const handleMarkReimbursed = async (id) => {
    await markReimbursed(id);
    // Update the list
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  if (loading) return <p>Loading upcoming payments...</p>;

  return (
    <div className="upcoming-page">
      <h1>Upcoming Payments</h1>
      {expenses.length === 0 ? (
        <p>No upcoming payments.</p>
      ) : (
        expenses.map(exp => (
          <ExpenseCard
            key={exp.id}
            expense={exp}
            onMarkReimbursed={() => handleMarkReimbursed(exp.id)}
          />
        ))
      )}
    </div>
  );
}
