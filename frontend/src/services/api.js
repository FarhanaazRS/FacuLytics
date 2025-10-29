const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchFaculties = async () => {
  const res = await fetch(`${API_URL}/api/faculties`);
  if (!res.ok) throw new Error("Failed to fetch faculties");
  return res.json();
};

export const fetchReviews = async () => {
  const res = await fetch(`${API_URL}/api/reviews`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};