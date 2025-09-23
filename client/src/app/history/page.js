import { useEffect, useState } from "react";
import ExpenseCard from "../components/ExpenseCard";
import { getExpenses } from "../utils/api";

export default function HistoryPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const allExpenses = await getExpenses();
    // Show only reimbursed/settled payments
    const history = allExpenses.filter(exp => exp.reimbursed);
    setExpenses(history);
    setLoading(false);
  };

  if (loading) return <p>Loading payment history...</p>;

  return (
    <div className="history-page">
      <h1>Payment History</h1>
      {expenses.length === 0 ? (
        <p>No past payments.</p>
      ) : (
        expenses.map(exp => (
          <ExpenseCard key={exp.id} expense={exp} />
        ))
      )}
    </div>
  );
}
