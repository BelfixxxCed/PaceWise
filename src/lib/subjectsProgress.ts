import supabase from "@/supabase/supabase_client";

interface SubjectRow {
  id: number;
  name: string;
  progress: number;  // 0–100
  score: number;     // questions due in future
  maxScore: number;  // total questions
  completed: boolean;
}

export const getSubjectsProgress = async (userId: string): Promise<SubjectRow[]> => {
  const { data, error } = await supabase
    .from("subjects")
    .select(`
      subject_id,
      subject_name,
      questions (
        question_id,
        next_appearance
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching subjects: ", error.message);
    return [];
  }

  if (!data) return [];

  const now = new Date();

  return data.map((subject: any) => {
    const totalQuestions = subject.questions?.length || 0;
    
    // Count questions that are due in the future (i.e., "done" for now)
    const questionsDueInFuture = subject.questions?.filter((q: any) => {
      if (!q.next_appearance) return false;
      const nextAppearance = new Date(q.next_appearance);
      return nextAppearance > now;
    }).length || 0;

    const score = questionsDueInFuture;
    const maxScore = totalQuestions;
    const progress = maxScore ? (score / maxScore) * 100 : 0;
    const completed = maxScore > 0 && score === maxScore;

    return {
      id: subject.subject_id,
      name: subject.subject_name,
      progress: Math.round(progress),
      score,
      maxScore,
      completed,
    };
  });
};