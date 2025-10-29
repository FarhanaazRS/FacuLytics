// ComparisonChart.jsx
// Simple horizontal grouped bars to compare 2-3 faculties across teaching/marks/quiz.
// Expects `items` array: [{ id, name, values: { teaching, marks, quiz } }, ...]
// No external charting libraries to keep the prototype dependency-free.

import React from "react";

export default function ComparisonChart({ items = [] }) {
  // keys in the order we'll render
  const keys = [
    { key: "teaching", label: "Teaching" },
    { key: "marks", label: "Marks" },
    { key: "quiz", label: "Quiz" },
  ];

  // color palette for up to 3 items
  const colors = ["#C8E6C9", "#9CCC65", "#A5D6A7"];

  const card = {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  };

  const rowStyle = { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 };

  return (
    <div style={card}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Comparison</div>
      {keys.map((k) => (
        <div key={k.key} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
          <div style={{ display: "flex", gap: 12 }}>
            {items.map((it, idx) => {
              const val = (it.values && it.values[k.key]) ? it.values[k.key] : 0;
              const pct = Math.max(0, Math.min(1, val / 5));
              return (
                <div key={it.id} style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#444", marginBottom: 6 }}>{it.name}</div>
                  <div style={{ background: "#f6f6f6", borderRadius: 8, overflow: "hidden", height: 12 }}>
                    <div style={{ width: `${pct * 100}%`, height: "100%", background: colors[idx % colors.length] }} />
                  </div>
                  <div style={{ fontSize: 12, textAlign: "right", marginTop: 6, fontWeight: 700 }}>{val.toFixed(1)}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
