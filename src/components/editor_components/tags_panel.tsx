"use client";

import { useState, useEffect } from "react";
import { X, Tag, Plus, Trash2 } from "lucide-react";
import supabase from "@/supabase/supabase_client";

interface TagItem {
  id: string;
  name: string;
}

type TagLink = {
  tags?: TagItem | TagItem[] | null;
};

interface Props {
  noteId: string;
  onClose: () => void;
}

export default function TagsPanel({ noteId, onClose }: Props) {
  const [userTags, setUserTags] = useState<TagItem[]>([]);
  const [noteTags, setNoteTags] = useState<TagItem[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user's tags and this note's tags
  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: allTags }, { data: noteTagLinks }] = await Promise.all([
        supabase.from("tags").select("id, name").eq("user_id", user.id),
        supabase
          .from("tags-notes")
          .select("tag_id, tags(id, name)")
          .eq("notes_id", noteId),
      ]);

      setUserTags(allTags ?? []);

      const attached: TagItem[] = (noteTagLinks ?? []).flatMap((tl) => {
        const tags = (tl as TagLink).tags;
        if (!tags) return [];
        return Array.isArray(tags) ? tags : [tags];
      });
      setNoteTags(attached);
      setLoading(false);
    };
    fetch();
  }, [noteId]);

  const isAttached = (tagId: string) => noteTags.some((t) => t.id === tagId);

  const toggleTag = async (tag: TagItem) => {
    if (isAttached(tag.id)) {
      // Detach
      await supabase
        .from("tags-notes")
        .delete()
        .eq("tag_id", tag.id)
        .eq("notes_id", noteId);
      setNoteTags((prev) => prev.filter((t) => t.id !== tag.id));
    } else {
      // Attach
      const { error } = await supabase
        .from("tags-notes")
        .insert([{ tag_id: tag.id, notes_id: noteId }]);
      if (!error) {
        setNoteTags((prev) => [...prev, tag]);
      }
    }
  };

  const createAndAttach = async () => {
    const name = newTagName.trim();
    if (!name) return;

    // If a tag with the same name already exists, show an error warning
    const existing = userTags.find((t) => t.name.toLowerCase() === name.toLowerCase())
    if (existing) {
      setErrorMsg(`Tag "${existing.name}" already exists.`);
      return
    }

    setErrorMsg("")

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: created, error } = await supabase
      .from("tags")
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (error || !created) return;

    // Attach to note
    await supabase
      .from("tags-notes")
      .insert([{ tag_id: created.id, notes_id: noteId }]);

    setUserTags((prev) => [...prev, created]);
    setNoteTags((prev) => [...prev, created]);
    setNewTagName("");
  };

  const deleteTag = async (tag: TagItem, e: React.MouseEvent) => {
    e.stopPropagation()
    await supabase.from("tags-notes").delete().eq("tag_id", tag.id)
    await supabase.from("tags").delete().eq("id", tag.id)
    setUserTags((prev) => prev.filter((t) => t.id !== tag.id))
    setNoteTags((prev) => prev.filter((t) => t.id !== tag.id))
  }

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#e8f8ec] border-b border-gray-100">
        <div className="flex items-center gap-2 text-[#3E6E48] font-semibold text-sm">
          <Tag size={16} />
          Note Tags
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#d0f0d8] rounded-lg transition-colors"
        >
          <X size={14} className="text-[#3E6E48]" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Current tags */}
        {noteTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {noteTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag)}
                title="Click to remove"
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#71D285] text-white text-xs font-medium hover:bg-[#5eae6e] transition-colors"
              >
                <Tag size={10} />
                {tag.name}
                <X size={10} className="ml-0.5" />
              </button>
            ))}
          </div>
        )}

        {/* Create new tag */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => {
                setNewTagName(e.target.value)
                setErrorMsg("")
              }}
              onKeyDown={(e) => e.key === "Enter" && createAndAttach()}
              placeholder="New tag name..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#71D285]"
            />
            <button
              onClick={createAndAttach}
              className="px-3 py-2 bg-[#71D285] text-white rounded-lg hover:bg-[#5eae6e] transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          {errorMsg && (
            <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
          )}
        </div>

        {/* All user tags to toggle */}
        {!loading && userTags.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
              Your Tags
            </p>
            <div className="flex flex-wrap gap-1">
              {userTags.map((tag) => (
                <div key={tag.id} className="group relative inline-flex items-center">
                  <button
                    onClick={() => toggleTag(tag)}
                    className={`flex items-center gap-1 pl-3 pr-6 py-1 rounded-full text-xs font-medium border transition-colors ${
                      isAttached(tag.id)
                        ? "bg-[#71D285] text-white border-[#71D285]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#71D285] hover:text-[#3E6E48]"
                    }`}
                  >
                    <Tag size={10} />
                    {tag.name}
                  </button>
                  <button
                    onClick={(e) => deleteTag(tag, e)}
                    title="Delete tag"
                    className="absolute right-1.5 opacity-60 hover:opacity-100 transition-opacity rounded-full hover:text-red-500 text-gray-400"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && <p className="text-sm text-gray-400">Loading tags...</p>}
      </div>
    </div>
  );
}
