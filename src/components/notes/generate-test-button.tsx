"use client"

import React, { useState } from "react"
import { Zap } from "lucide-react"
import { Create_Questions } from "@/cards_algorithm/first_instance/create_questions"
// supabase not needed here; QuizSection will start the quiz server-side
import { useRouter } from "next/navigation"

export default function GenerateTestButton({ subjectId }: { subjectId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    try {
      setLoading(true)
      console.log("Calling Create_Questions for subject:", subjectId)
      // Try to get generated items directly from Create_Questions return value (fallback to sessionStorage)
      const generated = await Create_Questions(subjectId)
      let items = generated ?? null
      if (!items) {
        const itemsJson = typeof window !== "undefined" ? sessionStorage.getItem("new_generate_quiz_items") : null
        items = itemsJson ? JSON.parse(itemsJson) : null
      }
      console.log("Generated quiz items:", items)

      if (!items || (Array.isArray(items) && (items as unknown[]).length === 0)) {
        console.error("No quiz items to save")
        return
      }

      // Navigate to the quiz page for this subject — the page will call the
      // start API and create the quiz server-side (avoids duplicate quiz rows).
      router.push(`/main/practice_test/quiz/${encodeURIComponent(subjectId)}`)
    } catch (err) {
      console.error("Failed to generate test:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      className={`flex gap-2 px-4 py-2 rounded-full text-white font-medium transition-colors items-center ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#71D285] hover:bg-[#5eae6e]"
      }`}
      disabled={loading}
    >
      <Zap size={18} />
      <span>{loading ? "generating..." : "generate test"}</span>
    </button>
  )
}
