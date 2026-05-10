"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import supabase from "@/supabase/supabase_client";

interface Card {
  id: string;
  question: string;
  answer: string;
  subject: string;
}

interface FlashcardProps {
  cards: Card[];
  subjectName?: string;
}

export function Flashcard({ cards, subjectName }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const flipDuration = 500; // must match CSS transition duration (ms)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleFlip = () => {
    if (!isFlipped && currentCard?.id) {
      supabase
        .from("flashcards")
        .update({ is_reviewed: true })
        .eq("flashcard_id", currentCard.id)
        .then(({ error }) => {
          if (error) console.error("Error marking card as reviewed:", error);
        });
    }
    setIsFlipped(!isFlipped);
  };

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;
  const visibleCardIndices = Array.from(
    { length: Math.min(totalCards, 5) },
    (_, i) => {
      const maxStart = Math.max(0, totalCards - 5);
      const start = Math.min(Math.max(0, currentIndex - 2), maxStart);
      return start + i;
    },
  );

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      if (isFlipped) {
        setIsFlipped(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
          setCurrentIndex((i) => i + 1);
          timeoutRef.current = null;
        }, flipDuration);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      if (isFlipped) {
        setIsFlipped(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
          setCurrentIndex((i) => i - 1);
          timeoutRef.current = null;
        }, flipDuration);
      } else {
        setCurrentIndex((i) => i - 1);
      }
    }
  };

  const handleClose = () => {
    window.history.back();
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-background p-4 sm:p-6">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
        aria-label="Close study mode"
      >
        <X className="w-6 h-6 color-white" />
      </button>

      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#71D285] mb-2">
          Study Mode
        </h1>
        <p className="text-center text-muted-foreground text-lg">
          Card {currentIndex + 1} of {totalCards}
        </p>
      </div>

      {/* Flashcard */}
      <div className="w-full max-w-2xl mb-12">
        <div
          onClick={handleFlip}
          className="relative h-96 cursor-pointer perspective"
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-gpu ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front - Question */}
            <div
              className="absolute w-full h-full bg-[#71D285] text-primary-foreground rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center shadow-2xl"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="mb-6 inline-block bg-white/20 px-4 py-2 rounded-full">
                <p className="text-sm font-semibold text-primary-foreground">
                  {subjectName || currentCard.subject}
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-center leading-relaxed mb-auto">
                {currentCard.question}
              </h2>
              <p className="text-center text-primary-foreground/70 text-sm mt-auto italic">
                Click to see answer
              </p>
            </div>

            {/* Back - Answer */}
            <div
              className="absolute w-full h-full bg-secondary text-secondary-foreground rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center shadow-2xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="mb-6 inline-block bg-white/20 px-4 py-2 rounded-full">
                <p className="text-sm font-semibold text-secondary-foreground">
                  Answer
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-lg sm:text-xl text-center leading-relaxed">
                  {currentCard.answer}
                </p>
              </div>
              <p className="text-center text-secondary-foreground/70 text-sm mt-auto italic">
                Click to see question
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-4 sm:gap-8 mb-8">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`p-4 rounded-full transition-all ${
            currentIndex === 0
              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              : "bg-[#71D285] text-primary-foreground hover:bg-[#71D285]/90 hover:scale-110"
          }`}
          aria-label="Previous card"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div className="flex gap-2">
          {visibleCardIndices.map((index) => (
            <button
              key={index}
              onClick={() => {
                if (index === currentIndex) return;
                if (isFlipped) {
                  setIsFlipped(false);
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  timeoutRef.current = window.setTimeout(() => {
                    setCurrentIndex(index);
                    timeoutRef.current = null;
                  }, flipDuration);
                } else {
                  setCurrentIndex(index);
                }
              }}
              className={`h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-[#71D285] w-8"
                  : "bg-muted w-3 hover:bg-muted/70"
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === totalCards - 1}
          className={`p-4 rounded-full transition-all ${
            currentIndex === totalCards - 1
              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              : "bg-[#71D285] text-primary-foreground hover:bg-[#71D285]/90 hover:scale-110"
          }`}
          aria-label="Next card"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Progress Indicator Text */}
      <p className="text-muted-foreground text-center text-sm sm:text-base">
        {isFlipped ? "Answer • " : "Question • "}
        Use arrow buttons or click dots to navigate
      </p>
    </div>
  );
}
