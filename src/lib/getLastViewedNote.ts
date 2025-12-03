// Location: src/lib/getLastViewedNote.ts

import supabase from "@/supabase/supabase_client";

export interface LastViewedNote {
  notes_id: string;
  subject_id: string;
  subject_name: string;
  updated_at: string;
}

/**
 * Get the last viewed/edited note for a user
 * Returns the note with the most recent updated_at timestamp
 */
export const getLastViewedNote = async (userId: string): Promise<LastViewedNote | null> => {
  try {
    console.log('Fetching last viewed note for user:', userId);
    
    // First, get the most recent note from notes_pages
    const { data: noteData, error: noteError } = await supabase
      .from('notes_pages')
      .select('notes_id, subject_id, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (noteError) {
      // PGRST116 means no rows returned - user has no notes
      if (noteError.code === 'PGRST116') {
        console.log('No notes found for user');
        return null;
      }
      console.error('Error fetching note:', noteError);
      return null;
    }

    if (!noteData) {
      console.log('No note data returned');
      return null;
    }

    console.log('Found note:', noteData);

    // Then get the subject name from subjects table
    const { data: subjectData, error: subjectError } = await supabase
      .from('subjects')
      .select('subject_name')
      .eq('subject_id', noteData.subject_id)
      .single();

    if (subjectError) {
      console.error('Error fetching subject:', subjectError);
      // Return the note data even if we can't get the subject name
      return {
        notes_id: noteData.notes_id,
        subject_id: noteData.subject_id,
        subject_name: 'Unknown Subject',
        updated_at: noteData.updated_at,
      };
    }

    console.log('Found subject:', subjectData);

    return {
      notes_id: noteData.notes_id,
      subject_id: noteData.subject_id,
      subject_name: subjectData?.subject_name || 'Unknown Subject',
      updated_at: noteData.updated_at,
    };
  } catch (error) {
    console.error('Unexpected error in getLastViewedNote:', error);
    return null;
  }
};