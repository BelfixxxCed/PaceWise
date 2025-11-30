"use client"

import type React from "react"

import { useState } from "react"

interface AddSubjectFormProps {
  onAddSubject: (subject: {
    title: string
    startTime: string
    startMinutes: string
    startPeriod: "AM" | "PM"
    endTime: string
    endMinutes: string
    endPeriod: "AM" | "PM"
  }) => void
}

export default function AddSubjectForm({ onAddSubject }: AddSubjectFormProps) {
  const [title, setTitle] = useState("")
  const [startTime, setStartTime] = useState("")
  const [startMinutes, setStartMinutes] = useState("")
  const [startPeriod, setStartPeriod] = useState<"AM" | "PM">("AM")
  const [endTime, setEndTime] = useState("")
  const [endMinutes, setEndMinutes] = useState("")
  const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("AM")
  const [errors, setErrors] = useState<string[]>([])

  const validateHours = (value: string) => {
    if (!value) return true
    const num = Number.parseInt(value, 10)
    return num >= 1 && num <= 12
  }

  const validateMinutes = (value: string) => {
    if (!value) return true
    const num = Number.parseInt(value, 10)
    return num >= 0 && num <= 60
  }

  const handleHourChange = (value: string, setter: (val: string) => void) => {
    const numValue = value.replace(/\D/g, "").slice(0, 2)
    if (numValue === "" || validateHours(numValue)) {
      setter(numValue)
    }
  }

  const handleMinutesChange = (value: string, setter: (val: string) => void) => {
    const numValue = value.replace(/\D/g, "").slice(0, 2)
    if (numValue === "" || validateMinutes(numValue)) {
      setter(numValue)
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []
    if (!title.trim()) newErrors.push("Title is required")
    if (!startTime) newErrors.push("Start hour is required")
    if (!startMinutes) newErrors.push("Start minutes are required")
    if (!endTime) newErrors.push("End hour is required")
    if (!endMinutes) newErrors.push("End minutes are required")
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onAddSubject({
        title,
        startTime: startTime.padStart(2, "0"),
        startMinutes: startMinutes.padStart(2, "0"),
        startPeriod,
        endTime: endTime.padStart(2, "0"),
        endMinutes: endMinutes.padStart(2, "0"),
        endPeriod,
      })
      // Reset form
      setTitle("")
      setStartTime("")
      setStartMinutes("")
      setStartPeriod("AM")
      setEndTime("")
      setEndMinutes("")
      setEndPeriod("AM")
      setErrors([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-[#71D285] rounded-3xl p-6">
      <div className="bg-[#71D285] -mx-6 -mt-6 px-6 py-4 rounded-t-2xl mb-6 text-center">
        <h2 className="text-xl font-bold text-white">Add Subject</h2>
      </div>

      <div className="space-y-6 text-center">
        <div>
          <input
            type="text"
            placeholder="Enter title here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-full border-2 border-[#71D285] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#71D285]"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-3">from</label>
          <div className="flex items-center gap-2 justify-center">
            <input
              type="text"
              placeholder="00"
              value={startTime}
              onChange={(e) => handleHourChange(e.target.value, setStartTime)}
              maxLength={2}
              className="w-12 px-2 py-2 border-2 border-[#71D285] rounded text-center focus:outline-none focus:ring-2 focus:ring-[#71D285]"
            />
            <span className="text-gray-600">:</span>
            <input
              type="text"
              placeholder="00"
              value={startMinutes}
              onChange={(e) => handleMinutesChange(e.target.value, setStartMinutes)}
              maxLength={2}
              className="w-12 px-2 py-2 border-2 border-[#71D285] rounded text-center focus:outline-none focus:ring-2 focus:ring-[#71D285]"
            />
            <div className="flex gap-1 ml-2">
              <button
                type="button"
                onClick={() => setStartPeriod("AM")}
                className={`px-3 py-2 rounded font-medium transition ${
                  startPeriod === "AM" ? "bg-[#71D285] text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setStartPeriod("PM")}
                className={`px-3 py-2 rounded font-medium transition ${
                  startPeriod === "PM" ? "bg-[#71D285] text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                PM
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-3">to</label>
          <div className="flex items-center gap-2 justify-center">
            <input
              type="text"
              placeholder="00"
              value={endTime}
              onChange={(e) => handleHourChange(e.target.value, setEndTime)}
              maxLength={2}
              className="w-12 px-2 py-2 border-2 border-[#71D285] rounded text-center focus:outline-none focus:ring-2 focus:ring-[#71D285]"
            />
            <span className="text-gray-600">:</span>
            <input
              type="text"
              placeholder="00"
              value={endMinutes}
              onChange={(e) => handleMinutesChange(e.target.value, setEndMinutes)}
              maxLength={2}
              className="w-12 px-2 py-2 border-2 border-[#71D285] rounded text-center focus:outline-none focus:ring-2 focus:ring-[#71D285]"
            />
            <div className="flex gap-1 ml-2">
              <button
                type="button"
                onClick={() => setEndPeriod("AM")}
                className={`px-3 py-2 rounded font-medium transition ${
                  endPeriod === "AM" ? "bg-[#71D285] text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setEndPeriod("PM")}
                className={`px-3 py-2 rounded font-medium transition ${
                  endPeriod === "PM" ? "bg-[#71D285] text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                PM
              </button>
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <ul className="text-red-600 text-sm space-y-1">
              {errors.map((error, question_id) => (
                <li key={question_id}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#71D285] text-white font-bold py-3 rounded-full hover:bg-[#5fb870] transition"
        >
          add
        </button>
      </div>
    </form>
  )
}
