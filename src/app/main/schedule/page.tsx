"use client";

import { useState, useEffect } from "react";
import SubjectsTable from "@/components/schedule/subjects-table";
import AddSubjectForm from "@/components/schedule/add-subject-form";
import SuccessModal from "@/components/schedule/success-modal";
import LoadingModal from "@/components/loading_modal";
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

export default function Page() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get current user and fetch subjects
  useEffect(() => {
    async function initializeData() {
      try {
        // Get current user
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

        // Fetch subjects using the query function
        const data = await getAllSubjects(user.id);
        const transformedSubjects = data.map((subject) =>
          transformSubjectFromDB(subject)
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
  }, []);

  // Add new subject
  const handleAddSubject = async (newSubject: Omit<Subject, "id">) => {
    if (!userId) {
      setError("You must be signed in to add subjects");
      return;
    }

    try {
      // Transform and create subject
      const subjectData = transformSubjectToDB(newSubject, userId);
      const createdSubject = await createSubject(subjectData);

      // Add to local state
      const transformedSubject = transformSubjectFromDB(createdSubject);
      setSubjects([transformedSubject, ...subjects]);

      setShowSuccessModal(true);
      setError(null);
    } catch (err) {
      console.error("Error adding subject:", err);
      setError(err instanceof Error ? err.message : "Failed to add subject");
    }
  };

  // Edit subject
  const handleEditSubject = async (updatedSubject: Subject) => {
    try {
      // Prepare update data
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

      // Update local state
      setSubjects(
        subjects.map((s) => (s.id === updatedSubject.id ? updatedSubject : s))
      );
      setError(null);
    } catch (err) {
      console.error("Error updating subject:", err);
      setError(err instanceof Error ? err.message : "Failed to update subject");
    }
  };

  // Delete subject
  const handleDeleteSubject = async (id: string) => {
    try {
      await deleteSubject(id);

      // Update local state
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

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter((subject) =>
    subject.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#71D285] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your subjects...</p>
        </div>
      </div>
    );
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
              subjects={filteredSubjects}
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
    </div>
  );
}