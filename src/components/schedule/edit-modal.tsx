"use client";

import { useEffect, useState } from "react";
import {
  hasSubjectTimeConflict,
  timeToMinutes,
  type SubjectTimeBlock,
} from "@/components/schedule/schedule_supabase_query";

interface Subject {
  id: string;
  title: string;
  startTime: string;
  startMinutes: string;
  startPeriod: "AM" | "PM";
  endTime: string;
  endMinutes: string;
  endPeriod: "AM" | "PM";
}

interface EditModalProps {
  subject: Subject;
  subjects: SubjectTimeBlock[];
  onClose: () => void;
  onSave: (updatedSubject: Subject) => void;
}

export default function EditModal({
  subject,
  subjects,
  onClose,
  onSave,
}: EditModalProps) {
  const [formData, setFormData] = useState(subject);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  const handleInputChange = (field: keyof Subject, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const hasCompleteTimeBlock =
      formData.startTime &&
      formData.startMinutes &&
      formData.endTime &&
      formData.endMinutes;

    if (!hasCompleteTimeBlock) {
      setConflictMessage(null);
      return;
    }

    const startTotalMinutes = timeToMinutes(
      formData.startTime,
      formData.startMinutes,
      formData.startPeriod,
    );
    const endTotalMinutes = timeToMinutes(
      formData.endTime,
      formData.endMinutes,
      formData.endPeriod,
    );

    if (endTotalMinutes <= startTotalMinutes) {
      setConflictMessage("End time must be after start time");
      return;
    }

    if (hasSubjectTimeConflict(subjects, formData, subject.id)) {
      setConflictMessage("This time block conflicts with an existing subject.");
      return;
    }

    setConflictMessage(null);
  }, [formData, subject.id, subjects]);

  const handleSave = () => {
    if (conflictMessage) {
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleHourChange = (field: "startTime" | "endTime", value: string) => {
    const numValue = Number.parseInt(value) || 0;
    if (numValue >= 1 && numValue <= 12) {
      handleInputChange(field, String(numValue).padStart(2, "0"));
    }
  };

  const handleMinutesChange = (
    field: "startMinutes" | "endMinutes",
    value: string,
  ) => {
    const numValue = Number.parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 59) {
      handleInputChange(field, String(numValue).padStart(2, "0"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl shadow-lg">
        {/* Header */}
        <div className="bg-[#71D285] px-8 py-6">
          <h2 className="text-3xl font-bold text-white">Edit your Course</h2>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Course Name */}
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-6 py-3 rounded-2xl border-2 border-[#71D285] text-lg focus:outline-none focus:ring-2 focus:ring-[#71D285]"
            />
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-8">
            {/* From */}
            <div>
              <div className="text-lg font-semibold text-gray-900 mb-3">
                from
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.startTime}
                  onChange={(e) =>
                    handleHourChange("startTime", e.target.value)
                  }
                  className="w-16 px-3 py-2 rounded-lg border-2 border-[#71D285] text-center font-semibold focus:outline-none focus:ring-2 focus:ring-[#71D285]"
                />
                <span className="text-2xl font-bold text-gray-900">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={formData.startMinutes}
                  onChange={(e) =>
                    handleMinutesChange("startMinutes", e.target.value)
                  }
                  className="w-16 px-3 py-2 rounded-lg border-2 border-[#71D285] text-center font-semibold focus:outline-none focus:ring-2 focus:ring-[#71D285]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInputChange("startPeriod", "AM")}
                    className={`px-3 py-2 rounded-lg font-semibold transition ${
                      formData.startPeriod === "AM"
                        ? "bg-[#71D285] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => handleInputChange("startPeriod", "PM")}
                    className={`px-3 py-2 rounded-lg font-semibold transition ${
                      formData.startPeriod === "PM"
                        ? "bg-gray-300 text-gray-900"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            {/* To */}
            <div>
              <div className="text-lg font-semibold text-gray-900 mb-3">to</div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.endTime}
                  onChange={(e) => handleHourChange("endTime", e.target.value)}
                  className="w-16 px-3 py-2 rounded-lg border-2 border-[#71D285] text-center font-semibold focus:outline-none focus:ring-2 focus:ring-[#71D285]"
                />
                <span className="text-2xl font-bold text-gray-900">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={formData.endMinutes}
                  onChange={(e) =>
                    handleMinutesChange("endMinutes", e.target.value)
                  }
                  className="w-16 px-3 py-2 rounded-lg border-2 border-[#71D285] text-center font-semibold focus:outline-none focus:ring-2 focus:ring-[#71D285]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInputChange("endPeriod", "AM")}
                    className={`px-3 py-2 rounded-lg font-semibold transition ${
                      formData.endPeriod === "AM"
                        ? "bg-[#71D285] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => handleInputChange("endPeriod", "PM")}
                    className={`px-3 py-2 rounded-lg font-semibold transition ${
                      formData.endPeriod === "PM"
                        ? "bg-gray-300 text-gray-900"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
          </div>

          {conflictMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {conflictMessage}
            </div>
          )}

          {/* Done Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSave}
              disabled={Boolean(conflictMessage)}
              className="px-12 py-3 bg-[#71D285] text-white font-semibold rounded-full hover:bg-[#5fb870] transition w-full disabled:cursor-not-allowed disabled:bg-[#b8e6bf]"
            >
              done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
