// FacultyCard.jsx
// Small card component that displays a faculty's name, subject and overall rating.
// Used in lists such as HomePage and Compare selection lists.

import React from "react";
import { Link } from "react-router-dom";

export default function FacultyCard({ faculty, overall }) {
  const card = {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    minWidth: 260,
  };

  const left = { display: "flex", flexDirection: "column", gap: 6 };
  const nameStyle = { margin: 0, fontSize: 16, fontWeight: 700 };
  const subj = { margin: 0, fontSize: 13, color: "#555" };
  const right = { textAlign: "right" };

  return (
    <div style={card}>
      <div style={left}>
        <Link to={`/faculty/${faculty.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <h4 style={nameStyle}>{faculty.name}</h4>
        </Link>
        <p style={subj}>{faculty.subject}</p>
      </div>
      <div style={right}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>{overall || "—"}</div>
        <div style={{ fontSize: 12, color: "#777" }}>overall</div>
      </div>
    </div>
  );
}
