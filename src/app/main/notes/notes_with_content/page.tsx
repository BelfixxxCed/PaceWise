<<<<<<< HEAD
import React from "react";
import Notes_component from "./../../../../components/editor_components/editor";
import { DisplaySubjectName } from "@/components/editor_components/displaySubjectName";
import GenerateTestButton from "@/components/notes/generate-test-button";
=======
"use client"
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Zap, Plus, ArrowLeft } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"

interface Note {
  id: string
  title: string
  date_created: string
}

export default function Page() {
  const router = useRouter()

  const [notes, setNotes] = useState<Note[]>([
    { id: "1", title: "Mgt 101", date_created: "2025-10-31T00:00:00.000Z" },
    { id: "2", title: "Mgt 101", date_created: "2025-10-31T00:00:00.000Z" },
    { id: "3", title: "Mgt 101", date_created: "2025-10-31T00:00:00.000Z" },
    { id: "4", title: "Mgt 101", date_created: "2025-10-31T00:00:00.000Z" },
    { id: "5", title: "Mgt 101", date_created: "2025-10-31T00:00:00.000Z" },
  ])

  // initialize page counter based on existing notes that match "Page N"
  const initialPageCount = notes.filter((n) => /^Page \d+$/.test(n.title)).length
  const [pageCounter, setPageCounter] = useState<number>(initialPageCount + 1)

  const addNote = () => {
    const newNote: Note = {
      id: String(Date.now()),
      title: `Page ${pageCounter}`,
      date_created: new Date().toISOString(),
    }
    setNotes((prev) => [newNote, ...prev])
    setPageCounter((p) => p + 1)
  }
  

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5
  const totalPages = Math.max(1, Math.ceil(notes.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedNotes = notes.slice(startIndex, endIndex)

  const formatDateDisplay = (date: string): string => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const goBack = () => {
    router.back()
  }

  return (
<<<<<<< HEAD
    <div className="m-2 border-2 p-5 rounded-4xl my-5 mx-35 border-[#71D285]">
      <div className="flex items-center justify-between mb-4">
        <DisplaySubjectName subject_id={subjectId} />
        <GenerateTestButton subjectId={subjectId} />
      </div>
      <div>
        <Notes_component subjectId={subjectId} />
=======
    <div className="min-h-screen ml-0 md:ml-0">
      <div className="px-8 py-12">
        <div className="max-w-[750px] mx-auto flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Go back">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-[#3E6E48]">Mgt 101</h1> 
          </div>

          {/* Action buttons aligned to the right */}
          <div className="flex gap-3">
            <button className="flex bg-[#71D285] gap-2 px-6 py-2 rounded-full text-white font-medium hover:bg-[#5eae6e] transition-colors items-center">
              <Zap size={18} />
              <span>generate test</span>
            </button>
            <button onClick={addNote} className="flex bg-[#71D285] gap-2 px-6 py-2 rounded-full text-white font-medium hover:bg-[#5eae6e] transition-colors items-center">
              <Plus size={18} />
              <span>add notes</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 flex justify-center">
        <div className="border-2 border-[#71D285] rounded-3xl p-6 w-full max-w-3xl">
          <div className="space-y-0">
            {paginatedNotes.map((note) => {
              return (
                <div
                  key={note.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/main/notes/notes_with_content/editor?note_id=${note.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        router.push(`/main/notes/notes_with_content/editor?note_id=${note.id}`)
                    }}
                  className="flex items-center justify-between py-4 px-2 border-b border-gray-200 last:border-b-0 transition-colors cursor-pointer hover:bg-gray-50"
                >
                  <h3 className="text-lg font-semibold text-[#3E6E48] flex-shrink-0">{note.title}</h3>
                  <div className="flex-1 flex justify-center">
                    <p className="text-gray-600 text-sm whitespace-nowrap">
                      Date Created: {formatDateDisplay(note.date_created)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNote(note.id)
                    }}
                    className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Delete note"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="h-20" />

      <div className="fixed left-0 right-0 bottom-0 flex justify-center z-50 pointer-events-none">
        <div className="w-full flex justify-center pointer-events-auto">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
>>>>>>> ce41712 (feat: implemented the revised notes page with editor functionality (#87))
      </div>
    </div>
  )
}
