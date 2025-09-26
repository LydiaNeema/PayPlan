const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export async function request(path, { method = "GET", body, token, isForm = false } = {}) {
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

// -------------------- Payments --------------------
export async function getUpcomingPayments(token) {
  return request("/payments/upcoming", { method: "GET", token });
}

export async function getOverduePayments(token) {
  return request("/payments/overdue", { method: "GET", token });
}

export async function createPayment(payload, token) {
  return request("/payments", { method: "POST", body: payload, token });
}


export async function getPaidPayments(token) {
  // use '/history' (no trailing slash) to avoid redirect/preflight problems
  return request("/history", { method: "GET", token });
}

// PATCH partial/full payment
export async function markPaymentAsPaid(paymentId, token, amount) {
  return request(`/payments/${paymentId}/pay`, {
    method: "PATCH",
    body: { amount },
    token
  });
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
export async function getHousehold(token) {
  return request("/household", { method: "GET", token });
}

export async function createMember(payload, token) {
  return request("/household/members", { method: "POST", body: payload, token });
}

export async function updateMember(id, payload, token) {
  return request(`/household/members/${id}`, { method: "PATCH", body: payload, token });
}

export async function deleteMember(id, token) {
  return request(`/household/members/${id}`, { method: "DELETE", token });
}

// -------------------- Dashboard --------------------
export async function getDashboardData(token) {
  const [upcomingPayments, overduePayments, paidPayments] = await Promise.all([
    getUpcomingPayments(token),
    getOverduePayments(token),
    getPaidPayments(token),
  ]);

  return { upcomingPayments, overduePayments, paidPayments };
}
