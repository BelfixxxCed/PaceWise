"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/supabase/supabase_client";

interface Question {
  question_id: string;
  subject_id: string;
  question: string;
  answer: string;
  options: string[];
  repetition: number;
  ease_factor: number;
  interval: number;
  next_appearance: string;
}

interface QuizPageProps {
  subjectId: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizSection({ subjectId }: QuizPageProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjectName, setSubjectName] = useState("Practice Quiz");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);

  const getToken = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  }, []);

  useEffect(() => {
    const startQuiz = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("No auth token");
          setLoading(false);
          router.push("/login");
          return;
        }

        const startRes = await fetch("/api/quiz/start", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subject_id: subjectId }),
        });

        const startJson = await startRes.json();
        if (startRes.ok && startJson.quiz_id) {
          setQuizId(startJson.quiz_id);
        } else {
          console.error("Failed to start quiz:", startJson.error);
          setLoading(false);
          return;
        }

        const res = await fetch(
          `/api/quiz/questions?subject_id=${subjectId}&limit=10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (res.ok && json.data) {
          setSubjectName(json.subject_name || "Practice Quiz");
          const withShuffledOptions = json.data.map((q: Question) => ({
            ...q,
            options: shuffle(q.options),
          }));
          const shuffledQuestions: Question[] = shuffle(withShuffledOptions);
          setQuestions(shuffledQuestions);
        } else {
          console.error("Failed to load questions:", json.error);
        }
      } catch (error) {
        console.error("Error loading questions:", error);
      } finally {
        setLoading(false);
      }
    };

    startQuiz();
  }, [subjectId, getToken]);

  const handleAnswerSelect = useCallback(
    (questionId: string, answer: string) => {
      if (!quizSubmitted) {
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
      }
    },
    [quizSubmitted]
  );

  const handleNavigation = useCallback(
    (direction: "next" | "prev") => {
      setCurrentQuestion((curr) => {
        if (direction === "next" && curr < questions.length - 1)
          return curr + 1;
        if (direction === "prev" && curr > 0) return curr - 1;
        return curr;
      });
    },
    [questions.length]
  );

  const submitSingleAnswer = useCallback(
    async (question: Question, isCorrect: boolean) => {
      try {
        const token = await getToken();
        if (!token) return false;

        const res = await fetch(`/api/quiz/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question_id: question.question_id,
            isCorrect,
            quiz_id: quizId,
          }),
        });

        if (!res.ok) {
          const json = await res.json();
          console.error("Update failed:", json.error);
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error submitting answer:", error);
        return false;
      }
    },
    [getToken, quizId]
  );

  const handleSubmitQuiz = useCallback(async () => {
    setSubmitting(true);

    const submissions = questions.map((q) => {
      const userAnswer = selectedAnswers[q.question_id];
      const isCorrect = userAnswer === q.answer;
      return submitSingleAnswer(q, isCorrect);
    });

    await Promise.all(submissions);

    if (quizId) {
      try {
        const token = await getToken();
        if (token) {
          const completeRes = await fetch("/api/quiz/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quiz_id: quizId }),
          });

          if (!completeRes.ok) {
            const json = await completeRes.json();
            console.error("Quiz completion failed:", json.error);
          }
        }
      } catch (error) {
        console.error("Error completing quiz:", error);
      }
    }

    setQuizSubmitted(true);
    setLoading(false);
    setSubmitting(false);
  }, [questions, selectedAnswers, submitSingleAnswer, quizId, getToken]);

  const calculateScore = useCallback(() => {
    return questions.reduce((score, q) => {
      return selectedAnswers[q.question_id] === q.answer ? score + 1 : score;
    }, 0);
  }, [questions, selectedAnswers]);

  const getQuestionStatus = useCallback(
    (index: number): "unanswered" | "answered" | "correct" | "incorrect" => {
      const q = questions[index];
      const selected = selectedAnswers[q.question_id];

      if (!selected) return "unanswered";
      if (!quizSubmitted) return "answered";
      return selected === q.answer ? "correct" : "incorrect";
    },
    [questions, selectedAnswers, quizSubmitted]
  );

  const getOptionStyle = useCallback(
    (option: string, questionAnswer: string) => {
      const isSelected =
        selectedAnswers[questions[currentQuestion].question_id] === option;
      const isCorrect = questionAnswer === option;

      if (quizSubmitted) {
        if (isCorrect) return "border-green-300 bg-green-50";
        if (isSelected) return "border-red-300 bg-red-50";
      } else if (isSelected) {
        return "border-green-300 bg-green-50";
      }
      return "border-gray-200 bg-white hover:border-green-200";
    },
    [selectedAnswers, questions, currentQuestion, quizSubmitted]
  );

  const getQuestionButtonStyle = useCallback((status: string) => {
    const baseStyle =
      "w-full px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-3";

    switch (status) {
      case "answered":
        return `${baseStyle} bg-blue-100 text-blue-700 border-2 border-blue-200`;
      case "correct":
        return `${baseStyle} bg-green-100 text-green-700 border-2 border-green-200`;
      case "incorrect":
        return `${baseStyle} bg-red-100 text-red-700 border-2 border-red-200`;
      default:
        return `${baseStyle} bg-white text-gray-600 border-2 border-gray-200`;
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="w-full absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        No questions available for now.
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const score = quizSubmitted ? calculateScore() : 0;
  const allAnswered = questions.every((q) => selectedAnswers[q.question_id]);

  return (
    <>
      <div className="flex-1 bg-white rounded-3xl border-2 border-green-200 p-10 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-700 mb-1">
            {subjectName}
          </h1>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Question {currentQuestion + 1}/{questions.length}:{" "}
            {currentQ.question}
          </h2>

          <div className="space-y-4 mb-8">
            {currentQ.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const buttonClass = getOptionStyle(option, currentQ.answer);

              return (
                <button
                  key={index}
                  onClick={() =>
                    handleAnswerSelect(currentQ.question_id, option)
                  }
                  disabled={quizSubmitted}
                  className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all ${buttonClass} ${
                    quizSubmitted ? "cursor-not-allowed" : ""
                  }`}
                >
                  <span className="font-medium text-gray-800">
                    {letter}. {option}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => handleNavigation("prev")}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                currentQuestion === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400 text-gray-700"
              }`}
            >
              Previous
            </button>

            {currentQuestion < questions.length - 1 && (
              <button
                onClick={() => handleNavigation("next")}
                className="bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-80">
        {quizSubmitted && (
          <div className="bg-white rounded-2xl border-2 border-green-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Your Score
            </h3>
            <p className="text-4xl font-bold text-green-500">
              {score}/{questions.length}
            </p>
            <p className="text-gray-500 mt-1">
              {Math.round((score / questions.length) * 100)}% Correct
            </p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {questions.map((_, index) => {
            const status = getQuestionStatus(index);
            const buttonClass = getQuestionButtonStyle(status);

            return (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={buttonClass}
              >
                {status === "correct" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {status === "incorrect" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
                Question {index + 1}
              </button>
            );
          })}
        </div>

        {!quizSubmitted ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={!allAnswered || submitting}
            className={`w-full px-6 py-3 rounded-xl font-medium transition-colors ${
              !allAnswered || submitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-400 hover:bg-green-500 text-white"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        ) : (
          <button
            onClick={() => router.push("/main/practice_test")}
            className="w-full bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Finish
          </button>
        )}
      </div>
    </>
  );
}
