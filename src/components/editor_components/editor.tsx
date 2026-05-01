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
import { useEffect, useRef, useCallback } from "react";
import supabase from "@/supabase/supabase_client";

const AUTOSAVE_DELAY = 2000;

interface Props {
  noteId: string;
}

export default function MyEditorPage({ noteId }: Props) {
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
  });

  // Get auth token
  const getAuthToken = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
  }, []);

  // Load note content from backend by noteId
  useEffect(() => {
    const loadNote = async () => {
      isInitializing.current = true;
      try {
        const token = await getAuthToken();
        if (!token || !noteId) return;

        const response = await fetch(`/api/notes?notes_id=${noteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (response.ok && result.data?.notes_json) {
          const loadedValue = result.data.notes_json as Value;
          editor.tf.setValue(loadedValue);
        }
      } catch (error) {
        console.error("Error loading note:", error);
      } finally {
        queueMicrotask(() => {
          isInitializing.current = false;
        });
      }
    };

    loadNote();
  }, [noteId, editor, getAuthToken]);

  // Save to backend by noteId
  const saveToBackend = useCallback(
    async (nodes: EditorNode[]) => {
      try {
        const token = await getAuthToken();
        if (!token || !noteId) return;

        const response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            notes_id: noteId,
            notes_json: nodes,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          console.error("Error saving note:", data.error);
        }
      } catch (error) {
        console.error("Error saving note:", error);
      }
    },
    [noteId, getAuthToken]
  );

  // Schedule debounced save
  const scheduleSave = useCallback(
    (nodes: EditorNode[]) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
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

      try {
        localStorage.setItem("editorContent", JSON.stringify(newValue));
        localStorage.setItem("editorContentPlain", parseNotesToText(nodes));
        localStorage.setItem("editorContentHTML", parseNotesToHTML(nodes));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }

      if (isInitializing.current) return;
      scheduleSave(nodes);
    },
    [scheduleSave]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return (
    <Plate editor={editor} onChange={(x_val) => handleEditorChange(x_val.value)}>
      <FixedToolbar className="justify-start rounded-t-lg z-10">
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
      </FixedToolbar>
      <EditorContainer>
        <Editor placeholder="Type your amazing content here..." />
      </EditorContainer>
    </Plate>
  );
}
