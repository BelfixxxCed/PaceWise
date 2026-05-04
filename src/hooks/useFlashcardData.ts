import { useState, useEffect } from "react";
import supabase from "@/supabase/supabase_client";

type Flashcard = {
  id?: string;
  question: string;
  answer: string;
};

const STORAGE_PREFIX = "flashcards_subject_";

const getStorageKey = (subjectId: string) => `${STORAGE_PREFIX}${subjectId}`;

const saveToStorage = (
  subjectId: string,
  cards: Flashcard[],
  subjectName: string,
) => {
  try {
    sessionStorage.setItem(
      getStorageKey(subjectId),
      JSON.stringify({ cards, subjectName }),
    );
  } catch (e) {
    // ignore
  }
};

const clearStorage = (subjectId: string) => {
  try {
    sessionStorage.removeItem(getStorageKey(subjectId));
  } catch (e) {
    // ignore
  }
};

export function useFlashcardData(subjectId: string) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: subjectData, error: subjectError } = await supabase
          .from("subjects")
          .select("subject_name")
          .eq("subject_id", subjectId)
          .single();

        if (subjectError) {
          console.error("Error fetching subject:", subjectError);
        }

        const fetchedSubjectName =
          subjectData?.subject_name || "Your Flashcard Deck";
        setSubjectName(fetchedSubjectName);

        const { data, error: fetchError } = await supabase
          .from("flashcards")
          .select("*")
          .order("created_at", { ascending: true })
          .eq("subject_id", subjectId);

        if (fetchError) {
          setError(fetchError.message);
          console.error("Error fetching flashcards:", fetchError);
          setLoading(false);
          return;
        }

        const mappedCards =
          data?.map((card: any) => ({
            id: card.flashcard_id,
            question: card.question,
            answer: card.answer,
          })) || [];

        setCards(mappedCards);
        saveToStorage(subjectId, mappedCards, fetchedSubjectName);
      } catch (err) {
        console.error("Failed to fetch flashcards:", err);
        setError("Failed to load flashcards");
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchData();
    }
  }, [subjectId]);

  const addCard = async (question: string, answer: string) => {
    try {
      const { data, error: insertError } = await supabase
        .from("flashcards")
        .insert([
          {
            flashcard_id: crypto.randomUUID(),
            subject_id: subjectId,
            question,
            answer,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (insertError) {
        setError(insertError.message);
        console.error("Error adding card:", insertError);
        return null;
      }

      if (data?.[0]) {
        const newCard = {
          id: data[0].flashcard_id,
          question: data[0].question,
          answer: data[0].answer,
        };

        setCards((prev) => {
          const next = [...prev, newCard];
          saveToStorage(subjectId, next, subjectName);
          return next;
        });

        return newCard;
      }

      return null;
    } catch (err) {
      console.error("Failed to add card:", err);
      setError("Failed to add card");
      return null;
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("flashcards")
        .delete()
        .eq("flashcard_id", id);

      if (deleteError) {
        setError(deleteError.message);
        console.error("Error deleting card:", deleteError);
        return false;
      }

      setCards((prev) => {
        const next = prev.filter((card) => card.id !== id);
        saveToStorage(subjectId, next, subjectName);
        return next;
      });

      return true;
    } catch (err) {
      console.error("Failed to delete card:", err);
      setError("Failed to delete card");
      return false;
    }
  };

  const deleteDeck = async () => {
    try {
      const { error: deleteError } = await supabase
        .from("flashcards")
        .delete()
        .eq("subject_id", subjectId);

      if (deleteError) {
        setError(deleteError.message);
        console.error("Error deleting deck:", deleteError);
        return false;
      }

      setCards([]);
      clearStorage(subjectId);
      return true;
    } catch (err) {
      console.error("Failed to delete deck:", err);
      setError("Failed to delete deck");
      return false;
    }
  };

  return {
    cards,
    subjectName,
    loading,
    error,
    setError,
    addCard,
    deleteCard,
    deleteDeck,
  };
}
