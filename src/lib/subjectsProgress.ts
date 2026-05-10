import supabase from "@/supabase/supabase_client";

interface SubjectRow {
  id: string;
  name: string;
  progress: number;  // 0–100
  score: number;     // correct
  maxScore: number;  // correct + wrong
  completed: boolean;
}

// No longer used: DbSubjectProgress

export const getSubjectsProgress = async (): Promise<SubjectRow[]> => {
  try {
    // 1. Get user id
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return [];

    // 2. Get subjects
    const { data: subjects, error: subjectsErr } = await supabase
      .from('subjects')
      .select('subject_id, subject_name, score, total_items')
      .eq('user_id', userId);

    if (subjectsErr || !subjects) {
      console.error("Error fetching subjects:", subjectsErr?.message);
      return [];
    }

    if (subjects.length === 0) return [];

    // 3. Get all flashcards for these subjects
    const { data: flashcards, error: cardsErr } = await supabase
      .from('flashcards')
      .select('subject_id, is_reviewed')
      .in('subject_id', subjects.map(s => s.subject_id));

    if (cardsErr) {
      console.error("Error fetching flashcards:", cardsErr.message);
      return [];
    }

    // 4. Calculate progress per subject
    return subjects.map((subject): SubjectRow => {
      const subjectCards = flashcards?.filter(f => f.subject_id === subject.subject_id) || [];
      const totalCards = subjectCards.length;
      const reviewedCards = subjectCards.filter(f => f.is_reviewed === true).length;
      
      const progress = totalCards > 0 ? Math.round((reviewedCards / totalCards) * 100) : 0;

      return {
        id: subject.subject_id,
        name: subject.subject_name,
        progress: progress,
        completed: progress === 100,
        score: subject.score || 0,
        maxScore: subject.total_items || 0
      };
    });
  } catch (error) {
    console.error("Fatal error in getSubjectsProgress:", error);
    return [];
  }
};