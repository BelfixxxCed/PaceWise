import supabase from "@/supabase/supabase_client";

interface SubjectRow {
  id: string;
  name: string;
  progress: number;  // 0–100
  score: number;     // correct
  maxScore: number;  // correct + wrong
  completed: boolean;
}

// Type definition for the database function return
interface DbSubjectProgress {
  subject_id: string;
  subject_name: string;
  progress: number;
  completed: boolean;
  score: number;
  max_score: number;
}

export const getSubjectsProgress = async (): Promise<SubjectRow[]> => {
  try {
    // Call the database function
    const { data, error } = await supabase.rpc('get_subjects_progress');
    
    if (error) {
      console.error("Error fetching subjects progress:", error.message);
      return [];
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Cast and map database result to our interface
    const dbResults = data as DbSubjectProgress[];
    
    return dbResults.map((row): SubjectRow => ({
      id: row.subject_id,
      name: row.subject_name,
      progress: row.progress,
      completed: row.completed,
      score: row.score,
      maxScore: row.max_score
    }));
  } catch (error) {
    console.error("Fatal error in getSubjectsProgress:", error);
    return [];
  }
};