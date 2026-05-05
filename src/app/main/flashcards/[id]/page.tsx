"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useFlashcardData } from "@/hooks/useFlashcardData";
import { DeckHeader } from "@/components/flashcards/deck-header";
import { FlashcardForm } from "@/components/flashcards/flashcard-form";
import { FlashcardsList } from "@/components/flashcards/flashcards-list";
import DeleteModal from "@/components/schedule/delete-modal";

export default function Page() {
  const params = useParams();
  const subjectId = params.id as string;

  const { cards, subjectName, loading, error, setError, addCard, deleteCard, deleteDeck } =
    useFlashcardData(subjectId);

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddCard = async (question: string, answer: string) => {
    await addCard(question, answer);
  };

  const handleDeleteCard = async (id: string) => {
    await deleteCard(id);
  };

  const handleStudyMode = () => {
    window.location.href = `/main/flashcards/${subjectId}/study`;
  };

  const handleDeleteDeck = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteDeck = async () => {
    const success = await deleteDeck();
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading your cards...</p>
      </div>
    );
  }

  if (error && cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto border-b border-green-200">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-gray-700 mb-2">
            Generating Flashcards
          </h1>
          <p className="text-gray-500">
            Effortlessly generate personalized flashcards from your notes to
            help you review smarter and retain knowledge longer.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8">
        <div className="rounded-3xl p-6 shadow-[10px_10px_30px_rgba(113,210,133,0.2)]">
          <DeckHeader
            subjectName={subjectName}
            cardCount={cards.length}
            onStudyMode={handleStudyMode}
            onDeleteDeck={handleDeleteDeck}
          />

          <FlashcardForm
            isOpen={isAddingCard}
            onOpen={() => setIsAddingCard(true)}
            onClose={() => setIsAddingCard(false)}
            onSubmit={handleAddCard}
          />

          {cards.length === 0 && !isAddingCard ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No cards yet. Add one to get started!</p>
            </div>
          ) : (
            <FlashcardsList cards={cards} onDelete={handleDeleteCard} />
          )}

          {error && cards.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          onConfirm={handleConfirmDeleteDeck}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
