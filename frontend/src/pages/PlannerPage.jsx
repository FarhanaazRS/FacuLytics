import React, { useState, useEffect, useRef, useContext } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ThemeContext } from "../App";

const ItemTypes = {
  FACULTY: "faculty",
  PREFERENCE: "preference",
};

function DraggableFaculty({ faculty, isAssigned, isDarkMode }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FACULTY,
    item: { type: "faculty", data: faculty },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 rounded-lg border cursor-move transition-all ${
        isDragging
          ? isDarkMode
            ? "opacity-30 bg-white/20 border-white/40 scale-105"
            : "opacity-30 bg-black/20 border-black/40 scale-105"
          : isAssigned
          ? isDarkMode
            ? "bg-green-500/10 border-green-500/30 text-white hover:bg-green-500/15 hover:border-green-500/40"
            : "bg-green-500/5 border-green-500/20 text-black hover:bg-green-500/10 hover:border-green-500/30"
          : isDarkMode
          ? "bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-102 hover:shadow-lg"
          : "bg-black/5 backdrop-blur-sm border-black/10 text-black hover:bg-black/10 hover:border-black/20 hover:scale-102 hover:shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`font-medium ${isAssigned && isDarkMode ? "text-white/90" : ""}`}>{faculty.name}</div>
          {faculty.metrics?.overall && (
            <div className={`text-xs mt-1 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
              Rating: {faculty.metrics.overall.toFixed(1)}
            </div>
          )}
        </div>
        {isAssigned && (
          <div className="flex items-center gap-1 text-green-400 text-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

function PreferenceSlot({
  subjectId,
  slotIndex,
  faculties,
  onDrop,
  onRemove,
  onMovePreference,
  isDarkMode,
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PREFERENCE,
    item: {
      type: "preference",
      subjectId,
      slotIndex,
      faculties,
    },
    canDrag: () => faculties.length > 0,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [ItemTypes.FACULTY, ItemTypes.PREFERENCE],
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;
      
      if (item.type === "faculty") {
        onDrop(item.data);
        return { dropped: true };
      } else if (item.type === "preference") {
        onMovePreference(item.subjectId, item.slotIndex, subjectId, slotIndex);
        return { dropped: true };
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }), [subjectId, slotIndex, onDrop, onMovePreference]);

  const ordinalSuffix = ["st", "nd", "rd"][slotIndex] || "th";

  const combinedRef = (node) => {
    drag(node);
    drop(node);
  };

  return (
    <div ref={faculties.length > 0 ? combinedRef : drop} className={isDragging ? "opacity-50" : ""}>
      <div className="flex items-center justify-between mb-1.5">
        <div className={`text-xs font-semibold flex items-center gap-1.5 ${isDarkMode ? "text-white/70" : "text-black/70"}`}>
          <div className={`w-5 h-5 backdrop-blur-sm rounded-full flex items-center justify-center text-[10px] border font-bold ${
            isDarkMode
              ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20"
              : "bg-gradient-to-br from-black/10 to-black/5 border-black/20"
          }`}
            style={{ cursor: faculties.length > 0 ? 'move' : 'default' }}>
            {slotIndex + 1}
          </div>
          <span>Preference {slotIndex + 1}</span>
        </div>
      </div>
      <div
        className={`min-h-[50px] flex flex-wrap gap-1.5 p-2.5 border-2 border-dashed rounded-lg transition-all backdrop-blur-sm ${
          isOver && canDrop
            ? isDarkMode
              ? "bg-gradient-to-br from-white/20 to-white/10 border-white/40 shadow-lg ring-2 ring-white/30 scale-[1.02]"
              : "bg-gradient-to-br from-black/20 to-black/10 border-black/40 shadow-lg ring-2 ring-black/30 scale-[1.02]"
            : isDarkMode
            ? "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/7"
            : "bg-black/5 border-black/10 hover:border-black/20 hover:bg-black/7"
        }`}
      >
        {faculties.length > 0 ? (
          faculties.map((faculty, idx) => (
            <div
              key={idx}
              className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 shadow-lg border group transition-all ${
                isDarkMode
                  ? "bg-gradient-to-br from-white/15 to-white/10 border-white/30 text-white hover:from-white/20 hover:to-white/15"
                  : "bg-gradient-to-br from-black/15 to-black/10 border-black/30 text-black hover:from-black/20 hover:to-black/15"
              }`}
            >
              <span className="font-medium">{faculty.name}</span>
              {faculty.metrics?.overall && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  isDarkMode
                    ? "text-white/70 bg-white/20"
                    : "text-black/70 bg-black/20"
                }`}>
                  {faculty.metrics.overall.toFixed(1)}
                </span>
              )}
              <button
                onClick={() => onRemove(idx)}
                className={`ml-0.5 rounded-full w-4 h-4 flex items-center justify-center transition-all text-sm font-bold ${
                  isDarkMode
                    ? "text-white/60 hover:text-white hover:bg-white/30"
                    : "text-black/60 hover:text-black hover:bg-black/30"
                }`}
                title="Remove faculty"
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-2">
            <span className={`text-xs italic ${isDarkMode ? "text-white/40" : "text-black/40"}`}>
              Drop {slotIndex + 1}{ordinalSuffix} preference here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SubjectCard({
  subject,
  onUpdate,
  onRemove,
  onAddPreference,
  onRemovePreference,
  onDrop,
  onRemoveFaculty,
  onMovePreference,
  isDarkMode,
}) {
  return (
    <div className={`backdrop-blur-2xl p-4 rounded-xl border transition-all shadow-2xl ${
      isDarkMode
        ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/30 hover:shadow-white/10"
        : "bg-gradient-to-br from-black/5 to-black/0 border-black/10 hover:border-black/20 hover:shadow-black/5"
    }`}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={subject.name}
            onChange={(e) => onUpdate(subject.id, "name", e.target.value)}
            className={`text-lg font-bold bg-transparent border-b-2 focus:outline-none flex-1 transition-all pb-1 placeholder-opacity-40 ${
              isDarkMode
                ? "border-white/30 focus:border-white/50 text-white placeholder-white"
                : "border-black/30 focus:border-black/50 text-black placeholder-black"
            }`}
            placeholder="Subject name"
          />
          <button
            onClick={() => onRemove(subject.id)}
            className={`rounded-lg text-xl w-8 h-8 flex items-center justify-center transition-all flex-shrink-0 font-bold ${
              isDarkMode
                ? "text-white/60 hover:text-white hover:bg-white/20"
                : "text-black/60 hover:text-black hover:bg-black/20"
            }`}
            title="Remove subject"
          >
            ×
          </button>
        </div>
        <input
          type="text"
          value={subject.slot}
          onChange={(e) => onUpdate(subject.id, "slot", e.target.value)}
          placeholder="+ Add slot (e.g., Mon 9-11 AM, Room 301)"
          className={`w-full px-3 py-2 rounded-lg backdrop-blur-sm border text-sm placeholder-opacity-40 focus:outline-none focus:ring-2 transition-all ${
            isDarkMode
              ? "bg-white/10 border-white/20 text-white placeholder-white focus:ring-white/30 focus:border-white/40"
              : "bg-black/10 border-black/20 text-black placeholder-black focus:ring-black/30 focus:border-black/40"
          }`}
        />
      </div>

      <div className="space-y-2.5 mb-3">
        {subject.preferences.map((slot, idx) => (
          <div key={idx} className="relative">
            <PreferenceSlot
              subjectId={subject.id}
              slotIndex={idx}
              faculties={slot}
              onDrop={(faculty) => onDrop(subject.id, idx, faculty)}
              onRemove={(facIdx) => onRemoveFaculty(subject.id, idx, facIdx)}
              onMovePreference={onMovePreference}
              isDarkMode={isDarkMode}
            />
            {subject.preferences.length > 1 && (
              <button
                onClick={() => onRemovePreference(subject.id, idx)}
                className={`absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center transition-all border text-xs z-10 font-bold shadow-lg backdrop-blur-sm ${
                  isDarkMode
                    ? "text-white/60 hover:text-white bg-white/20 hover:bg-white/30 border-white/30"
                    : "text-black/60 hover:text-black bg-black/20 hover:bg-black/30 border-black/30"
                }`}
                title="Remove this preference level"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onAddPreference(subject.id)}
        className={`w-full text-xs px-3 py-2 backdrop-blur-sm border rounded-lg transition-all font-semibold flex items-center justify-center gap-1.5 shadow-lg ${
          isDarkMode
            ? "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 text-white/90 hover:shadow-white/10"
            : "bg-black/10 border-black/20 hover:bg-black/15 hover:border-black/30 text-black/90 hover:shadow-black/10"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Add Preference Level
      </button>
    </div>
  );
}

export default function PlannerPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [faculties, setFaculties] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [subjects, setSubjects] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Subject ${i + 1}`,
      preferences: [[]],
      slot: "",
    }))
  );

  const scrollIntervalRef = useRef(null);
  const isDraggingRef = useRef(false);

  const getAssignedFacultyIds = () => {
    const ids = new Set();
    subjects.forEach((subject) => {
      subject.preferences.forEach((preference) => {
        preference.forEach((faculty) => {
          ids.add(faculty._id);
        });
      });
    });
    return ids;
  };

  const assignedFacultyIds = getAssignedFacultyIds();

  useEffect(() => {
    const SCROLL_SPEED = 15;
    const SCROLL_ZONE = 120;
    const EDGE_ACCELERATION = 2;

    const performScroll = (mouseY) => {
      const viewportHeight = window.innerHeight;
      const distanceFromTop = mouseY;
      const distanceFromBottom = viewportHeight - mouseY;

      if (distanceFromTop < SCROLL_ZONE) {
        const intensity = 1 - distanceFromTop / SCROLL_ZONE;
        const speed = SCROLL_SPEED * (1 + intensity * EDGE_ACCELERATION);
        window.scrollBy({ top: -speed, behavior: "auto" });
        return true;
      } else if (distanceFromBottom < SCROLL_ZONE) {
        const intensity = 1 - distanceFromBottom / SCROLL_ZONE;
        const speed = SCROLL_SPEED * (1 + intensity * EDGE_ACCELERATION);
        window.scrollBy({ top: speed, behavior: "auto" });
        return true;
      }
      return false;
    };

    const handleDragStart = () => {
      isDraggingRef.current = true;
    };

    const handleDragEnd = () => {
      isDraggingRef.current = false;
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    const handleDragOver = (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();

      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }

      const mouseY = e.clientY;
      const shouldScroll = performScroll(mouseY);

      if (shouldScroll) {
        scrollIntervalRef.current = setInterval(() => {
          if (isDraggingRef.current) {
            performScroll(mouseY);
          } else {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
          }
        }, 16);
      }
    };

    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend", handleDragEnd);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDragEnd);

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDragEnd);
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await fetch("https://faculytics.onrender.com/api/faculties");
        const data = await res.json();
        setFaculties(data);
      } catch (err) {
        console.error("Failed to fetch faculties:", err);
      }
    };
    fetchFaculties();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredFaculties([]);
      return;
    }
    const results = faculties.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredFaculties(results);
  }, [query, faculties]);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    const navyBlue = [30, 58, 138];
    const lightBlue = [147, 197, 253];
    const headerText = [255, 255, 255];
    const bodyText = [31, 41, 55];
    const lightGray = [243, 244, 246];
    const slotTextColor = [100, 116, 139];

    doc.setFillColor(...navyBlue);
    doc.rect(0, 0, 210, 35, "F");
    
    doc.setTextColor(...headerText);
    doc.setFontSize(22);
    doc.setFont(undefined, "bold");
    doc.text("Faculty Preference Report", 105, 15, { align: "center" });
    
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Generated on ${date}`, 105, 25, { align: "center" });

    let yPosition = 45;

    subjects.forEach((subject) => {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFillColor(...lightGray);
      doc.roundedRect(15, yPosition, 180, 10, 1, 1, "F");
      
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.setTextColor(...bodyText);
      doc.text(`${subject.name}`, 20, yPosition + 7);

      if (subject.slot) {
        doc.setFontSize(9);
        doc.setFont(undefined, "normal");
        doc.setTextColor(...slotTextColor);
        const subjectNameWidth = doc.getTextWidth(subject.name);
        doc.text(`  •  ${subject.slot}`, 20 + subjectNameWidth + 5, yPosition + 7);
      }

      yPosition += 12;

      const hasPreferences = subject.preferences.some((pref) => pref.length > 0);

      if (hasPreferences) {
        const tableData = [];

        subject.preferences.forEach((preference, prefIndex) => {
          if (preference.length > 0) {
            preference.forEach((faculty, facIndex) => {
              tableData.push([
                facIndex === 0 ? `Preference ${prefIndex + 1}` : "",
                faculty.name,
                faculty.metrics?.overall ? faculty.metrics.overall.toFixed(1) : "N/A",
              ]);
            });
          }
        });

        if (tableData.length > 0) {
          autoTable(doc, {
            startY: yPosition,
            head: [["Priority", "Faculty Name", "Rating"]],
            body: tableData,
            theme: "striped",
            headStyles: {
              fillColor: [30, 58, 138],
              textColor: [255, 255, 255],
              fontSize: 10,
              fontStyle: "bold",
              halign: "left",
            },
            bodyStyles: {
              textColor: [31, 41, 55],
              fontSize: 9,
            },
            alternateRowStyles: {
              fillColor: [249, 250, 251],
            },
            columnStyles: {
              0: { cellWidth: 35, fontStyle: "bold" },
              1: { cellWidth: 110 },
              2: { cellWidth: 25, halign: "center" },
            },
            margin: { left: 20, right: 20 },
            tableWidth: 170,
          });

          yPosition = doc.lastAutoTable.finalY + 10;
        }
      } else {
        doc.setFontSize(9);
        doc.setTextColor(156, 163, 175);
        doc.setFont(undefined, "italic");
        doc.text("No preferences assigned", 20, yPosition);
        yPosition += 10;
      }

      yPosition += 5;
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.setFont(undefined, "normal");
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    doc.save(`Faculty_Preferences_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const addSubject = () => {
    const newId = subjects.length ? Math.max(...subjects.map((s) => s.id)) + 1 : 1;
    setSubjects([
      ...subjects,
      { id: newId, name: `Subject ${newId}`, preferences: [[]], slot: "" },
    ]);
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addPreferenceSlot = (subjectId) => {
    setSubjects(subjects.map((s) => (s.id === subjectId ? { ...s, preferences: [...s.preferences, []] } : s)));
  };

  const removePreferenceSlot = (subjectId, slotIndex) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id === subjectId && s.preferences.length > 1) {
          return { ...s, preferences: s.preferences.filter((_, idx) => idx !== slotIndex) };
        }
        return s;
      })
    );
  };

  const dropFacultyInSlot = (subjectId, slotIndex, faculty) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id === subjectId) {
          const newPreferences = s.preferences.map((slot, idx) => {
            if (idx === slotIndex) {
              if (slot.some((f) => f._id === faculty._id)) return slot;
              return [...slot, faculty];
            }
            return slot;
          });
          return { ...s, preferences: newPreferences };
        }
        return s;
      })
    );

    setQuery("");
  };

  const removeFacultyFromSlot = (subjectId, slotIndex, facultyIndex) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id === subjectId) {
          const newPreferences = s.preferences.map((slot, idx) => {
            if (idx === slotIndex) {
              return slot.filter((_, fIdx) => fIdx !== facultyIndex);
            }
            return slot;
          });
          return { ...s, preferences: newPreferences };
        }
        return s;
      })
    );
  };

  const movePreference = (fromSubjectId, fromSlotIndex, toSubjectId, toSlotIndex) => {
    if (fromSubjectId === toSubjectId && fromSlotIndex === toSlotIndex) return;

    setSubjects((prevSubjects) => {
      const newSubjects = prevSubjects.map((s) => ({ ...s }));
      const fromSubject = newSubjects.find((s) => s.id === fromSubjectId);
      const toSubject = newSubjects.find((s) => s.id === toSubjectId);

      if (!fromSubject || !toSubject) return prevSubjects;

      const movedFaculties = fromSubject.preferences[fromSlotIndex];

      if (fromSubjectId === toSubjectId) {
        const newPrefs = [...fromSubject.preferences];
        [newPrefs[fromSlotIndex], newPrefs[toSlotIndex]] = [newPrefs[toSlotIndex], newPrefs[fromSlotIndex]];

        return newSubjects.map((s) => (s.id === fromSubjectId ? { ...s, preferences: newPrefs } : s));
      }

      return newSubjects.map((s) => {
        if (s.id === fromSubjectId) {
          const newPrefs = [...s.preferences];
          newPrefs[fromSlotIndex] = toSubject.preferences[toSlotIndex];
          return { ...s, preferences: newPrefs };
        }
        if (s.id === toSubjectId) {
          const newPrefs = [...s.preferences];
          newPrefs[toSlotIndex] = movedFaculties;
          return { ...s, preferences: newPrefs };
        }
        return s;
      });
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`min-h-screen p-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black"
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 bg-gradient-to-r ${
                isDarkMode
                  ? "from-white to-white/60"
                  : "from-black to-black/60"
              }`}>Faculty Preference Manager</h1>
              <p className={isDarkMode ? "text-white/60" : "text-black/60"}>
                Organize your course preferences with intelligent drag & drop
              </p>
            </div>
            <button
              onClick={generatePDF}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>

          <div className={`sticky top-0 z-40 pb-6 pt-2 transition-colors duration-300 ${
            isDarkMode
              ? "bg-gradient-to-b from-black via-black to-transparent"
              : "bg-gradient-to-b from-gray-50 via-white to-transparent"
          }`}>
            <div className="flex gap-4 items-start">
              <div className="flex-1 relative max-w-2xl">
                <div className="relative">
                  <svg className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? "text-white/40" : "text-black/40"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search faculty by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl backdrop-blur-xl border text-white shadow-2xl focus:outline-none focus:ring-2 transition-all ${
                      isDarkMode
                        ? "bg-white/5 border-white/20 placeholder-white/40 focus:ring-white/40 focus:border-white/40"
                        : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40 focus:border-black/40"
                    }`}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all ${
                        isDarkMode ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                {filteredFaculties.length > 0 && (
                  <div className={`absolute z-50 w-full mt-2 rounded-xl border max-h-96 overflow-y-auto shadow-2xl ${
                    isDarkMode
                      ? "bg-black/95 backdrop-blur-2xl border-white/30"
                      : "bg-white/95 backdrop-blur-2xl border-black/30"
                  }`}>
                    <div className="p-2 space-y-2">
                      {filteredFaculties.map((f) => (
                        <DraggableFaculty key={f._id} faculty={f} isAssigned={assignedFacultyIds.has(f._id)} isDarkMode={isDarkMode} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border backdrop-blur-xl ${
                isDarkMode
                  ? "text-white/60 bg-white/5 border-white/20"
                  : "text-black/60 bg-black/5 border-black/20"
              }`}>
                <svg className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? "text-white/70" : "text-black/70"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className={isDarkMode ? "text-white/80 font-medium" : "text-black/80 font-medium"}>
                  Search & drag faculty to slots • Drag near edges to auto-scroll
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onUpdate={updateSubject}
                onRemove={removeSubject}
                onAddPreference={addPreferenceSlot}
                onRemovePreference={removePreferenceSlot}
                onDrop={dropFacultyInSlot}
                onRemoveFaculty={removeFacultyFromSlot}
                onMovePreference={movePreference}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={addSubject}
              className={`px-4 py-2 border rounded-lg transition-all shadow-md ${
                isDarkMode
                  ? "bg-white/5 border-white/20 text-white/90 hover:bg-white/10"
                  : "bg-black/5 border-black/20 text-black/90 hover:bg-black/10"
              }`}
            >
              + Add Subject
            </button>

            <div className={`text-sm ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
              Tip: You can assign the same faculty to multiple subjects.
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
