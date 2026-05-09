"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Trash2, Plus, ArrowLeft, Search, Tag, X } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import supabase from "@/supabase/supabase_client"

interface Note {
  notes_id: string
  subject_id: string
  date_created: string
  updated_at: string
  tags?: { id: string; name: string }[]
}

function NotesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subjectId = searchParams.get("subject_id") ?? ""

  const [notes, setNotes] = useState<Note[]>([])
  const [subjectName, setSubjectName] = useState("Loading...")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  // Filter notes by tag search
  const filteredNotes = searchQuery.trim()
    ? notes.filter((note) =>
        note.tags?.some((tag) =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : notes

  const totalPages = Math.max(1, Math.ceil(filteredNotes.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex)

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [currentPage, totalPages])

  useEffect(() => {
    if (!subjectId) return

    const fetchSubjectName = async () => {
      const { data } = await supabase
        .from("subjects")
        .select("subject_name")
        .eq("subject_id", subjectId)
        .single()
      setSubjectName(data?.subject_name ?? "Subject")
    }

    const fetchNotes = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) return

        const res = await fetch(`/api/notes?subject_id=${subjectId}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const result = await res.json()
        if (res.ok && Array.isArray(result.data)) {
          // For each note, fetch its tags
          const notesWithTags = await Promise.all(
            result.data.map(async (note: Note) => {
              const { data: tagLinks } = await supabase
                .from("tags-notes")
                .select("tag_id, tags(id, name)")
                .eq("notes_id", note.notes_id)

              const tags = (tagLinks ?? [])
                .map((tl: any) => tl.tags)
                .filter(Boolean)
                .flat()

              return { ...note, tags }
            })
          )
          setNotes(notesWithTags)
        }
      } catch (err) {
        console.error("Failed to fetch notes:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubjectName()
    fetchNotes()
  }, [subjectId])

  const addNote = async () => {
    if (!subjectId) return
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch(`/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          subject_id: subjectId,
          notes_json: [{ type: "p", children: [{ text: "" }] }],
        }),
      })
      const result = await res.json()
      if (res.ok && result.data) {
        router.push(`/main/notes/notes_with_content/editor?note_id=${result.data.notes_id}`)
      }
    } catch (err) {
      console.error("Failed to add note:", err)
    }
  }

  const deleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await supabase.from("notes_pages").delete().eq("notes_id", id)
      setNotes((prev) => prev.filter((n) => n.notes_id !== id))
    } catch (err) {
      console.error("Failed to delete note:", err)
    }
  }

  const formatDateDisplay = (date: string): string => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading notes...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen ml-0 md:ml-0">
      {/* Header */}
      <div className="px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <h1 className="text-3xl font-bold text-[#3E6E48]">{subjectName}</h1>
            </div>

            <div className="flex gap-3">
              {/* QUIZ FEATURE DISABLED
              <button
                onClick={() => router.push(`/main/practice_test?subject_id=${subjectId}`)}
                className="flex bg-[#71D285] gap-2 px-5 py-2 rounded-full text-white font-medium hover:bg-[#5eae6e] transition-colors items-center"
              >
                <Zap size={18} />
                <span>generate test</span>
              </button>
              */}
              <button
                onClick={addNote}
                className="flex bg-[#71D285] gap-2 px-5 py-2 rounded-full text-white font-medium hover:bg-[#5eae6e] transition-colors items-center"
              >
                <Plus size={18} />
                <span>add notes</span>
              </button>
            </div>
          </div>

          {/* Tag Search Bar */}
          <div className="mt-4 relative">
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#71D285] transition">
              <Tag size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                placeholder="Search by tag..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-gray-400 mt-1 ml-4">
                {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notes list */}
      <div className="px-8 flex justify-center">
        <div className="border-2 border-[#71D285] rounded-3xl p-6 w-full max-w-3xl min-h-[300px]">
          {paginatedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-400 mt-16">
              {searchQuery ? (
                <p>No notes match the tag &ldquo;{searchQuery}&rdquo;</p>
              ) : (
                <>
                  <p className="mb-4">No notes yet for this subject.</p>
                  <button onClick={addNote} className="text-[#71D285] font-semibold hover:underline">
                    Create your first note
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {paginatedNotes.map((note, idx) => {
                const noteNumber = notes.findIndex((n) => n.notes_id === note.notes_id) + 1
                return (
                  <div
                    key={note.notes_id}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      router.push(
                        `/main/notes/notes_with_content/editor?note_id=${note.notes_id}`
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        router.push(
                          `/main/notes/notes_with_content/editor?note_id=${note.notes_id}`
                        )
                    }}
                    className="flex flex-col py-4 px-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#3E6E48]">Page {noteNumber}</h3>
                      <div className="flex items-center gap-3">
                        <p className="text-gray-500 text-sm">
                          {formatDateDisplay(note.date_created || note.updated_at)}
                        </p>
                        <button
                          onClick={(e) => deleteNote(note.notes_id, e)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete note"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8f8ec] text-[#3E6E48] text-xs font-medium"
                          >
                            <Tag size={10} />
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="h-20" />
      {totalPages > 1 && (
        <div className="fixed left-0 right-0 bottom-0 flex justify-center z-50 pointer-events-none">
          <div className="w-full flex justify-center pointer-events-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <NotesContent />
    </Suspense>
  )
}
