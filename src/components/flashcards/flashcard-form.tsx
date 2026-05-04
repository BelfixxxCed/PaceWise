import * as React from "react";
import { Plus } from "lucide-react";

interface FlashcardFormProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSubmit: (question: string, answer: string) => Promise<void>;
}

export function FlashcardForm({
  isOpen,
  onOpen,
  onClose,
  onSubmit,
}: FlashcardFormProps) {
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (question.trim() && answer.trim()) {
      setIsSubmitting(true);
      await onSubmit(question, answer);
      setIsSubmitting(false);
      setQuestion("");
      setAnswer("");
      onClose();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onOpen}
        className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold flex items-center gap-2 mb-6 transition"
      >
        <Plus size={18} />
        Add New Card
      </button>
    );
  }

  return (
    <div className="border-2 border-green-500 rounded-3xl p-8 mb-6 bg-white">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Card</h3>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-3">
          Question
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          className="w-full px-4 py-3 border-2 border-green-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-3">Answer</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter the answer..."
          className="w-full px-4 py-3 border-2 border-green-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !question.trim() || !answer.trim()}
          className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          {isSubmitting ? "Adding..." : "Add Card"}
        </button>
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
