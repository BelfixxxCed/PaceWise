"use client"

import React, { useState } from "react"
import { Zap } from "lucide-react"
import { Create_Questions } from "@/cards_algorithm/first_instance/create_questions"
import { useRouter } from "next/navigation"

export default function GenerateTestButton({
  subjectId,
  subjectTitle,
}: {
  subjectId: string
  subjectTitle?: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    try {
      setLoading(true)
      console.log("Calling Create_Questions for subject:", subjectId)
      await Create_Questions(subjectId)
      const itemsJson = sessionStorage.getItem("new_generate_quiz_items")
      const items = itemsJson ? JSON.parse(itemsJson) : null
      console.log("Generated quiz items (sessionStorage):", items)

      // Decide route id: prefer human-readable subjectTitle (e.g. "cmsc 128"), fall back to subjectId
      const routeId = subjectTitle && subjectTitle.length > 0 ? subjectTitle : subjectId
      // Navigate to the quiz page for this subject
      router.push(`/main/practice_test/quiz/${encodeURIComponent(routeId)}`)
    } catch (err) {
      console.error("Failed to generate test:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      className="flex bg-[#71D285] gap-2 px-4 py-2 rounded-full text-white font-medium hover:bg-[#5eae6e] transition-colors items-center"
      disabled={loading}
    >
      <Zap size={18} />
      <span>{loading ? "generating..." : "generate test"}</span>
    </button>
  )
}
