// QUIZ FEATURE DISABLED
/*
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
*/

export default async function QuizPage() {
  return null;
}
