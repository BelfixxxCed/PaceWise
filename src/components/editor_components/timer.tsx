import { useRef } from 'react';
import supabase from '@/supabase/supabase_client';

export const useSaveLastEdit = () => {
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timerSaveLastEdit = (subject_id: string) => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {

        try {
            await supabase
                .from("notes_pages")
                .update({
                updated_at: new Date().toISOString(),
                })
                .eq("subject_id", subject_id);
        } catch( error){
            console.log("An error in updating the time: ", error);
            return;
        }

    }, 2000);
  };

  return timerSaveLastEdit;
};
