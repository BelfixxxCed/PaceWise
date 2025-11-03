"use client"

interface SuccessModalProps {
  onClose: () => void
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-md w-full mx-4">
        <div className="bg-[#71D285] h-24"></div>
        <div className="p-8 text-center">
          <h2 className="text-3xl font-bold text-[#2d5a3d] mb-6">Added Successfully</h2>
          <p className="text-gray-500 text-lg mb-8">
            Your subject has been added successfully. Check the table for details.
          </p>
          <button
            onClick={onClose}
            className="bg-[#71D285] text-white font-bold py-3 px-12 rounded-full hover:bg-[#5fb870] transition"
          >
            okay
          </button>
        </div>
      </div>
    </div>
  )
}
