"use client"

// QUIZ FEATURE DISABLED
/*
import React, { useState } from "react"
import { Zap } from "lucide-react"
import { Create_Questions } from "@/cards_algorithm/first_instance/create_questions"
import { useRouter } from "next/navigation"

export default function GenerateTestButton({ subjectId }: { subjectId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    setLoading(true)
    const generated = await Create_Questions(subjectId)
    let items = generated ?? null
    if (!items) {
      const itemsJson = typeof window !== "undefined" ? sessionStorage.getItem("new_generate_quiz_items") : null
      items = itemsJson ? JSON.parse(itemsJson) : null
    }
    if (!items || (Array.isArray(items) && (items as unknown[]).length === 0)) return
    router.push(`/main/practice_test/quiz/${encodeURIComponent(subjectId)}`)
    setLoading(false)
  }

  return (
    <button onClick={handleGenerate} disabled={loading}
      className={`flex gap-2 px-4 py-2 rounded-full text-white font-medium transition-colors items-center ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#71D285] hover:bg-[#5eae6e]"
      }`}
    >
      <Zap size={18} />
      <span>{loading ? "generating..." : "generate test"}</span>
    </button>
  )
}
*/

export default function GenerateTestButton(_props: { subjectId: string }) {
  return null;
}
