"use client";

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Trash2, Plus, ArrowLeft, Tag, X, Edit2 } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import supabase from "@/supabase/supabase_client"

interface Note {
  notes_id: string;
  subject_id: string;
  date_created: string;
  updated_at: string;
  tags?: { id: string; name: string }[];
  title?: string;
}

type TagLink = {
  tags?: { id: string; name: string } | { id: string; name: string }[] | null;
};

function NotesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subject_id") ?? "";

  const [notes, setNotes] = useState<Note[]>([]);
  const [subjectName, setSubjectName] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Filter notes by tag search
  const pageNumberMap: Record<string, number> = Object.fromEntries(
    [...notes]
      .sort((a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime())
      .map((note, idx) => [note.notes_id, idx + 1])
  )

  const filteredNotes = searchQuery.trim()
    ? notes.filter((note) =>
        note.tags?.some((tag) =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    : notes;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotes.length / ITEMS_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!subjectId) {
      setSubjectName("Subject");
      setIsLoading(false);
      return;
    }

    const fetchSubjectName = async () => {
      try {
        const { data } = await supabase
          .from("subjects")
          .select("subject_name")
          .eq("subject_id", subjectId)
          .single();
        setSubjectName(data?.subject_name ?? "Subject");
      } catch {
        setSubjectName("Subject");
      }
    };

    const fetchNotes = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch(`/api/notes?subject_id=${subjectId}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const result = await res.json();
        if (res.ok && Array.isArray(result.data)) {
          // For each note, fetch its tags
          const notesWithTags = await Promise.all(
            result.data.map(async (note: Note) => {
              const { data: tagLinks } = await supabase
                .from("tags-notes")
                .select("tag_id, tags(id, name)")
                .eq("notes_id", note.notes_id);

              const tags = (tagLinks ?? [])
                .map((tl) => (tl as TagLink).tags)
                .filter(Boolean)
                .flat();

              return { ...note, tags };
            }),
          );
          setNotes(
            [...notesWithTags].sort(
              (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
            )
          );
        }
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjectName();
    fetchNotes();
  }, [subjectId]);

  const addNote = async () => {
    if (!subjectId) return;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          subject_id: subjectId,
          notes_json: [{ type: "p", children: [{ text: "" }] }],
        }),
      });
      const result = await res.json();
      if (res.ok && result.data) {
        router.push(
          `/main/notes/notes_with_content/editor?note_id=${result.data.notes_id}`,
        );
      }
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  const deleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`/api/notes?notes_id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.notes_id !== id));
      } else {
        console.error("Failed to delete note via API");
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const saveInlineTitle = async (id: string) => {
    setEditingTitleId(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ notes_id: id, title: tempTitle }),
      });

      if (res.ok) {
        setNotes((prev) =>
          prev.map((n) => (n.notes_id === id ? { ...n, title: tempTitle } : n))
        );
      }
    } catch (err) {
      console.error("Failed to save inline title:", err);
    }
  };

  const formatDateDisplay = (date: string): string => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-0 md:ml-0">
      {/* Header */}
      <div className="px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <h1 className="text-3xl font-bold text-[#3E6E48]">
                {subjectName}
              </h1>
            </div>

            <div className="flex gap-3">
              {/* QUIZ FEATURE DISABLED
              <button
                onClick={() => router.push(`/main/practice_test?subject_id=${subjectId}`)}
                className="flex bg-[#71D285] gap-2 px-5 py-2 rounded-full text-white font-medium hover:bg-[#5eae6e] transition-colors items-center"
              >
                <Zap size={18} />
                <span>generate test</span>
              </button>
              */}
              <button
                onClick={addNote}
                className="flex bg-[#71D285] gap-2 px-5 py-2 rounded-full text-white font-medium hover:bg-[#5eae6e] transition-colors items-center"
              >
                <Plus size={18} />
                <span>add notes</span>
              </button>
            </div>
          </div>

          {/* Tag Search Bar */}
          <div className="mt-4 relative">
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#71D285] transition">
              <Tag size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by tag..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-gray-400 mt-1 ml-4">
                {filteredNotes.length} note
                {filteredNotes.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notes list */}
      <div className="px-8 flex justify-center">
        <div className="border-2 border-[#71D285] rounded-3xl p-6 w-full max-w-3xl min-h-[300px]">
          {paginatedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-400 mt-16">
              {searchQuery ? (
                <p>No notes match the tag &ldquo;{searchQuery}&rdquo;</p>
              ) : (
                <>
                  <p className="mb-4">No notes yet for this subject.</p>
                  <button
                    onClick={addNote}
                    className="text-[#71D285] font-semibold hover:underline"
                  >
                    Create your first note
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {paginatedNotes.map((note) => {
                const noteNumber = pageNumberMap[note.notes_id] ?? 0;
                return (
                  <div
                    key={note.notes_id}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      router.push(
                        `/main/notes/notes_with_content/editor?note_id=${note.notes_id}`,
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        router.push(
                          `/main/notes/notes_with_content/editor?note_id=${note.notes_id}`,
                        );
                    }}
                    className="flex flex-col py-4 px-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      {editingTitleId === note.notes_id ? (
                        <input
                          type="text"
                          value={tempTitle}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setTempTitle(e.target.value)}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") saveInlineTitle(note.notes_id);
                            if (e.key === "Escape") setEditingTitleId(null);
                          }}
                          onBlur={() => saveInlineTitle(note.notes_id)}
                          className="text-lg font-semibold text-[#3E6E48] bg-white border-b-2 border-[#71D285] px-1 outline-none w-1/2"
                        />
                      ) : (
                        <div className="flex items-center gap-2 group/title">
                          <h3 className="text-lg font-semibold text-[#3E6E48]">
                            {note.title || `Page ${noteNumber}`}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTitleId(note.notes_id);
                              setTempTitle(note.title || `Page ${noteNumber}`);
                            }}
                            className="p-1 opacity-0 group-hover/title:opacity-100 hover:bg-gray-200 rounded transition-all"
                            aria-label="Edit title"
                          >
                            <Edit2 size={14} className="text-gray-500" />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <p className="text-gray-500 text-sm">
                          {formatDateDisplay(
                            note.date_created || note.updated_at,
                          )}
                        </p>
                        <button
                          onClick={(e) => deleteNote(note.notes_id, e)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete note"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8f8ec] text-[#3E6E48] text-xs font-medium"
                          >
                            <Tag size={10} />
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="h-20" />
      {totalPages > 1 && (
        <div className="fixed left-0 right-0 bottom-0 flex justify-center z-50 pointer-events-none">
          <div className="w-full flex justify-center pointer-events-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <NotesContent />
    </Suspense>
  );
}
