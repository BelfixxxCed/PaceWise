"use client";

import { useState } from "react";
import { X, Layers, CheckCircle } from "lucide-react";
import supabase from "@/supabase/supabase_client";

interface Props {
  subjectId: string;
  onClose: () => void;
}

export default function CreateFlashcardModal({
  subjectId,
  onClose,
}: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      setError("Both question and answer are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("flashcards").insert([
        {
          subject_id: subjectId,
          question: question.trim(),
          answer: answer.trim(),
        },
      ]);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setSuccess(true);
      setQuestion("");
      setAnswer("");
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Failed to save flashcard. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#e8f8ec]">
          <div className="flex items-center gap-2 text-[#3E6E48] font-semibold">
            <Layers size={20} />
            <span>Create Flashcard</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#d0f0d8] rounded-lg transition-colors"
          >
            <X size={18} className="text-[#71D285]" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {success && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 text-green-700 text-sm">
              <CheckCircle size={16} />
              Flashcard saved successfully!
            </div>
          )}

          {error && <p className="text-sm text-red-500 px-1">{error}</p>}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#71D285] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#71D285] resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-full bg-[#71D285] text-white hover:bg-[#5eae6e] transition-colors font-medium text-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Flashcard"}
          </button>
        </div>
      </div>
    </div>
  );
}
