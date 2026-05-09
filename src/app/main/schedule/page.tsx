"use client";

import { useState, useEffect } from "react";
import SubjectsTable from "@/components/schedule/subjects-table";
import AddSubjectForm from "@/components/schedule/add-subject-form";
import SuccessModal from "@/components/schedule/success-modal";
import LoadingModal from "@/components/loading_modal";
import { Pagination } from "@/components/ui/pagination";
import { Search } from "lucide-react";
import supabase from "@/supabase/supabase_client";
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  transformSubjectFromDB,
  transformSubjectToDB,
} from "@/components/schedule/schedule_supabase_query";

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

const ITEMS_PER_PAGE = 4;

export default function Page() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Get current user and fetch subjects
  useEffect(() => {
    async function initializeData() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          setError("Please sign in to view your subjects");
          setLoading(false);
          return;
        }

        setUserId(user.id);

        const data = await getAllSubjects(user.id);
        const transformedSubjects = data.map((subject) =>
          transformSubjectFromDB(subject),
        );
        setSubjects(transformedSubjects);
      } catch (err) {
        console.error("Error initializing:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    initializeData();

    // Listen for subject creations from other pages (notes page)
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("subjects");
      channel.onmessage = (ev) => {
        const msg = ev.data;
        if (msg?.type === "created") {
          // re-run initialization to refresh list
          initializeData();
        }
      };
    } catch {
      // ignore if BroadcastChannel not supported
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  const handleAddSubject = async (newSubject: Omit<Subject, "id">) => {
    if (!userId) {
      setError("You must be signed in to add subjects");
      return;
    }

    try {
      const subjectData = transformSubjectToDB(newSubject, userId);
      const createdSubject = await createSubject(subjectData);
      const transformedSubject = transformSubjectFromDB(createdSubject);
      setSubjects([transformedSubject, ...subjects]);
      setShowSuccessModal(true);
      setError(null);
    } catch (err) {
      console.error("Error adding subject:", err);
      setError(err instanceof Error ? err.message : "Failed to add subject");
    }
  };

  const handleEditSubject = async (updatedSubject: Subject) => {
    try {
      const updates = {
        subject_name: updatedSubject.title,
        start_time: updatedSubject.startTime,
        start_minutes: updatedSubject.startMinutes,
        start_period: updatedSubject.startPeriod,
        end_time: updatedSubject.endTime,
        end_minutes: updatedSubject.endMinutes,
        end_period: updatedSubject.endPeriod,
      };

      await updateSubject(updatedSubject.id, updates);
      setSubjects(
        subjects.map((s) => (s.id === updatedSubject.id ? updatedSubject : s)),
      );
      setError(null);
    } catch (err) {
      console.error("Error updating subject:", err);
      setError(err instanceof Error ? err.message : "Failed to update subject");
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      await deleteSubject(id);
      setSubjects(subjects.filter((s) => s.id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting subject:", err);
      setError(err instanceof Error ? err.message : "Failed to delete subject");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubjects = filteredSubjects.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  if (loading) {
    return <LoadingModal message="Loading your subjects..." />;
  }

  return (
    <div>
      <div className="flex-1 overflow-auto p-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="gap-8 flex flex-row">
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex w-full px-6 py-3 rounded-full border-2 border-[#71D285] text-gray-700 placeholder-gray-400 focus-within:ring-2 focus-within:ring-[#71D285]">
                <Search className="w-5 h-5 ml-3 mt-3 text-gray-400 justify-center" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-5 pr-4 py-2 rounded-full focus:outline-none"
                />
              </div>
            </div>
            <SubjectsTable
              subjects={paginatedSubjects}
              onEdit={handleEditSubject}
              onDelete={handleDeleteSubject}
            />
          </div>
          <div className="w-80 mt-22">
            <AddSubjectForm onAddSubject={handleAddSubject} />
          </div>
        </div>
      </div>
      {showSuccessModal && <SuccessModal onClose={handleCloseModal} />}

      <div className="h-20" />

      <div className="fixed left-0 right-0 bottom-0 flex justify-center z-50 pointer-events-none">
        <div className="mx-8 w-full flex justify-center pointer-events-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
