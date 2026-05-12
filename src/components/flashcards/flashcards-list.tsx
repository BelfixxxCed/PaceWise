import { Trash2 } from "lucide-react";

type Flashcard = {
  id?: string;
  question: string;
  answer: string;
};

interface FlashcardsListProps {
  cards: Flashcard[];
  onDelete: (id: string) => Promise<void>;
}

export function FlashcardsList({ cards, onDelete }: FlashcardsListProps) {
  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <div
          key={card.id || index}
          className="border-2 border-green-500 rounded-3xl p-6 bg-white relative"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Card {index + 1}
            </span>
            <button
              onClick={() => onDelete(card.id!)}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
              aria-label={`Delete card ${index + 1}`}
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 font-semibold mb-2">Question:</p>
            <p className="text-gray-800">{card.question}</p>
          </div>

          <div>
            <p className="text-gray-700 font-semibold mb-2">Answer:</p>
            <p className="text-gray-800">{card.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
