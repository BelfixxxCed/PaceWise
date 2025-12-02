import { useRef } from 'react';
import supabase from '@/supabase/supabase_client';

export const useSaveLastEdit = () => {
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timer_save_lastEdit = (subject_id: string) => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      await supabase
        .from("notes_pages")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("subject_id", subject_id);

      console.log("Save time");
    }, 2000);
  };

  return timer_save_lastEdit;
};
