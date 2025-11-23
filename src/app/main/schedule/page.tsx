"use client";

// import { Metadata } from "next";
import { useState, useEffect } from "react";
import SubjectsTable from "@/components/schedule/subjects-table";
import AddSubjectForm from "@/components/schedule/add-subject-form";
import SuccessModal from "@/components/schedule/success-modal";
import { Pagination } from "@/components/ui/pagination";
import { Search } from "lucide-react";

// export const metadata: Metadata = {
//   title: "Study Schedule",
//   icons: {
//     icon: "/favicon.ico",
//   },
//   description: "Manage your study schedule effectively",
// };

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

const initialCourses: Subject[] = [
  {
    id: "1",
    title: "Amat 132",
    startTime: "01",
    startMinutes: "00",
    startPeriod: "PM",
    endTime: "02",
    endMinutes: "00",
    endPeriod: "PM",
  },
  {
    id: "2",
    title: "Amat 132",
    startTime: "01",
    startMinutes: "00",
    startPeriod: "PM",
    endTime: "02",
    endMinutes: "00",
    endPeriod: "PM",
  },
  {
    id: "3",
    title: "Amat 132",
    startTime: "01",
    startMinutes: "00",
    startPeriod: "PM",
    endTime: "02",
    endMinutes: "00",
    endPeriod: "PM",
  },
  {
    id: "4",
    title: "Amat 132",
    startTime: "01",
    startMinutes: "00",
    startPeriod: "PM",
    endTime: "02",
    endMinutes: "00",
    endPeriod: "PM",
  },
  {
    id: "5",
    title: "Amat 132",
    startTime: "01",
    startMinutes: "00",
    startPeriod: "PM",
    endTime: "02",
    endMinutes: "00",
    endPeriod: "PM",
  },
  {
    id: "6",
    title: "Amat 132",
    startTime: "01",
    startMinutes: "00",
    startPeriod: "PM",
    endTime: "02",
    endMinutes: "00",
    endPeriod: "PM",
  },
  {
    id: "7",
    title: "Amat 132",
    startTime: "01",
    startMinutes: "00",
    startPeriod: "PM",
    endTime: "02",
    endMinutes: "00",
    endPeriod: "PM",
  },
];

const ITEMS_PER_PAGE = 5;

export default function Page() {
  const [subjects, setSubjects] = useState<Subject[]>(initialCourses);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddSubject = (newSubject: Omit<Subject, "id">) => {
    const subject: Subject = {
      ...newSubject,
      id: Date.now().toString(),
    };
    setSubjects([...subjects, subject]);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleEditSubject = (updatedSubject: Subject) => {
    setSubjects(
      subjects.map((s) => (s.id === updatedSubject.id ? updatedSubject : s))
    );
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  
  const totalPages = Math.ceil(subjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubjects = subjects.slice(startIndex, endIndex);

  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <div>
      <div className="flex-1 overflow-auto p-8">
        <div className="gap-8 flex flex-row">
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex w-full px-6 py-3 rounded-full border-2 border-[#71D285] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#71D285]">
                <Search className="w-5 h-5 ml-3 mt-3 text-gray-400 justify-center" />
                <input
                  type="text"
                  placeholder="Search"
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}
