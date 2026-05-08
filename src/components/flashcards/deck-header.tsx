import { Trash2 } from "lucide-react";

interface DeckHeaderProps {
  subjectName: string;
  cardCount: number;
  onStudyMode: () => void;
  onDeleteDeck: () => void;
}

export function DeckHeader({
  subjectName,
  cardCount,
  onStudyMode,
  onDeleteDeck,
}: DeckHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-4xl font-bold text-[#3E6E48] mb-2">
            {subjectName}
          </h2>
          <p className="text-gray-600">
            {cardCount} {cardCount === 1 ? "card" : "cards"} in this deck
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onStudyMode}
            className="px-6 py-2 bg-[#71D285] hover:bg-[#5eae6e] text-white rounded-full font-semibold flex items-center gap-2 transition"
          >
            ▶ Study Mode
          </button>
          <button
            onClick={onDeleteDeck}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold flex items-center gap-2 transition"
          >
            <Trash2 size={18} />
            Delete Deck
          </button>
        </div>
      </div>
    </div>
  );
}
