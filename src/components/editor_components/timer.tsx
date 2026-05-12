import { useRef } from 'react';
import supabase from '@/supabase/supabase_client';

/** Updates the updated_at timestamp for a specific note (by notes_id). */
export const useSaveLastEdit = () => {
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timerSaveLastEdit = (notes_id: string) => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      try {
        await supabase
          .from("notes_pages")
          .update({ updated_at: new Date().toISOString() })
          .eq("notes_id", notes_id);
      } catch (error) {
        console.log("An error in updating the time: ", error);
      }
    }, 2000);
  };

  return timerSaveLastEdit;
};
