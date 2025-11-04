"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizResults, setQuizResults] = useState<any>(null);
  
  useEffect(() => {
    // Load quiz results from localStorage
    const savedResults = localStorage.getItem(`quiz_result_${id}`);
    if (savedResults) {
      const results = JSON.parse(savedResults);
      
      // Transform the data to include correctness info
      const questionsWithResults = results.questions.map((q: any) => ({
        ...q,
        userAnswer: results.answers[q.id] || '',
        isCorrect: results.answers[q.id] === q.correct
      }));
      
      setQuizResults({
        title: "AMAT 132 QUIZ",
        subtitle: "Introduction to Statistics",
        score: results.score,
        total: results.total,
        questions: questionsWithResults
      });
    }
  }, [id]);

  const handleFinishReview = () => {
    router.push('/main/practice_test');
  };

  if (!quizResults) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading quiz results...</div>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Question {currentQuestion + 1}/{quizResults.questions.length}: {question.text}
            </h2>

            <div className="space-y-4">
              {question.options.map((option: string, index: number) => {
                const letter = String.fromCharCode(65 + index);
                const isUserAnswer = question.userAnswer === option;
                const isCorrectAnswer = question.correct === option;
                
                let buttonClass = 'border-gray-200 bg-white';
                
                if (isCorrectAnswer) {
                  buttonClass = 'border-green-300 bg-green-50';
                } else if (isUserAnswer && !question.isCorrect) {
                  buttonClass = 'border-red-300 bg-red-50';
                }
                
                return (
                  <div
                    key={index}
                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 ${buttonClass}`}
                  >
                    <span className="font-medium text-gray-800">
                      {letter}. {option}
                    </span>
                  </div>
                );
              })}
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
            {quizResults.questions.map((q: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-full px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${
                  q.isCorrect
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