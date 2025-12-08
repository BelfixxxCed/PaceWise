"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/supabase/supabase_client';

interface Question {
  id: string;
  text: string;
  options: string[];
  correct: string;
  isCorrect: boolean;
}

interface QuestionResponse {
  id: string;
  text: string;
  options: string[];
  correct: string;
  isCorrect: boolean;
}

interface QuizResults {
  title: string;
  subtitle: string;
  score: number;
  total: number;
  questions: Question[];
}

export default function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        
        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/quiz/results?subject_id=${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        // Transform the data - no need for userAnswer since we don't store it
        const questionsWithResults = data.questions.map((q: QuestionResponse) => ({
          id: q.id,
          text: q.text,
          options: q.options,
          correct: q.correct,
          isCorrect: q.isCorrect,
        }));
        
        setQuizResults({
          title: `${data.subject_name} QUIZ`,
          subtitle: data.subject_name,
          score: data.score,
          total: data.total,
          questions: questionsWithResults
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz results:", err);
        setError("Failed to load quiz results");
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [id]);

  const handleFinishReview = () => {
    router.push('/main/practice_test');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading quiz results...</div>
      </div>
    );
  }

  if (error || !quizResults) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || "No quiz results found"}</div>
          <button
            onClick={() => router.push('/main/practice_test')}
            className="bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Back to Practice Tests
          </button>
        </div>
      </div>
    );
  }

  const question = quizResults.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Main Review Section */}
        <div className="flex-1 bg-white rounded-3xl border-2 border-green-200 p-10 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-700 mb-1">{quizResults.title}</h1>
            <p className="text-gray-500">{quizResults.subtitle}</p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Question {currentQuestion + 1}/{quizResults.questions.length}: {question.text}
              </h2>
              <div className="flex items-center gap-2">
                {question.isCorrect ? (
                  <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-green-700 font-semibold">Correct</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                    <span className="text-red-700 font-semibold">Incorrect</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {question.options.map((option: string, index: number) => {
                const letter = String.fromCharCode(65 + index);
                const isCorrectAnswer = question.correct === option;
                
                let buttonClass = 'border-gray-200 bg-white';
                
                if (isCorrectAnswer) {
                  buttonClass = 'border-green-300 bg-green-50';
                }
                
                return (
                  <div
                    key={index}
                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 ${buttonClass}`}
                  >
                    <span className="font-medium text-gray-800">
                      {letter}. {option}
                    </span>
                    {isCorrectAnswer && (
                      <div className="inline-block ml-4 text-green-600">
                        <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  currentQuestion === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                }`}
              >
                Previous
              </button>

              {currentQuestion < quizResults.questions.length - 1 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80">
          <div className="bg-white rounded-2xl border-2 border-green-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Score</h3>
            <p className="text-4xl font-bold text-green-500">
              {quizResults.score}/{quizResults.total}
            </p>
            <p className="text-gray-500 mt-1">
              {Math.round((quizResults.score / quizResults.total) * 100)}% Correct
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {quizResults.questions.map((q: Question, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-full px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${
                  currentQuestion === index
                    ? 'bg-green-500 text-white border-2 border-green-600 shadow-md'
                    : q.isCorrect
                    ? 'bg-green-100 text-green-700 border-2 border-green-200'
                    : 'bg-red-100 text-red-700 border-2 border-red-200'
                }`}
              >
                {q.isCorrect ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                Question {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleFinishReview}
            className="w-full bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            finish review
          </button>
        </div>
      </div>
    </div>
  );
}