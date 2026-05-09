"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Layers } from "lucide-react"
import MyEditorPage from "@/components/editor_components/editor"
import { DisplaySubjectName } from "@/components/editor_components/displaySubjectName"
import supabase from "@/supabase/supabase_client"
import ExternalLookupPanel from "@/components/editor_components/external_lookup"
import CreateFlashcardModal from "@/components/editor_components/create_flashcard_modal"
import TagsPanel from "@/components/editor_components/tags_panel"
import { Tag } from "lucide-react"

function EditorContent() {
  const search = useSearchParams()
  const router = useRouter()
  const noteId = search?.get("note_id") ?? ""

  const [subjectId, setSubjectId] = useState<string | null>(null)
  const [isLookupOpen, setIsLookupOpen] = useState(false)
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false)
  const [isTagsOpen, setIsTagsOpen] = useState(false)

  useEffect(() => {
    if (!noteId) return
    const fetchSubjectId = async () => {
      const { data } = await supabase
        .from("notes_pages")
        .select("subject_id")
        .eq("notes_id", noteId)
        .single()
      if (data?.subject_id) setSubjectId(data.subject_id)
    }
    fetchSubjectId()
  }, [noteId])

  if (!noteId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-gray-500">No note selected.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg bg-[#71D285] text-white hover:bg-[#5eae6e] transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 flex gap-6">
      {/* Main editor area */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsTagsOpen(!isTagsOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                isTagsOpen
                  ? "bg-[#3E6E48] text-white"
                  : "bg-[#e8f8ec] text-[#3E6E48] hover:bg-[#d0f0d8]"
              }`}
            >
              <Tag size={16} />
              Tags
            </button>
            <button
              onClick={() => setIsFlashcardOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#e8f8ec] text-[#3E6E48] rounded-lg hover:bg-[#d0f0d8] transition-colors font-medium text-sm"
            >
              <Layers size={16} />
              Create Flashcard
            </button>
            <button
              onClick={() => setIsLookupOpen(!isLookupOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                isLookupOpen
                  ? "bg-[#3E6E48] text-white"
                  : "bg-[#e8f8ec] text-[#3E6E48] hover:bg-[#d0f0d8]"
              }`}
            >
              <BookOpen size={16} />
              Lookup
            </button>
          </div>
        </div>

        {/* Subject name */}
        <div className="mb-6">
          {subjectId ? (
            <DisplaySubjectName subject_id={subjectId} />
          ) : (
            <div className="h-10" />
          )}
        </div>

        {/* Tags panel (inline, above editor) */}
        {isTagsOpen && (
          <div className="mb-4">
            <TagsPanel noteId={noteId} onClose={() => setIsTagsOpen(false)} />
          </div>
        )}

        {/* Editor */}
        <div className="border-2 border-[#71D285] rounded-3xl p-4">
          <MyEditorPage noteId={noteId} />
        </div>
      </div>

      {/* Lookup side panel */}
      {isLookupOpen && (
        <div className="w-80 shrink-0 self-start sticky top-8 rounded-2xl shadow-xl border border-gray-200 overflow-hidden bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
          <ExternalLookupPanel onClose={() => setIsLookupOpen(false)} />
        </div>
      )}

      {/* Flashcard modal */}
      {isFlashcardOpen && subjectId && (
        <CreateFlashcardModal
          subjectId={subjectId}
          onClose={() => setIsFlashcardOpen(false)}
        />
      )}
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <EditorContent />
    </Suspense>
  )
}
