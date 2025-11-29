"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSubjectsProgress } from '@/lib/subjectsProgress';
import supabase from '@/supabase/supabase_client';

export default function PracticeTestPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Amat 132', progress: 0, score: 0, maxScore: 10, completed: false },
    { id: 2, name: 'Amat 132', progress: 0, score: 0, maxScore: 10, completed: false },
    { id: 3, name: 'Amat 132', progress: 0, score: 0, maxScore: 10, completed: false },
    { id: 4, name: 'Amat 132', progress: 0, score: 0, maxScore: 10, completed: false },
    { id: 5, name: 'Amat 132', progress: 0, score: 0, maxScore: 10, completed: false },
    { id: 6, name: 'Amat 132', progress: 0, score: 0, maxScore: 10, completed: false },
  ]);

  const get_subject_data = async () => {
    const {data : data_user, error : error_user} = await supabase.auth.getUser();
    if(error_user){
      console.log("There was an error in getting user: ", error_user.message);
      return;
    }
    const data = await getSubjectsProgress(data_user.user.id);
    setSubjects(data);
  }

  useEffect(() => {
    // Check localStorage for completed quizzes
    const updatedSubjects = subjects.map(subject => {
      const quizResult = localStorage.getItem(`quiz_result_${subject.id}`);
      if (quizResult) {
        const result = JSON.parse(quizResult);
        const progress = Math.round((result.score / result.total) * 100);
        return {
          ...subject,
          completed: true,
          score: result.score,
          maxScore: result.total,
          progress: progress
        };
      }
      return subject;
    });
    setSubjects(updatedSubjects);
    get_subject_data()
  }, []);

  const handleTakeQuiz = (id: number) => {
    router.push(`/main/practice_test/quiz/${id}`);
  };

  const handleViewSummary = (id: number) => {
    router.push(`/main/practice_test/summary/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-700 mb-2">Generating Practice Test</h1>
          <p className="text-gray-500">
            Effortlessly generate personalized practice tests from your notes — powered by AI to help you review smarter and retain knowledge longer.
          </p>
        </div>

        <div className="bg-white rounded-3xl border-2 border-green-200 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-600 mb-6">Current Subjects</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-500 font-medium">Course Name</th>
                  <th className="text-left py-4 px-4 text-gray-500 font-medium">Progress</th>
                  <th className="text-left py-4 px-4 text-gray-500 font-medium">Score</th>
                  <th className="text-left py-4 px-4 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id} className="border-b border-gray-100">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-800">{subject.name}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-gray-700 font-medium">{subject.progress}%</span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-gray-700 font-medium">{subject.score}/{subject.maxScore}</span>
                    </td>
                    <td className="py-6 px-4">
                      {subject.completed ? (
                        <button
                          onClick={() => handleViewSummary(subject.id)}
                          className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          view summary
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTakeQuiz(subject.id)}
                          className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          take quiz
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}