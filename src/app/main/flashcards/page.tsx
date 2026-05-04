"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSubjects } from "@/hooks/useSubjects";
import { Pagination } from "@/components/ui/pagination";
import { SubjectCard } from "@/components/flashcards/subject-card";

const ITEMS_PER_PAGE = 6;

export default function Page() {
  const router = useRouter();
  const { subjects, loading } = useSubjects();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(subjects.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubjects = subjects.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/main/flashcards/${subjectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading your subjects...</p>
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

      <div className="ml-0 md:ml-0">
        <div className="px-8 py-12 max-w-[1100px] mx-auto">
          {subjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-400 mt-20">
              <p className="text-lg">
                No subjects yet. Add one to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center">
              {paginatedSubjects.map((subject) => (
                <SubjectCard
                  key={subject.subject_id}
                  subjectId={subject.subject_id}
                  subjectName={subject.subject_name}
                  dateCreated={subject.date_created}
                  onClick={handleSubjectClick}
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-20" />

        <div className="fixed left-0 right-0 bottom-0 flex justify-center z-50 pointer-events-none">
          <div className="w-full flex justify-center pointer-events-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
