import React, { useState, useContext } from "react";
import { ThemeContext } from "../App";

export default function ReviewForm({ onSubmit, submitLabel = "Submit", loading = false }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [teaching, setTeaching] = useState(3);
  const [marks, setMarks] = useState(3);
  const [quiz, setQuiz] = useState(3);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit({ teaching, marks, quiz, comment });
  };

  const handleInputChange = (value, setter) => {
    const num = parseInt(value);
    if (value === "") {
      setter(1);
    } else if (!isNaN(num) && num >= 1 && num <= 5) {
      setter(num);
    }
  };

  const handleSliderChange = (value, setter) => {
    setter(parseInt(value));
  };

  const RatingInput = ({ label, value, onInputChange, onSliderChange, id }) => {
    const inputBg = isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
    const inputBorder = isDarkMode ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(0,0,0,0.15)";
    const textColor = isDarkMode ? "#fff" : "#000";
    const sliderBg = isDarkMode
      ? `linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ${((value - 1) / 4) * 100}%, rgba(255,255,255,0.2) ${((value - 1) / 4) * 100}%, rgba(255,255,255,0.2) 100%)`
      : `linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.6) ${((value - 1) / 4) * 100}%, rgba(0,0,0,0.2) ${((value - 1) / 4) * 100}%, rgba(0,0,0,0.2) 100%)`;
    const thumbBorder = isDarkMode ? "3px solid rgba(255,255,255,0.3)" : "3px solid rgba(0,0,0,0.3)";
    const thumbBg = isDarkMode ? "#fff" : "#000";

    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <label htmlFor={id} style={{ fontWeight: 600, color: textColor, fontSize: 15 }}>
            {label}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => onInputChange(e.target.value)}
            min="1"
            max="5"
            step="1"
            style={{
              width: 80,
              padding: "10px 14px",
              borderRadius: 10,
              background: inputBg,
              border: inputBorder,
              color: textColor,
              fontSize: 18,
              fontWeight: 700,
              textAlign: "center",
              outline: "none",
              transition: "all 0.2s",
            }}
          />
        </div>
        <input
          type="range"
          id={id}
          min="1"
          max="5"
          step="1"
          value={value}
          onChange={(e) => onSliderChange(e.target.value)}
          style={{
            width: "100%",
            height: 8,
            borderRadius: 4,
            background: sliderBg,
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            cursor: "pointer",
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${thumbBg};
            cursor: pointer;
            border: ${thumbBorder};
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          }
          input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${thumbBg};
            cursor: pointer;
            border: ${thumbBorder};
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          }
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            opacity: 1;
          }
        `}</style>
      </div>
    );
  };

  const textareaBg = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const textareaBorder = isDarkMode ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)";
  const textareaColor = isDarkMode ? "#fff" : "#000";
  const textareaPlaceholder = isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  const buttonBg = isDarkMode
    ? loading ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.9)"
    : loading ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.9)";
  const buttonTextColor = isDarkMode
    ? loading ? "#666" : "#000"
    : loading ? "#999" : "#fff";
  const buttonHoverBg = isDarkMode ? "#fff" : "#000";
  const buttonHoverTextColor = isDarkMode ? "#000" : "#fff";

  return (
    <div>
      <RatingInput
        label="Teaching Quality"
        value={teaching}
        onInputChange={(val) => handleInputChange(val, setTeaching)}
        onSliderChange={(val) => handleSliderChange(val, setTeaching)}
        id="teaching"
      />

      <RatingInput
        label="Marking Leniency"
        value={marks}
        onInputChange={(val) => handleInputChange(val, setMarks)}
        onSliderChange={(val) => handleSliderChange(val, setMarks)}
        id="marks"
      />

      <RatingInput
        label="Quiz Difficulty (Lower = Easier)"
        value={quiz}
        onInputChange={(val) => handleInputChange(val, setQuiz)}
        onSliderChange={(val) => handleSliderChange(val, setQuiz)}
        id="quiz"
      />

      <div style={{ marginBottom: 24 }}>
        <label htmlFor="comment" style={{ display: "block", fontWeight: 600, marginBottom: 12, color: isDarkMode ? "#fff" : "#000", fontSize: 15 }}>
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this faculty..."
          rows={4}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 12,
            background: textareaBg,
            border: textareaBorder,
            color: textareaColor,
            fontSize: 14,
            resize: "vertical",
            fontFamily: "inherit",
            outline: "none",
            transition: "all 0.2s",
          }}
        />
        <style>{`
          textarea::placeholder {
            color: ${textareaPlaceholder};
          }
        `}</style>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px 24px",
          borderRadius: 12,
          background: buttonBg,
          border: isDarkMode ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0,0,0,0.2)",
          color: buttonTextColor,
          fontSize: 16,
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.background = buttonHoverBg;
            e.currentTarget.style.color = buttonHoverTextColor;
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.background = buttonBg;
            e.currentTarget.style.color = buttonTextColor;
            e.currentTarget.style.transform = "translateY(0)";
          }
        }}
      >
        {loading ? "Submitting..." : submitLabel}
      </button>
    </div>
  );
}