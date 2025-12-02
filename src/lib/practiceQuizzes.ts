import supabase from "@/supabase/supabase_client";

/**
 * Get the number of practice quizzes available for the user
 * A quiz is available if a subject has at least one question with next_appearance < now
 */
export const getAvailableQuizzesCount = async (userId: string): Promise<number> => {
  try {
    // Get current date and time
    const now = new Date().toISOString();

    // Get all subjects for the user
    const { data: subjects, error: subjectsError } = await supabase
      .from("subjects")
      .select("subject_id")
      .eq("user_id", userId);

    if (subjectsError) {
      console.error("Error fetching subjects:", subjectsError.message);
      return 0;
    }

    if (!subjects || subjects.length === 0) {
      return 0;
    }

    const subjectIds = subjects.map(s => s.subject_id);

    // Get all questions that are past due (next_appearance < now)
    const { data: overdueQuestions, error: questionsError } = await supabase
      .from("questions")
      .select("question_id, subject_id, next_appearance")
      .in("subject_id", subjectIds)
      .lt("next_appearance", now);

    if (questionsError) {
      console.error("Error fetching overdue questions:", questionsError.message);
      return 0;
    }

    if (!overdueQuestions || overdueQuestions.length === 0) {
      return 0;
    }

    // Get unique subject_ids (each subject with overdue questions = 1 available quiz)
    const uniqueSubjects = new Set(
      overdueQuestions
        .filter(q => q.subject_id) // Filter out null subject_ids
        .map(q => q.subject_id)
    );

    return uniqueSubjects.size;
  } catch (error) {
    console.error("Error in getAvailableQuizzesCount:", error);
    return 0;
  }
};

/**
 * Get detailed information about available quizzes
 * Returns array of subjects with their overdue question counts
 */
export const getAvailableQuizzesDetails = async (userId: string) => {
  try {
    const now = new Date().toISOString();

    // Get all subjects for the user with their questions
    const { data: subjects, error: subjectsError } = await supabase
      .from("subjects")
      .select(`
        subject_id,
        subject_name
      `)
      .eq("user_id", userId);

    if (subjectsError) {
      console.error("Error fetching subjects:", subjectsError.message);
      return [];
    }

    if (!subjects || subjects.length === 0) {
      return [];
    }

    // Get overdue questions for all subjects
    const subjectIds = subjects.map(s => s.subject_id);
    
    const { data: overdueQuestions, error: questionsError } = await supabase
      .from("questions")
      .select("question_id, subject_id, next_appearance")
      .in("subject_id", subjectIds)
      .lt("next_appearance", now);

    if (questionsError) {
      console.error("Error fetching overdue questions:", questionsError.message);
      return [];
    }

    if (!overdueQuestions || overdueQuestions.length === 0) {
      return [];
    }

    // Group questions by subject
    const subjectQuestionCount = overdueQuestions.reduce((acc: any, q: any) => {
      if (q.subject_id) {
        acc[q.subject_id] = (acc[q.subject_id] || 0) + 1;
      }
      return acc;
    }, {});

    // Return subjects with their overdue question counts
    const availableQuizzes = subjects
      .filter(s => subjectQuestionCount[s.subject_id])
      .map(s => ({
        subject_id: s.subject_id,
        subject_name: s.subject_name,
        overdue_questions: subjectQuestionCount[s.subject_id]
      }));

    return availableQuizzes;
  } catch (error) {
    console.error("Error in getAvailableQuizzesDetails:", error);
    return [];
  }
};