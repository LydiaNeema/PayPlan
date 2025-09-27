const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://payplan.onrender.com";

export async function request(
  path,
  { method = "GET", body, token, isForm = false } = {}
) {
  const headers = {};

  if (token && !isForm) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  const url = `${BASE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");

  const res = await fetch(url, {
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

// -------------------- Auth --------------------
export async function signupRequest(payload) {
  return request("/auth/signup", { method: "POST", body: payload });
}

export async function loginRequest(email, password) {
  return request("/auth/signin", { method: "POST", body: { email, password } });
}

// -------------------- Expenses --------------------
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

// -------------------- Payments --------------------
export async function getUpcomingPayments(token) {
  return request("/payments/upcoming", { method: "GET", token });
}

export async function getOverduePayments(token) {
  return request("/payments/overdue", { method: "GET", token });
}

// ❌ createPayment removed — backend does not support POST /payments
export async function markPaymentAsPaid(paymentId, token, amount = null) {
  return request(`/payments/${paymentId}/pay`, {
    method: "PATCH",
    body: amount ? { amount } : {},
    token,
  });
}

// -------------------- History --------------------
export async function getPaidPayments(token) {
  return request("/history", { method: "GET", token });
}

// -------------------- Services --------------------
export async function getServices(token) {
  return request("/services", { method: "GET", token });
}

export async function createService(payload, token) {
  return request("/services", { method: "POST", body: payload, token });
}

export async function updateService(id, payload, token) {
  return request(`/services/${id}`, { method: "PATCH", body: payload, token });
}

export async function deleteService(id, token) {
  return request(`/services/${id}`, { method: "DELETE", token });
}

// -------------------- Household --------------------
export async function createHousehold(name, token) {
  return request(`/household/`, {
    method: "POST",
    body: { name },
    token,
  });
}

export async function getHousehold(token) {
  return request(`/household/`, { method: "GET", token });
}

export async function updateHousehold(id, name, token) {
  return request(`/household/${id}`, {
    method: "PUT",
    body: { name },
    token,
  });
}

export async function createMember(payload, token) {
  return request(`/household/members`, {
    method: "POST",
    body: {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    },
    token,
  });
}

export async function updateMember(memberId, payload, token) {
  return request(`/household/members/${memberId}`, {
    method: "PUT",
    body: {
      ...(payload.username ? { username: payload.username } : {}),
      ...(payload.email ? { email: payload.email } : {}),
      ...(payload.role ? { role: payload.role } : {}),
      ...(payload.password ? { password: payload.password } : {}),
    },
    token,
  });
}

export async function deleteMember(memberId, token) {
  return request(`/household/members/${memberId}`, {
    method: "DELETE",
    token,
  });
}