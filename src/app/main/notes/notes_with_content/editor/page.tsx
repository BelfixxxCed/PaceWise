"use client"

import React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import MyEditorPage from "@/components/editor_components/editor"
import { DisplaySubjectName } from "@/components/editor_components/displaySubjectName"

export default function Page() {
  const search = useSearchParams()
  const router = useRouter()
  const subjectId = search?.get("subject_id") ?? search?.get("note_id") ?? ""

  // If no id provided, navigate back to notes list
  if (!subjectId) {
    // show a simple fallback UI and a back button
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg">No note selected.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded bg-[#71D285] text-white"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div />
        </div>
        <div className="mb-6">
          <DisplaySubjectName subject_id={subjectId} />
        </div>

        <div className="border-2 border-[#71D285] rounded-3xl p-4">
          <MyEditorPage subjectId={subjectId} />
        </div>
      </div>
    </div>
  )
}
