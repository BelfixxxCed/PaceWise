import supabase from "@/supabase/supabase_client";

interface SubjectRow {
  id: number;
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
      ),
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

    // NEW: Calculate progress based on spaced repetition
    const totalQuestions = subject.questions?.length || 0;
    const questionsDueInFuture = subject.questions?.filter((q: any) => {
      if (!q.next_appearance) return false;
      const nextAppearance = new Date(q.next_appearance);
      return nextAppearance > now;
    }).length || 0;

    const progress = totalQuestions ? (questionsDueInFuture / totalQuestions) * 100 : 0;
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