import supabase from "@/supabase/supabase_client";

interface SubjectRow {
  id: string;
  name: string;
  progress: number;  // 0–100
  score: number;     // correct
  maxScore: number;  // correct + wrong
  completed: boolean;
}

export const getSubjectsProgress = async (userId: string): Promise<SubjectRow[]> => {
  const { data, error } = await supabase
    .from("subjects")
    .select(`
      subject_id,
      subject_name,
      quizzes (
        quiz_id,
        date,
        quiz_results (
          correct_items,
          wrong_items,
          date_of_completion
        )
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching subjects: ", error.message);
    return [];
  }

  if (!data) return [];

  const now = new Date();

  // Process each subject
  const subjectsWithProgress = await Promise.all(
    data.map(async (subject: any) => {
      // Get latest quiz (original score logic)
      let latestCorrect = 0;
      let latestWrong = 0;

      if (subject.quizzes && subject.quizzes.length > 0) {
        const latestQuiz = subject.quizzes.reduce((prev: any, curr: any) => {
          const prevDate = prev.date ? new Date(prev.date) : new Date(0);
          const currDate = curr.date ? new Date(curr.date) : new Date(0);
          return currDate > prevDate ? curr : prev;
        });

        if (latestQuiz && latestQuiz.quiz_results && latestQuiz.quiz_results.length > 0) {
          latestCorrect = latestQuiz.quiz_results.reduce(
            (sum: number, r: any) => sum + (r.correct_items || 0),
            0
          );
          latestWrong = latestQuiz.quiz_results.reduce(
            (sum: number, r: any) => sum + (r.wrong_items || 0),
            0
          );
        }
      }

      const score = latestCorrect;
      const maxScore = latestCorrect + latestWrong;

      // FIXED: Calculate progress based on spaced repetition
      // Get questions directly linked to this subject
      const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("question_id, next_appearance")
        .eq("subject_id", subject.subject_id);

      if (questionsError) {
        console.error(`Error fetching questions for subject ${subject.subject_name}:`, questionsError.message);
      }

      const totalQuestions = questions?.length || 0;
      
      // Count questions with next_appearance in the FUTURE (not yet due)
      const questionsDueInFuture = questions?.filter((q: any) => {
        if (!q.next_appearance) return false;
        const nextAppearance = new Date(q.next_appearance);
        return nextAppearance > now;
      }).length || 0;

      // Progress = (questions due in future / total) * 100
      // Higher % = more learning ahead, lower % = more completed
      const progress = totalQuestions > 0 
        ? Math.round((questionsDueInFuture / totalQuestions) * 100) 
        : 0;

      const completed = maxScore > 0 && score === maxScore;

      return {
        id: subject.subject_id,
        name: subject.subject_name,
        progress,
        score,
        maxScore,
        completed,
      };
    })
  );

  return subjectsWithProgress;
};