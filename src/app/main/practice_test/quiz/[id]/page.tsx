import { Suspense } from "react";
import QuizSection from "@/components/quiz/quizSection";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto flex gap-6">
        <QuizSection subjectId={id} />
      </div>
    </div>
  );
}

function QuizLoadingSkeleton() {
  return (
    <>
      <div className="flex-1 bg-white rounded-3xl border-2 border-green-200 p-10 shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="w-80 space-y-4">
        <div className="h-32 bg-white rounded-2xl border-2 border-green-200 animate-pulse"></div>
      </div>
    </>
  );
}
