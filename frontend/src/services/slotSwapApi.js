const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("⚠️ No token found in localStorage");
  }
  return token;
};

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    console.log("✅ Token saved to localStorage");
  } else {
    localStorage.removeItem("token");
  }
};

const clearAuthToken = () => {
  localStorage.removeItem("token");
  console.log("🗑️ Token cleared");
};

const makeAuthRequest = async (url, options = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 - Session expired
  if (response.status === 401) {
    clearAuthToken();
    window.location.href = "/auth";
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  return response.json();
};

export const createSwapRequest = async (data) => {
  return makeAuthRequest(`${API_URL}/api/swap-requests`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getAllSwapRequests = async (courseCode = "", status = "") => {
  let url = `${API_URL}/api/swap-requests`;
  const params = [];
  if (courseCode) params.push(`courseCode=${encodeURIComponent(courseCode)}`);
  if (status) params.push(`status=${status}`);
  if (params.length > 0) url += `?${params.join("&")}`;

  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch swap requests");
  }
  return res.json();
};

export const getMySwapRequests = async () => {
  return makeAuthRequest(`${API_URL}/api/swap-requests/my-requests`, {
    method: "GET",
  });
};

export const getMyMatches = async () => {
  return makeAuthRequest(`${API_URL}/api/swap-requests/my-matches`, {
    method: "GET",
  });
};

export const findMatches = async (requestId) => {
  const res = await fetch(`${API_URL}/api/swap-requests/${requestId}/matches`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to find matches");
  }
  return res.json();
};

export const confirmSwap = async (
  requestId,
  matchedRequestId,
  phoneNumber,
  name,
  notes = ""
) => {
  console.log("🔵 FRONTEND CONFIRM SWAP");
  console.log(`  RequestID: ${requestId}`);
  console.log(`  MatchedRequestID: ${matchedRequestId}`);
  console.log(`  Name: ${name}`);
  console.log(`  Phone: ${phoneNumber}`);
  console.log(`  Notes: ${notes}`);

  const payload = {
    requestId,
    matchedRequestId,
    phoneNumber,
    name,
    notes,
  };

  console.log("📤 SENDING PAYLOAD:", JSON.stringify(payload, null, 2));

  try {
    const response = await makeAuthRequest(`${API_URL}/api/swap-requests/confirm-swap`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    console.log("📥 CONFIRM SWAP RESPONSE:", response);
    return response;
  } catch (err) {
    console.error("❌ CONFIRM SWAP ERROR:", err);
    throw err;
  }
};

export const completeSwap = async (requestId) => {
  return makeAuthRequest(`${API_URL}/api/swap-requests/${requestId}/complete`, {
    method: "PUT",
  });
};

export const getMatchedStudentPhone = async (requestId) => {
  console.log("🔵 FRONTEND GET MATCHED STUDENT PHONE");
  console.log(`  RequestID: ${requestId}`);

  try {
    const response = await makeAuthRequest(
      `${API_URL}/api/swap-requests/${requestId}/matched-contact`,
      {
        method: "GET",
      }
    );

    console.log("📥 MATCHED CONTACT RESPONSE:", response);
    console.log(`  - studentName: ${response.studentName}`);
    console.log(`  - studentPhone: ${response.studentPhone}`);
    console.log(`  - studentContactName: ${response.studentContactName}`);
    console.log(`  - bargainingNotes: ${response.bargainingNotes}`);

    return response;
  } catch (err) {
    console.error("❌ GET MATCHED CONTACT ERROR:", err);
    throw err;
  }
};

export const deleteSwapRequest = async (requestId) => {
  return makeAuthRequest(`${API_URL}/api/swap-requests/${requestId}`, {
    method: "DELETE",
  });
};

export { setAuthToken, getAuthToken, clearAuthToken };