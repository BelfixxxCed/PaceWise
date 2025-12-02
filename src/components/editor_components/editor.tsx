"use client";

import { Plate, usePlateEditor } from "platejs/react";
import type { Value } from "platejs";
import { Editor, EditorContainer } from "@/components/ui/editor";
import {
  BlockquotePlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
} from "@platejs/basic-nodes/react";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { BlockquoteElement } from "@/components/ui/blockquote-node";
import { H1Element, H2Element, H3Element } from "@/components/ui/heading-node";
import { ToolbarButton } from "@/components/ui/toolbar";
import {
  parseNotesToText,
  parseNotesToHTML,
  type EditorNode,
} from "@/lib/parseNotes";
import { useEffect, useRef, useState, useCallback } from "react";
import supabase from "@/supabase/supabase_client";

const DEFAULT_VALUE: Value = [
  { children: [{ text: "Title" }], type: "h3" },
  { children: [{ text: "This is a quote." }], type: "blockquote" },
  {
    type: "p",
    children: [
      { text: "Hello! Try out the " },
      { text: "bold", bold: true },
      { text: ", " },
      { text: "italic", italic: true },
      { text: ", and " },
      { text: "underline", underline: true },
      { text: " formatting." },
    ],
  },
];

const AUTOSAVE_DELAY = 2000;

interface Props {
  subjectId: string;
}

export default function MyEditorPage({ subjectId }: Props) {
  const [initialValue, setInitialValue] = useState<Value>(DEFAULT_VALUE);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const isInitializing = useRef(true);

  const editor = usePlateEditor({
    plugins: [
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      H1Plugin.withComponent(H1Element),
      H2Plugin.withComponent(H2Element),
      H3Plugin.withComponent(H3Element),
      BlockquotePlugin.withComponent(BlockquoteElement),
    ],
    value: initialValue,
  });

  // Get auth token once and cache it
  const getAuthToken = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
  }, []);

  // Load notes from backend
  useEffect(() => {
    const loadNotes = async () => {
      isInitializing.current = true;
      try {
        const token = await getAuthToken();
        if (!token) return;

        const url = `/api/notes${subjectId ? `?subject_id=${subjectId}` : ""}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (response.ok && result.data?.notes_json) {
          const loadedValue = result.data.notes_json;
          setInitialValue(loadedValue);
          editor.tf.setValue(loadedValue);
        }
      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        // Use microtask to ensure setValue completes before enabling autosave
        queueMicrotask(() => {
          isInitializing.current = false;
        });
      }
    };

    loadNotes();
  }, [subjectId, editor, getAuthToken]);

  // Save to backend
  const saveToBackend = useCallback(
    async (nodes: EditorNode[]) => {
      try {
        const token = await getAuthToken();
        if (!token) return;

        const response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subject_id: subjectId || null,
            notes_json: nodes,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          console.error("Error saving notes:", data.error);
        }
      } catch (error) {
        console.error("Error saving notes:", error);
      }
    },
    [subjectId, getAuthToken]
  );

  // Schedule debounced save
  const scheduleSave = useCallback(
    (nodes: EditorNode[]) => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
      saveTimer.current = setTimeout(() => {
        saveToBackend(nodes);
        saveTimer.current = null;
      }, AUTOSAVE_DELAY);
    },
    [saveToBackend]
  );

  // Handle editor changes
  const handleEditorChange = useCallback(
    (newValue: Value) => {
      const nodes = newValue as unknown as EditorNode[];

      // Save to localStorage
      try {
        localStorage.setItem("editorContent", JSON.stringify(newValue));
        localStorage.setItem("editorContentPlain", parseNotesToText(nodes));
        localStorage.setItem("editorContentHTML", parseNotesToHTML(nodes));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }

      // Skip autosave during initialization
      if (isInitializing.current) return;

      scheduleSave(nodes);
    },
    [scheduleSave]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, []);


  const saveNote = () => {
    if (!editor) return;
    try {
      const value = (editor?.children ?? null) as EditorNode[] | null;
      if (value) localStorage.setItem("editorContent", JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save note', e);
    }
  }

  return (
    <Plate
      editor={editor}
      onChange={(x_val) => handleEditorChange(x_val.value)}
    >
      <FixedToolbar className="justify-start rounded-t-lg">
        <ToolbarButton onClick={() => editor.tf.h1.toggle()}>H1</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.h2.toggle()}>H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.h3.toggle()}>H3</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>
          Quote
        </ToolbarButton>
        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
          B
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
          I
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
          U
        </MarkToolbarButton>
        <ToolbarButton onClick={saveNote}>Save</ToolbarButton>
      </FixedToolbar>
      <EditorContainer>
        <Editor placeholder="Type your amazing content here..." />
      </EditorContainer>
    </Plate>
  );
}
