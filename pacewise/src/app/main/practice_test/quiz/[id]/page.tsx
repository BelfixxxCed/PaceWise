"use client";

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  const questions = [
    {
      id: 1,
      text: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correct: "Paris"
    },
    {
      id: 2,
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: "Mars"
    },
    {
      id: 3,
      text: "What measure of central tendency is most affected by extreme values?",
      options: ["Mean", "Median", "Meanie", "Moo"],
      correct: "Mean"
    }
  ];

  const handleAnswerSelect = (questionId: number, answer: string) => {
    if (!quizSubmitted) {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionId]: answer
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    setQuizSubmitted(true);
    // Store the quiz results in localStorage or state management
    const score = calculateScore();
    const results = {
      subjectId: id,
      score: score,
      total: questions.length,
      answers: selectedAnswers,
      questions: questions
    };
    localStorage.setItem(`quiz_result_${id}`, JSON.stringify(results));
  };

  const handleFinish = () => {
    router.push('/main/practice_test');
  };

  const getQuestionStatus = (index: number) => {
    const questionId = questions[index].id;
    const selected = selectedAnswers[questionId];
    
    if (!selected) return 'unanswered';
    if (!quizSubmitted) return 'answered';
    return selected === questions[index].correct ? 'correct' : 'incorrect';
  };

  const score = quizSubmitted ? calculateScore() : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Main Quiz Section */}
        <div className="flex-1 bg-white rounded-3xl border-2 border-green-200 p-10 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-700 mb-1">AMAT 132 QUIZ</h1>
            <p className="text-gray-500">Introduction to Statistics</p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Question {currentQuestion + 1}/{questions.length}: {questions[currentQuestion].text}
            </h2>

            <div className="space-y-4 mb-8">
              {questions[currentQuestion].options.map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = selectedAnswers[questions[currentQuestion].id] === option;
                const isCorrect = questions[currentQuestion].correct === option;
                
                let buttonClass = 'border-gray-200 bg-white hover:border-green-200';
                
                if (quizSubmitted) {
                  if (isCorrect) {
                    buttonClass = 'border-green-300 bg-green-50';
                  } else if (isSelected) {
                    buttonClass = 'border-red-300 bg-red-50';
                  }
                } else if (isSelected) {
                  buttonClass = 'border-green-300 bg-green-50';
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(questions[currentQuestion].id, option)}
                    disabled={quizSubmitted}
                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all ${buttonClass} ${
                      quizSubmitted ? 'cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="font-medium text-gray-800">
                      {letter}. {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  currentQuestion === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                }`}
              >
                Previous
              </button>
              
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Next
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80">
          {quizSubmitted && (
            <div className="bg-white rounded-2xl border-2 border-green-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Score</h3>
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
              
              let buttonClass = 'bg-white text-gray-600 border-2 border-gray-200';
              
              if (status === 'answered' && !quizSubmitted) {
                buttonClass = 'bg-blue-100 text-blue-700 border-2 border-blue-200';
              } else if (status === 'correct') {
                buttonClass = 'bg-green-100 text-green-700 border-2 border-green-200';
              } else if (status === 'incorrect') {
                buttonClass = 'bg-red-100 text-red-700 border-2 border-red-200';
              }
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-full px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${buttonClass}`}
                >
                  {status === 'correct' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {status === 'incorrect' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  Question {index + 1}
                </button>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleSubmit}
              className="w-full bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}