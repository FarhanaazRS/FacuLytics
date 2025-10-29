const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper function to get auth headers
const getAuthHeaders = (token) => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getPendingRequests = async (token) => {
  const res = await fetch(`${API_URL}/api/admin/pending-requests`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch pending requests");
  return res.json();
};

export const getRequestDetails = async (id, token) => {
  const res = await fetch(`${API_URL}/api/admin/request/${id}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch request details");
  return res.json();
};

export const approveFaculty = async (id, token) => {
  const res = await fetch(`${API_URL}/api/admin/approve-faculty/${id}`, {
    method: "POST",
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to approve faculty");
  return res.json();
};

export const rejectFaculty = async (id, reason, token) => {
  const res = await fetch(`${API_URL}/api/admin/reject-faculty/${id}`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error("Failed to reject faculty");
  return res.json();
};

export const getRequestHistory = async (token) => {
  const res = await fetch(`${API_URL}/api/admin/history`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
};

export const deleteReview = async (reviewId, token) => {
  const res = await fetch(`${API_URL}/api/admin/review/${reviewId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete review");
  return res.json();
};