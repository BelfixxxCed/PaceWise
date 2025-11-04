"use client"

interface DeleteModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteModal({ onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-xl shadow-lg">
        {/* Header */}
        <div className="bg-[#FF4444] px-8 py-6">
          <h2 className="text-3xl font-bold text-white">Are You Sure?</h2>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          <p className="text-center text-gray-600 text-lg">
            This action will <span className="font-bold">permanently delete</span> your course and all its data. This
            cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onConfirm}
              className="px-12 py-3 bg-[#FF4444] text-white font-semibold rounded-full hover:bg-[#dd3333] transition"
            >
              proceed
            </button>
            <button
              onClick={onCancel}
              className="px-12 py-3 bg-[#71D285] text-white font-semibold rounded-full hover:bg-[#5fb870] transition"
            >
              back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}