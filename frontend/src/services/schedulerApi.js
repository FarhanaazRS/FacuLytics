const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getAuthToken = () => {
  return localStorage.getItem("token");
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

  if (response.status === 401) {
    window.location.href = "/auth";
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  return response.json();
};

export const getSchedule = async () => {
  console.log("📥 FETCHING SCHEDULE");
  try {
    const response = await makeAuthRequest(`${API_URL}/api/schedule`);
    console.log("✅ SCHEDULE FETCHED:", response.schedule.subjects);
    return response.schedule;
  } catch (err) {
    console.error("❌ ERROR FETCHING SCHEDULE:", err);
    throw err;
  }
};

export const updateSubject = async (slotKey, subjectData) => {
  console.log(`📝 UPDATING SUBJECT: ${slotKey} = ${subjectData}`);
  try {
    const response = await makeAuthRequest(`${API_URL}/api/schedule/update-subject`, {
      method: "POST",
      body: JSON.stringify({ slotKey, subjectName: subjectData }),
    });
    console.log("✅ SUBJECT UPDATED");
    return response.schedule;
  } catch (err) {
    console.error("❌ ERROR UPDATING SUBJECT:", err);
    throw err;
  }
};

export const clearSubject = async (slotKey) => {
  console.log(`🗑️ CLEARING SUBJECT: ${slotKey}`);
  try {
    const response = await makeAuthRequest(`${API_URL}/api/schedule/update-subject`, {
      method: "POST",
      body: JSON.stringify({ slotKey, subjectName: "" }),
    });
    console.log("✅ SUBJECT CLEARED");
    return response.schedule;
  } catch (err) {
    console.error("❌ ERROR CLEARING SUBJECT:", err);
    throw err;
  }
};

export const saveSchedule = async (subjects) => {
  console.log("💾 SAVING ENTIRE SCHEDULE");
  try {
    const response = await makeAuthRequest(`${API_URL}/api/schedule/save`, {
      method: "POST",
      body: JSON.stringify({ subjects }),
    });
    console.log("✅ SCHEDULE SAVED");
    return response.schedule;
  } catch (err) {
    console.error("❌ ERROR SAVING SCHEDULE:", err);
    throw err;
  }
};

export const clearSchedule = async () => {
  console.log("🗑️ CLEARING SCHEDULE");
  try {
    const response = await makeAuthRequest(`${API_URL}/api/schedule/clear`, {
      method: "DELETE",
    });
    console.log("✅ SCHEDULE CLEARED");
    return response;
  } catch (err) {
    console.error("❌ ERROR CLEARING SCHEDULE:", err);
    throw err;
  }
};