"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Flashcard } from "@/components/flashcards/flashcard";
import supabase from "@/supabase/supabase_client";

type Card = {
  id: number;
  question: string;
  answer: string;
  subject: string;
};

type StoredFlashcard = {
  question?: string;
  answer?: string;
};

export default function Home() {
  const params = useParams();
  const subjectId = params.id as string;

  const [cards, setCards] = useState<Card[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storageKey = `flashcards_subject_${subjectId}`;

    const load = async () => {
      try {
        setLoading(true);
        // Try sessionStorage first
        try {
          const raw = sessionStorage.getItem(storageKey);
          if (raw) {
            const parsed = JSON.parse(raw) as {
              cards?: StoredFlashcard[];
              subjectName?: string;
            };
            const cardsData = parsed.cards || [];
            const subjName = parsed.subjectName || subjectId;

            const mapped = cardsData.map((c, i: number) => ({
              id: i + 1,
              question: c.question ?? "",
              answer: c.answer ?? "",
              subject: subjName,
            }));
            setCards(mapped);
            setSubjectName(subjName);
            setLoading(false);
            return;
          }
        } catch {
          // ignore sessionStorage errors and fall back to fetching
        }

        // Fallback: fetch from DB
        const { data: subjectData } = await supabase
          .from("subjects")
          .select("subject_name")
          .eq("subject_id", subjectId)
          .single();

        const subjName = subjectData?.subject_name || subjectId;
        setSubjectName(subjName);

        const { data, error } = await supabase
          .from("flashcards")
          .select("*")
          .eq("subject_id", subjectId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        const mapped = (data || []).map((row, i: number) => ({
          id: i + 1,
          question: row.question as string,
          answer: row.answer as string,
          subject: subjName,
        }));

        setCards(mapped);
        try {
          sessionStorage.setItem(
            storageKey,
            JSON.stringify({
              cards: mapped,
              subjectName: subjName,
            }),
          );
        } catch {
          // ignore
        }

        // Trigger streak update when they successfully load flashcards to study
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          fetch("/api/streak", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }).catch((err) => console.error("Failed to update streak:", err));
        }
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) load();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading cards...</p>
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
      <div className="max-w-5xl mx-auto mt-10">
        <div className=" rounded-3xl p-6 shadow-[10px_10px_30px_rgba(113,210,133,0.2)]">
          <Flashcard cards={cards} subjectName={subjectName} />
        </div>
      </div>
    </div>
  );
}
