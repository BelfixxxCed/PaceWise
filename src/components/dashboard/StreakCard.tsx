"use client"

import { useEffect, useState } from "react"
import { Flame } from "lucide-react"
import supabase from "@/supabase/supabase_client"

export function StreakCard() {
  const [streak, setStreak] = useState<number | null>(null)
  const [lastActive, setLastActive] = useState<string | null>(null)

  useEffect(() => {
    const fetchStreak = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("users")
        .select("streak, last_active_date")
        .eq("user_id", user.id)
        .single()

      if (data) {
        setStreak(data.streak ?? 0)
        setLastActive(data.last_active_date ?? null)
      }
    }
    fetchStreak()
  }, [])

  const formatLastActive = (dateStr: string | null): string => {
    if (!dateStr) return "Never"
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    return `${diffDays} days ago`
  }

  const isActiveToday = (): boolean => {
    if (!lastActive) return false
    const d = new Date(lastActive)
    const now = new Date()
    return (
      d.getUTCFullYear() === now.getUTCFullYear() &&
      d.getUTCMonth() === now.getUTCMonth() &&
      d.getUTCDate() === now.getUTCDate()
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-4xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`p-2 rounded-xl ${
            isActiveToday() ? "bg-orange-100" : "bg-gray-100"
          }`}
        >
          <Flame
            size={22}
            className={isActiveToday() ? "text-orange-500" : "text-gray-400"}
          />
        </div>
        <h3 className="font-semibold text-gray-800 text-base">Study Streak</h3>
      </div>

      <div className="flex items-end gap-2">
        <span
          className={`text-5xl font-bold ${
            isActiveToday() ? "text-orange-500" : "text-gray-300"
          }`}
        >
          {streak ?? "—"}
        </span>
        <span className="text-gray-500 mb-2 text-sm">
          {streak === 1 ? "day" : "days"}
        </span>
      </div>

      <p className="text-sm text-gray-400 mt-2">
        Last active: {formatLastActive(lastActive)}
      </p>

      {!isActiveToday() && streak !== null && streak > 0 && (
        <p className="text-xs text-orange-400 mt-1 font-medium">
          ⚠ Study today to keep your streak!
        </p>
      )}

      {isActiveToday() && (
        <p className="text-xs text-green-500 mt-1 font-medium">
          ✓ You studied today!
        </p>
      )}
    </div>
  )
}
