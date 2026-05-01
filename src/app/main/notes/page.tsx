"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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

type NotesSubject = {
  subject_id: string
  user_id: string
  date_created: string
  subject_name: string
  date_updated_difference?: string
}

export default function Page() {
  const router = useRouter()

  const [Subjects, setSubjects] = useState<NotesSubject[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

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
  }, [currentPage, totalPages])

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
        setLoading(false)
      } catch {
        console.error("Failed to fetch subjects for notes page")
        setLoading(false)
      }
    }

    fetchSubjects()

    try {
      channel = new BroadcastChannel("subjects")
      channel.onmessage = (ev) => {
        const msg = ev.data
        if (msg?.type === "created") {
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
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const enterNotebook = (val: string) => {
    router.push(`/main/notes/notes_with_content?subject_id=${val}`)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading your subjects...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen ml-0 md:ml-0">
      {/* Header section */}
      <div className="px-8 py-6">
        <div className="max-w-[1000px] mx-auto w-full border-b border-gray-200">
          <div className="flex flex-row justify-end items-center py-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex bg-[#71D285] gap-2 px-6 py-2 rounded-full text-white font-medium hover:bg-[#5eae6e] transition-colors items-center"
            >
              <Plus size={20} />
              <span>add subject</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-8 py-12 max-w-[1100px] mx-auto">
        {Subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 mt-20">
            <p className="text-lg">No subjects yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center">
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
        )}
      </div>

      {/* Add Subject Modal */}
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
  )
}
