"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import { GET_subjects } from "@/components/notes/notes_page_supabase_queries";
import LoadingModal from "@/components/loading_modal";
import { Plus } from "lucide-react";

type Subject = {
  subject_id: string;
  subject_name: string;
  date_created: string;
  notes_pages?: Array<{ updated_at: string }>;
  date_updated_difference: string;
};

function Page() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(subjects.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubjects = subjects.slice(startIndex, endIndex);

  const getData = async () => {
    const data = await GET_subjects();
    setSubjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }

    getData();
  }, [currentPage, totalPages]);

  const timeAgo = (date: string): string => {
    const now = new Date().getTime();
    const past = new Date(date).getTime();
    const diff = now - past;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years >= 1) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (weeks >= 1) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
  };

  const formatDate = (date: string): string => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const enterNotebook = (val: string) => {
    router.push(`/main/notes/notes_with_content?subject_id=${val}`);
  };

  if (loading) {
    return <LoadingModal message="Loading your subjects..." />;
  }

  return (
    <div className="min-h-screen ml-0 md:ml-0">
      {/* Header section */}
      <div className="px-8 py-6">
        <div className="max-w-[1000px] mx-auto w-full border-b border-gray-200">
          <div className="flex flex-row justify-end items-center py-2">
            <a href="/main/schedule#:~:text=%3A00%20AM-,Add%20Subject,-from">
              <button className="flex bg-[#71D285] gap-2 px-6 py-2 rounded-full text-white font-medium hover:bg-[#5eae6e] transition-colors items-center">
                <Plus size={20} />
                <span>add subject</span>
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-8 py-12 max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-4 gap-y-10 justify-items-center">
          {paginatedSubjects.map((subject) => (
            <button
              key={subject.subject_id}
              onClick={() => enterNotebook(subject.subject_id)}
              className="group text-left hover:shadow-xl rounded-3xl transition-all duration-200 w-full max-w-[310px] bg-transparent hover:bg-gray-50"
            >
              <div className="border-2 border-[#71D285] rounded-3xl overflow-hidden bg-transparent hover:bg-gray-50 transition-colors">
                {/* Upper part of card */}
                <div className="h-12 bg-[#71D285] flex items-center justify-end px-4">
                  <span className="text-white text-sm font-medium">
                    {subject.date_updated_difference || timeAgo(subject.date_created)}
                  </span>
                </div>
                {/* Lower part of card */}
                <div className="p-6 bg-transparent">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <Image height={25} width={25} src="/reusable_ui_images/note_logo.svg" alt="Note icon" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#3E6E48]">{subject.subject_name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{formatDate(subject.date_created)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
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
  );
}

export default Page;
