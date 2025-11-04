import { Database } from "lucide-react";
import { useState } from "react";
import EditModal from "./edit-modal";
import DeleteModal from "./delete-modal";

interface Subject {
  id: string;
  title: string;
  startTime: string;
  startMinutes: string;
  startPeriod: "AM" | "PM";
  endTime: string;
  endMinutes: string;
  endPeriod: "AM" | "PM";
}

interface SubjectsTableProps {
  subjects: Subject[];
  onEdit: (updatedSubject: Subject) => void;
  onDelete: (id: string) => void;
}

export default function SubjectsTable({
  subjects,
  onEdit,
  onDelete,
}: SubjectsTableProps) {
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEditClick = (subject: Subject) => {
    setEditingSubject(subject);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="border-2 border-[#71D285] rounded-3xl p-6 shadow-[10px_10px_30px_rgba(113,210,133,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#8E8B8B]">
            Current Subjects
          </h2>
        </div>

        <div className="border-t-2 border-b-2 border-[#71D285] pt-4 pb-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="text-[#8E8B8B] font-semibold">Course Name</div>
            <div className="text-[#8E8B8B] font-semibold">Time block</div>
            <div className="text-[#8E8B8B] font-semibold">Actions</div>
          </div>
        </div>

        <div className="space-y-4">
          {subjects.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No subjects added yet. Add one using the form on the right.
            </div>
          ) : (
            subjects.map((subject) => (
              <div
                key={subject.id}
                className="border-b border-gray-200 pb-4 text-center"
              >
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-3 pl-20">
                    <Database className="w-6 h-6 fill-[#71D285] stroke-white" />
                    <span className="text-gray-900 font-medium ">
                      {subject.title}
                    </span>
                  </div>
                  <div className="text-gray-700">
                    {subject.startTime}:{subject.startMinutes}{" "}
                    {subject.startPeriod} – {subject.endTime}:
                    {subject.endMinutes} {subject.endPeriod}
                  </div>
                  <div className="flex gap-3 items-center justify-center">
                    <button
                      onClick={() => handleEditClick(subject)}
                      className="p-2 text-[#71D285] hover:bg-[#71D285] hover:text-white rounded-lg transition"
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(subject.id)}
                      className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {editingSubject && (
        <EditModal
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
          onSave={(updatedSubject) => {
            onEdit(updatedSubject);
            setEditingSubject(null);
          }}
        />
      )}

      {deletingId && (
        <DeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </>
  );
}