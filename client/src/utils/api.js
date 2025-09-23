const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5555";

// Generic request helper
export async function request(path, { method = "GET", body, token, isForm = false } = {}) {
  const headers = {};

  if (token && !isForm) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw { status: res.status, message: data?.error || "Request failed", data };
  }

  return data;
}

// Auth requests
export async function signupRequest(payload) {
  // payload = { username, email, password, household_id? }
  return request("/signup", { method: "POST", body: payload });
}

export async function loginRequest(email, password) {
  return request("/login", { method: "POST", body: { email, password } });
}

export async function fetchCurrentUser(token) {
  return request("/me", { method: "GET", token });
}

// Dashboard / expenses requests
export async function getExpenses(token) {
  return request("/expenses", { method: "GET", token });
}

export async function createExpense(payload, token) {
  return request("/expenses", { method: "POST", body: payload, token });
}

export async function updateExpense(id, payload, token) {
  return request(`/expenses/${id}`, { method: "PATCH", body: payload, token });
}

export async function deleteExpense(id, token) {
  return request(`/expenses/${id}`, { method: "DELETE", token });
}

// Payments (optional for recurring services)
export async function getUpcomingPayments(token) {
  return request("/payments/upcoming", { method: "GET", token });
}

export async function getOverduePayments(token) {
  return request("/payments/overdue", { method: "GET", token });
}

export async function markPaymentAsPaid(paymentId, token) {
  return request(`/payments/${paymentId}/pay`, { method: "POST", token });
}

// ✅ Added to support DashboardPage
export async function getServices(token) {
  return request("/services", { method: "GET", token });
}
