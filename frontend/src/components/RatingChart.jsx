// RatingChart.jsx
// Visualizes ratings for a faculty or aggregated set.
// Expects `data` to be an object { teaching: Number, marks: Number, quiz: Number } or an average of several reviews.
// Simple horizontal bars implemented via inline SVG for predictable rendering without external libs.

import React from "react";

export default function RatingChart({ data = { teaching: 0, marks: 0, quiz: 0 }, title = "" }) {
  // normalize 0..5
  const keys = [
    { key: "teaching", label: "Teaching" },
    { key: "marks", label: "Marks" },
    { key: "quiz", label: "Quiz" },
  ];

  const max = 5;

  const container = {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  };

  const barContainer = { display: "flex", flexDirection: "column", gap: 10, marginTop: 8 };

  return (
    <div style={container}>
      {title && <div style={{ fontWeight: 700 }}>{title}</div>}
      <div style={barContainer}>
        {keys.map((k) => {
          const value = Number(data[k.key] ?? 0);
          const pct = Math.max(0, Math.min(1, value / max));
          return (
            <div key={k.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 90, fontSize: 13 }}>{k.label}</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 10, background: "#f1f1f1", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ width: `${pct * 100}%`, height: "100%", borderRadius: 6, background: "#C8E6C9" }} />
                </div>
              </div>
              <div style={{ width: 40, textAlign: "right", fontWeight: 700 }}>{value.toFixed(1)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
