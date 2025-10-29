import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../App";
import * as schedulerApi from "../services/schedulerApi";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];


const THEORY_HEADER = [
  { time: "8:00 AM\nto\n8:50 AM" },
  { time: "9:00 AM\nto\n9:50 AM" },
  { time: "10:00 AM\nto\n10:50 AM" },
  { time: "11:00 AM\nto\n11:50 AM" },
  { time: "12:00 PM\nto\n12:50 PM" },
  { time: "01:00 PM\nto\n01:50 PM" },
  { time: "LUNCH", isLunch: true },
  { time: "2:00 PM\nto\n2:50 PM" },
  { time: "3:00 PM\nto\n3:50 PM" },
  { time: "4:00 PM\nto\n4:50 PM" },
  { time: "5:00 PM\nto\n5:50 PM" },
  { time: "6:00 PM\nto\n6:50 PM" },
  { time: "6:51 PM\nto\n7:00 PM" },
];

const LAB_HEADER = [
  { time: "08:00 AM\nto\n09:40 AM", span: 2 },
  { time: "09:50 AM\nto\n11:30 AM", span: 2 },
  { time: "11:40 AM\nto\n01:20 PM", span: 2 },
  { time: "LUNCH", isLunch: true, span: 1 },
  { time: "2:00 PM\nto\n3:40 PM", span: 2 },
  { time: "3:51 PM\nto\n5:30 PM", span: 2 },
  { time: "5:40 PM\nto\n7:20 PM", span: 2 },
];

const TIMETABLE_STRUCTURE = {
  theory: [
    { slots: ["A1/L1", "F1/L2", "D1/L3", "TB1/L4", "TG1/L5", "/L6", "LUNCH", "A2/L31", "F2/L32", "D2/L33", "TB2/L34", "TG2/L35", "/L36"] },
    { slots: ["B1/L7", "G1/L8", "E1/L9", "TC1/L10", "TAA1/L11", "/L12", "LUNCH", "B2/L37", "G2/L38", "E2/L39", "TC2/L40", "TAA2/L41", "/L42"] },
    { slots: ["C1/L13", "A1/L14", "F1/L15", "TD1/L16", "Extramural", "Extramural", "LUNCH", "C2/L43", "A2/L44", "F2/L45", "TD2/L46", "TBB2/L47", "/L48"] },
    { slots: ["D1/L19", "B1/L20", "G1/L21", "TE1/L22", "TCC1/L23", "/L24", "LUNCH", "D2/L49", "B2/L50", "G2/L51", "TE2/L52", "TCC2/L53", "/L54"] },
    { slots: ["E1/L25", "C1/L26", "TA1/L27", "TF1/L28", "TDD1/L29", "/L30", "LUNCH", "E2/L55", "C2/L56", "TA2/L57", "TF2/L58", "TDD2/L59", "/L60"] },
  ],
  lab: [
    { slots: ["A1/L1", "F1/L2", "D1/L3", "LUNCH", "A2/L31", "D2/L33", "L36"] },
    { slots: ["B1/L7", "G1/L8", "E1/L9", "LUNCH", "B2/L37", "E2/L39", "L42"] },
    { slots: ["C1/L13", "A1/L14", "F1/L15", "LUNCH", "C2/L43", "F2/L45", "L48"] },
    { slots: ["D1/L19", "B1/L20", "G1/L21", "LUNCH", "D2/L49", "G2/L51", "L54"] },
    { slots: ["E1/L25", "C1/L26", "TA1/L27", "LUNCH", "E2/L55", "TA2/L57", "L60"] },
  ]
};

const SLOT_COMBINATIONS = {
  'A1': ['A1', 'A1+TA1', 'A1+TA1+TAA1'],
  'A2': ['A2', 'A2+TA2', 'A2+TA2+TAA2'],
  'B1': ['B1', 'B1+TB1'],
  'B2': ['B2', 'B2+TB2', 'B2+TB2+TBB2'],
  'C1': ['C1', 'C1+TC1', 'C1+TC1+TCC1'],
  'C2': ['C2', 'C2+TC2', 'C2+TC2+TCC2'],
  'D1': ['D1', 'D1+TD1', 'D1+TD1+TDD1'],
  'D2': ['D2', 'D2+TD2', 'D2+TD2+TDD2'],
  'E1': ['E1', 'E1+TE1'],
  'E2': ['E2', 'E2+TE2'],
  'F1': ['F1', 'F1+TF1'],
  'F2': ['F2', 'F2+TF2'],
  'G1': ['G1', 'G1+TG1'],
  'G2': ['G2', 'G2+TG2'],
  'TA1': ['A1+TA1', 'A1+TA1+TAA1'],
  'TA2': ['A2+TA2', 'A2+TA2+TAA2'],
  'TB1': ['B1+TB1'],
  'TB2': ['B2+TB2', 'B2+TB2+TBB2'],
  'TC1': ['C1+TC1', 'C1+TC1+TCC1'],
  'TC2': ['C2+TC2', 'C2+TC2+TCC2'],
  'TD1': ['D1+TD1', 'D1+TD1+TDD1'],
  'TD2': ['D2+TD2', 'D2+TD2+TDD2'],
  'TE1': ['E1+TE1'],
  'TE2': ['E2+TE2'],
  'TF1': ['F1+TF1'],
  'TF2': ['F2+TF2'],
  'TG1': ['G1+TG1'],
  'TG2': ['G2+TG2'],
  'TAA1': ['TAA1', 'A1+TA1+TAA1'],
  'TAA2': ['TAA2', 'A2+TA2+TAA2'],
  'TBB2': ['TBB2', 'B2+TB2+TBB2'],
  'TCC1': ['TCC1', 'C1+TC1+TCC1'],
  'TCC2': ['TCC2', 'C2+TC2+TCC2'],
  'TDD1': ['TDD1', 'D1+TD1+TDD1'],
  'TDD2': ['TDD2', 'D2+TD2+TDD2'],
};

function SlotCell({ slotCode, day, subjectData, onClick, isDarkMode, hasClash, isLunch }) {
  const isEmpty = !slotCode;
  const hasSubject = subjectData?.name && subjectData.name.trim() !== "";
  const isLSlot = slotCode && slotCode.startsWith('L') && !slotCode.includes('/');
  const isExtramural = slotCode === "Extramural";

  if (slotCode === "LUNCH" || isLunch) {
    return (
      <div className={`h-full w-full flex items-center justify-center font-bold text-sm ${
        isDarkMode ? "text-blue-400" : "text-blue-600"
      }`}>
        LUNCH
      </div>
    );
  }

  if (isExtramural) {
    return (
      <div className={`h-full w-full flex items-center justify-center font-bold text-sm ${
        isDarkMode ? "text-red-400" : "text-red-600"
      }`}>
        {slotCode}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`h-full w-full flex flex-col items-center justify-center px-1.5 py-2 transition-colors cursor-pointer overflow-hidden max-w-full ${
        isEmpty || isLSlot
          ? isDarkMode ? "bg-gray-800/50" : "bg-yellow-50/80"
          : hasClash
          ? isDarkMode ? "bg-red-900/40 border-2 border-red-500" : "bg-red-100 border-2 border-red-400"
          : hasSubject
          ? subjectData.type === 'theory'
            ? isDarkMode ? "bg-blue-900/40 hover:bg-blue-900/60" : "bg-blue-100 hover:bg-blue-200"
            : isDarkMode ? "bg-purple-900/40 hover:bg-purple-900/60" : "bg-purple-100 hover:bg-purple-200"
          : isDarkMode
          ? "bg-gray-800/50 hover:bg-gray-700/50"
          : "bg-yellow-50/80 hover:bg-yellow-100"
      }`}
    >
      {!isEmpty && !isLSlot && (
        <div className={`text-xs font-semibold mb-0.5 flex-shrink-0 ${
          hasSubject 
            ? isDarkMode ? "text-blue-300" : "text-gray-700"
            : isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}>
          {slotCode}
        </div>
      )}
      {!isLSlot && hasSubject && (
        <div className={`text-sm font-bold text-center line-clamp-2 flex-shrink-0 w-full break-words min-w-0 ${
          isDarkMode ? "text-white" : "text-black"
        }`}>
          {subjectData.name}
        </div>
      )}
      {hasSubject && subjectData.slotType && (
        <div className={`text-[10px] mt-0.5 px-1.5 py-0.5 rounded font-medium flex-shrink-0 truncate w-full ${
          isDarkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-600"
        }`}>
          {subjectData.slotType}
        </div>
      )}
      {hasClash && (
        <div className="text-red-500 text-lg mt-1 flex-shrink-0">⚠️</div>
      )}
    </div>
  );
}

function SlotTypeModal({ slotCode, onClose, onSelect, isDarkMode, currentData }) {
  const [subjectName, setSubjectName] = useState(currentData?.name || "");
  const parts = slotCode.split('/');
  const theorySlot = parts.find(p => !p.startsWith('L'));
  const labSlot = parts.find(p => p.startsWith('L'));

  const getLabPair = (lab) => {
    const num = parseInt(lab.replace('L', ''));
    if (num % 2 === 1) {
      return `${lab} & L${num + 1}`;
    } else {
      return `L${num - 1} & ${lab}`;
    }
  };

 const handleSelect = (type, combination) => {
  if (theorySlot === "Extramural") {
    alert('Cannot add subject to Extramural slot');
    return;
  }
  if (!subjectName.trim()) {
    alert('Please enter a subject name');
    return;
  }
  onSelect(type, subjectName.trim(), combination);
};

  const theoryCombinations = theorySlot ? SLOT_COMBINATIONS[theorySlot] || [] : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className={`rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Add Subject</h3>
            <p className={`text-sm ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
              Slot: {slotCode}
            </p>
          </div>
          <button onClick={onClose} className={`p-1 rounded text-2xl ${isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"}`}>
            ✕
          </button>
        </div>

        <input
          type="text"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="Enter subject name"
          autoFocus
          className={`w-full px-4 py-2 rounded-lg mb-4 border-2 outline-none ${
            isDarkMode 
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
              : "bg-gray-100 border-gray-300 text-black placeholder-gray-500"
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && subjectName.trim() && theoryCombinations.length > 0) {
              handleSelect('theory', theoryCombinations[0]);
            }
          }}
        />

        <div className="space-y-3">
          {theoryCombinations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Theory Options:</h4>
              {theoryCombinations.map((combo, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect('theory', combo)}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-all mb-2 ${
                    isDarkMode
                      ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-2 border-blue-500/50"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-700 border-2 border-blue-300"
                  }`}
                >
                  Theory - {combo}
                </button>
              ))}
            </div>
          )}
          {labSlot && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Lab Option:</h4>
              <button
                onClick={() => handleSelect('lab', labSlot)}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                  isDarkMode
                    ? "bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-2 border-purple-500/50"
                    : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-300"
                }`}
              >
                Lab - {getLabPair(labSlot)}
              </button>
            </div>
          )}
        </div>

        {currentData?.name && (
          <button
            onClick={() => onSelect('delete', '', '')}
            className={`w-full mt-3 px-4 py-2 rounded-lg font-semibold transition-all ${
              isDarkMode
                ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50"
                : "bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
            }`}
          >
            Delete Subject
          </button>
        )}
      </div>
    </div>
  );
}

export default function SchedulerPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [subjects, setSubjects] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [clashMessage, setClashMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadSchedule();
  }, []);

 const loadSchedule = async () => {
  try {
    setLoading(true);
    const schedule = await schedulerApi.getSchedule();
    const convertedSubjects = {};
    
    if (schedule.subjects) {
      Object.entries(schedule.subjects).forEach(([key, value]) => {
        let parsedValue = value;
        
        // Parse if it's a string (JSON)
        if (typeof value === 'string') {
          try {
            parsedValue = JSON.parse(value);
          } catch (e) {
            // If parsing fails, treat it as a simple subject name
            parsedValue = {
              name: value,
              type: 'theory',
              slotType: 'single'
            };
          }
        }
        
        // Ensure it has all required fields
        convertedSubjects[key] = {
          name: parsedValue.name || parsedValue,
          type: parsedValue.type || 'theory',
          slotType: parsedValue.slotType || 'single'
        };
      });
    }
    
    setSubjects(convertedSubjects);
    setError("");
  } catch (err) {
    console.error("Error loading schedule:", err);
    setError("Failed to load schedule");
  } finally {
    setLoading(false);
  }
};

  const getLabPair = (labNum) => {
    const num = parseInt(labNum.replace('L', ''));
    if (num % 2 === 1) {
      return [`L${num}`, `L${num + 1}`];
    } else {
      return [`L${num - 1}`, `L${num}`];
    }
  };

  const parseSlotCombination = (combination) => {
    return combination.split('+');
  };

  const getAllSlotsForType = (slotCombination) => {
    const slots = [];
    const slotTypes = parseSlotCombination(slotCombination);
    
    TIMETABLE_STRUCTURE.theory.forEach((row, rowIdx) => {
      row.slots.forEach((slot, slotIdx) => {
        if (!slot || (slot.startsWith('L') && !slot.includes('/')) || slot === 'LUNCH') return;
        const dayName = DAYS[rowIdx];
        const parts = slot.split('/');
        
        const matchesAnySlot = slotTypes.some(slotType => {
          if (slotType.startsWith('L')) {
            const labPair = getLabPair(slotType);
            return parts.some(part => part.startsWith('L') && labPair.includes(part));
          } else {
            return parts.includes(slotType);
          }
        });
        
        if (matchesAnySlot) {
          slots.push({ day: dayName, slot });
        }
      });
    });
    return slots;
  };

  const checkForClash = (slotCombination, excludeDay, excludeSlot) => {
    const newSlotTypes = parseSlotCombination(slotCombination);
    
    const existingSlots = Object.entries(subjects).filter(([key, data]) => {
      const [day, slot] = key.split(':::');
      if (day === excludeDay && slot === excludeSlot) return false;
      
      const existingSlotTypes = parseSlotCombination(data.slotType || 'single');
      
      return newSlotTypes.some(newType => 
        existingSlotTypes.some(existingType => {
          if (newType === existingType) return true;
          if (newType.startsWith('L') && existingType.startsWith('L')) {
            const newLabPair = getLabPair(newType);
            const existingLabPair = getLabPair(existingType);
            return newLabPair.some(l => existingLabPair.includes(l));
          }
          return false;
        })
      );
    });

    if (existingSlots.length > 0) {
      const [firstKey, firstData] = existingSlots[0];
      const [day, slot] = firstKey.split(':::');
      return {
        hasClash: true,
        message: `Clash detected! ${slotCombination} conflicts with existing ${firstData.type} "${firstData.name}" (${firstData.slotType}) on ${day}`
      };
    }
    return { hasClash: false };
  };

  const handleSlotSelect = async (day, slotCode, type, subjectName, combination) => {
    if (type === 'delete') {
      const newSubjects = { ...subjects };
      const key = `${day}:::${slotCode}`;
      const slotType = subjects[key]?.slotType;
      
      if (slotType) {
        const allSlots = getAllSlotsForType(slotType);
        allSlots.forEach(({ day: d, slot: s }) => {
          delete newSubjects[`${d}:::${s}`];
        });
      }
      
      try {
        setSaving(true);
        await schedulerApi.clearSubject(key);
        setSubjects(newSubjects);
        setSuccess("✓ Subject deleted");
        setTimeout(() => setSuccess(""), 2000);
      } catch (err) {
        console.error("Error deleting subject:", err);
        setError("Failed to delete subject");
      } finally {
        setSaving(false);
      }
      setSelectedSlot(null);
      setClashMessage("");
      return;
    }

    const slotType = combination;
    const clashCheck = checkForClash(slotType, day, slotCode);
    
    if (clashCheck.hasClash) {
      setClashMessage(clashCheck.message);
      setSelectedSlot(null);
      return;
    }

    const allSlots = getAllSlotsForType(slotType);
    const newSubjects = { ...subjects };
    
    try {
      setSaving(true);
      
      allSlots.forEach(({ day: d, slot: s }) => {
        const key = `${d}:::${s}`;
        newSubjects[key] = {
          name: subjectName,
          type: type,
          slotType: slotType
        };
      });

      await Promise.all(
        allSlots.map(({ day: d, slot: s }) =>
          schedulerApi.updateSubject(`${d}:::${s}`, JSON.stringify({
            name: subjectName,
            type: type,
            slotType: slotType
          }))
        )
      );

      setSubjects(newSubjects);
      setSuccess("✓ Subject saved");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      console.error("Error saving subject:", err);
      setError("Failed to save subject");
    } finally {
      setSaving(false);
    }
    
    setSelectedSlot(null);
    setClashMessage("");
  };

  const getSubjectData = (day, slotCode) => {
    const key = `${day}:::${slotCode}`;
    return subjects[key] || null;
  };

  const hasClash = (day, slotCode) => {
    const data = getSubjectData(day, slotCode);
    if (!data) return false;
    
    const count = Object.keys(subjects).filter(key => 
      subjects[key].slotType === data.slotType
    ).length;
    
    return count > getAllSlotsForType(data.slotType).length;
  };

const handleClearAll = async () => {
  if (!showClearConfirm) {
    setShowClearConfirm(true);
    return;
  }
  
  try {
    setSaving(true);
    await schedulerApi.clearSchedule();
    setSubjects({});
    setClashMessage("");
    setSuccess("✓ Schedule cleared");
    setTimeout(() => setSuccess(""), 2000);
    setShowClearConfirm(false);
  } catch (err) {
    console.error("Error clearing schedule:", err);
    setError("Failed to clear schedule");
  } finally {
    setSaving(false);
  }
};
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gradient-to-br from-black via-gray-900 to-black text-white" : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black"
      }`}>
        <div className="text-xl font-semibold">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${
      isDarkMode
        ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black"
    }`}>
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 bg-gradient-to-r ${
              isDarkMode
                ? "from-white to-white/60"
                : "from-black to-black/60"
            }`}>
              SCHEDULER
            </h1>
            <p className={isDarkMode ? "text-white/60" : "text-black/60"}>
              Plan your semester schedule with clash detection
            </p>
          </div>
          <button
            onClick={handleClearAll}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              isDarkMode
                ? "bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-700 disabled:opacity-50"
                : "bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 disabled:opacity-50"
            }`}
          >
            🗑️ Clear All
          </button>
        </div>

        {error && (
          <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? "bg-red-500/20 text-red-200" : "bg-red-50 text-red-800"}`}>
            {error}
          </div>
        )}
        {success && (
          <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? "bg-green-500/20 text-green-200" : "bg-green-50 text-green-800"}`}>
            {success}
          </div>
        )}

        {clashMessage && (
          <div className={`mb-6 p-4 rounded-lg border-2 flex items-start gap-3 ${
            isDarkMode
              ? "bg-red-900/20 border-red-700 text-red-300"
              : "bg-red-50 border-red-300 text-red-700"
          }`}>
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <div className="font-bold mb-1">Cannot Add Subject</div>
              <div className="text-sm">{clashMessage}</div>
            </div>
            <button onClick={() => setClashMessage("")} className="p-1 text-xl">
              ✕
            </button>
            {showClearConfirm && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className={`rounded-xl p-6 max-w-sm w-full mx-4 ${
      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
    }`}>
      <h3 className="text-lg font-bold mb-2">Clear Schedule?</h3>
      <p className={`text-sm mb-6 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
        Are you sure you want to clear your entire schedule? This cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => setShowClearConfirm(false)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleClearAll}
          disabled={saving}
          className={`px-4 py-2 rounded-lg font-semibold ${
            isDarkMode ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"
          } disabled:opacity-50`}
        >
          Clear All
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        )}

        <div className={`rounded-xl border-2 shadow-lg overflow-hidden ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className={isDarkMode ? "bg-blue-900/30" : "bg-blue-100"}>
                  <th className={`border-2 px-2 py-2 text-sm font-bold ${
                    isDarkMode ? "border-gray-700" : "border-gray-300"
                  }`}>
                    THEORY<br/>HOURS
                  </th>
                  {THEORY_HEADER.map((slot, idx) => (
                    <th key={idx} className={`border-2 px-1.5 py-1.5 text-[10px] font-semibold text-center whitespace-pre-line ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    } ${slot.isLunch ? (isDarkMode ? "bg-blue-900/50" : "bg-blue-200") : ""}`}>
                      {slot.time}
                    </th>
                  ))}
                </tr>
                <tr className={isDarkMode ? "bg-blue-900/30" : "bg-blue-100"}>
                  <th className={`border-2 px-2 py-2 text-sm font-bold ${
                    isDarkMode ? "border-gray-700" : "border-gray-300"
                  }`}>
                    LAB<br/>HOURS
                  </th>
                  {LAB_HEADER.map((slot, idx) => (
                    <th key={idx} colSpan={slot.span} className={`border-2 px-1.5 py-1.5 text-[10px] font-semibold text-center whitespace-pre-line ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    } ${slot.isLunch ? (isDarkMode ? "bg-blue-900/50" : "bg-blue-200") : ""}`}>
                      {slot.time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
     {DAYS.map((day, dayIdx) => (
  <tr key={day} className={dayIdx % 2 === 0 ? (isDarkMode ? "bg-gray-800/50" : "bg-gray-50") : ""}>
    <td className={`border-2 px-2 py-2 font-bold text-center text-sm w-16 min-w-16 max-w-16 ${
      isDarkMode ? "border-gray-700 bg-gray-700/50" : "border-gray-300 bg-gray-200"
    }`}>
      {day}
    </td>
    {TIMETABLE_STRUCTURE.theory[dayIdx].slots.map((slotCode, slotIdx) => {
      const isLSlot = slotCode && slotCode.startsWith('L') && !slotCode.includes('/');
      const isLunchCell = slotCode === 'LUNCH';
      const canClick = slotCode && !isLSlot && !isLunchCell;
      
      return (
        <td 
          key={slotIdx}
          className={`border-2 h-20 w-20 min-w-20 max-w-20 ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <SlotCell
            slotCode={slotCode}
            day={day}
            subjectData={getSubjectData(day, slotCode)}
            onClick={() => canClick && setSelectedSlot({ day, slotCode })}
            isDarkMode={isDarkMode}
            isLunch={isLunchCell}
            hasClash={hasClash(day, slotCode)}
          />
        </td>
      );
    })}
  </tr>
))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedSlot && (
          <SlotTypeModal
            slotCode={selectedSlot.slotCode}
            onClose={() => setSelectedSlot(null)}
            onSelect={(type, subjectName, combination) =>
              handleSlotSelect(selectedSlot.day, selectedSlot.slotCode, type, subjectName, combination)
            }
            isDarkMode={isDarkMode}
            currentData={getSubjectData(selectedSlot.day, selectedSlot.slotCode)}
          />
        )}
      </div>
    </div>
  );
}