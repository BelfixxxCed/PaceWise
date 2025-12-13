<<<<<<< HEAD
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
=======
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pagination } from "@/components/ui/pagination"
import { Plus } from "lucide-react"
import AddSubjectForm from "@/components/schedule/add-subject-form"
import {
  createSubject,
  transformSubjectToDB,
  getAllSubjects,
} from "@/components/schedule/schedule_supabase_query"
import supabase from "@/supabase/supabase_client"
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))

function Page() {
  const router = useRouter()

<<<<<<< HEAD
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
=======
  type NotesSubject = {
    subject_id: string
    user_id: string
    date_created: string
    subject_name: string
  }
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))

  const [Subjects, setSubjects] = useState<NotesSubject[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const ITEMS_PER_PAGE = 6
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(Subjects.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedSubjects = Subjects.slice(startIndex, endIndex)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1) 
    }
<<<<<<< HEAD

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
=======
  }, [currentPage, totalPages])

  // Fetch subjects from DB and listen for realtime broadcasts
  useEffect(() => {
    let channel: BroadcastChannel | null = null

    async function fetchSubjects() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return
        const data = await getAllSubjects(user.id)
        const mapped = data.map((s) => ({
          subject_id: s.subject_id,
          user_id: s.user_id,
          date_created: s.date_created ?? new Date().toISOString(),
          subject_name: s.subject_name,
        }))
        setSubjects(mapped)
      } catch {
        console.error("Failed to fetch subjects for notes page")
      }
    }

    fetchSubjects()

    try {
      channel = new BroadcastChannel("subjects")
      channel.onmessage = (ev) => {
        const msg = ev.data
        if (msg?.type === "created") {
          // Re-fetch to keep in sync
          fetchSubjects()
        }
      }
    } catch {
      // BroadcastChannel not available in some environments
    }

    return () => {
      if (channel) channel.close()
    }
  }, [])

  const timeAgo = (date: string): string => {
    const now = new Date().getTime()
    const past = new Date(date).getTime()
    const diff = now - past
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (years >= 1) return `${years} year${years > 1 ? "s" : ""} ago`
    if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`
    if (weeks >= 1) return `${weeks} week${weeks > 1 ? "s" : ""} ago`
    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    return "just now"
  }

  const formatDate = (date: string): string => {
    const d = new Date(date)
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
<<<<<<< HEAD
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
=======
    })
  }

  const enterNotebook = (val: string) => {
    router.push(`/main/notes/notes_with_content?subject_id=${val}`)
  }

  const handleAddSubject = () => {
    setIsModalOpen(true)
  }
  const handleAddSubjectSubmit = async (input: {
    title: string
    startTime: string
    startMinutes: string
    startPeriod: "AM" | "PM"
    endTime: string
    endMinutes: string
    endPeriod: "AM" | "PM"
  }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const userId = user?.id ?? "11111111-1111-1111-1111-111111111111"

      const dbPayload = transformSubjectToDB(
        {
          title: input.title,
          startTime: input.startTime,
          startMinutes: input.startMinutes,
          startPeriod: input.startPeriod,
          endTime: input.endTime,
          endMinutes: input.endMinutes,
          endPeriod: input.endPeriod,
        },
        userId
      )

      const created = await createSubject(dbPayload)

      // Broadcast the creation so other pages can refresh themselves
      try {
        const channel = new BroadcastChannel("subjects")
        channel.postMessage({ type: "created", subject: created })
        channel.close()
      } catch {
        // ignore
      }

      const mapped: NotesSubject = {
        subject_id: created.subject_id ?? `id-${Date.now()}`,
        user_id: created.user_id ?? userId,
        date_created: created.date_created ?? new Date().toISOString(),
        subject_name: (created.subject_name ?? input.title) || "Untitled",
      }

      setSubjects((prev) => [mapped, ...prev])
      setIsModalOpen(false)
    } catch (err) {
      console.error("Failed to create subject in DB", err)
      const mapped: NotesSubject = {
        subject_id: `id-${Date.now()}`,
        user_id: "11111111-1111-1111-1111-111111111111",
        date_created: new Date().toISOString(),
        subject_name: input.title || "Untitled",
      }
      setSubjects((prev) => [mapped, ...prev])
      setIsModalOpen(false)
    }
  }

  return (
    <div className="min-h-screenml-0 md:ml-0">
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))
      {/* Header section */}
      <div className="px-8 py-6">
        <div className="max-w-[1000px] mx-auto w-full border-b border-gray-200">
          <div className="flex flex-row justify-end items-center py-2">
<<<<<<< HEAD
            <a href="/main/schedule#:~:text=%3A00%20AM-,Add%20Subject,-from">
              <button className="flex bg-[#71D285] gap-2 px-6 py-2 rounded-full text-white font-medium hover:bg-[#5eae6e] transition-colors items-center">
                <Plus size={20} />
                <span>add subject</span>
              </button>
            </a>
=======
            <button onClick={handleAddSubject} className="flex bg-[#71D285] gap-2 px-6 py-2 rounded-full text-white font-medium hover:bg-[#5eae6e] transition-colors items-center">
              <Plus size={20} />
              <span>add subject</span>
            </button>
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-8 py-12 max-w-[1100px] mx-auto">
<<<<<<< HEAD
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-4 gap-y-10 justify-items-center">
=======
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center">
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))
          {paginatedSubjects.map((subject) => (
            <button
              key={subject.subject_id}
              onClick={() => enterNotebook(subject.subject_id)}
<<<<<<< HEAD
              className="group text-left hover:shadow-xl rounded-3xl transition-all duration-200 w-full max-w-[310px] bg-transparent hover:bg-gray-50"
=======
              className="group text-left hover:shadow-xl rounded-3xl transition-all duration-200 w-full max-w-[300px] bg-transparent hover:bg-gray-50"
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))
            >
              <div className="border-2 border-[#71D285] rounded-3xl overflow-hidden bg-transparent hover:bg-gray-50 transition-colors">
                {/* Upper part of card */}
                <div className="h-12 bg-[#71D285] flex items-center justify-end px-4">
<<<<<<< HEAD
                  <span className="text-white text-sm font-medium">
                    {subject.date_updated_difference || timeAgo(subject.date_created)}
                  </span>
=======
                  <span className="text-white text-sm font-medium">{timeAgo(subject.date_created)}</span>
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))
                </div>
                {/* Lower part of card */}
                <div className="p-6 bg-transparent">
                  <div className="flex items-start gap-3">
<<<<<<< HEAD
                    <div className="mt-1 flex-shrink-0">
                      <Image height={25} width={25} src="/reusable_ui_images/note_logo.svg" alt="Note icon" />
=======
                    <div className="text-[#71D285] mt-1 flex-shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                      </svg>
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))
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

<<<<<<< HEAD
=======
      {/* Pagination */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl p-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
              <AddSubjectForm onAddSubject={handleAddSubjectSubmit} />
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))
      <div className="h-20" />

      <div className="fixed left-0 right-0 bottom-0 flex justify-center z-50 pointer-events-none">
        <div className="w-full flex justify-center pointer-events-auto">
<<<<<<< HEAD
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
=======
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))
        </div>
      </div>
    </div>
  );
}

export default Page
