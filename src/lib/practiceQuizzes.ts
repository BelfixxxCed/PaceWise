// QUIZ FEATURE DISABLED
/*
import supabase from "@/supabase/supabase_client";

export const getAvailableQuizzesCount = async (userId: string): Promise<number> => {
  // Counts subjects that have at least one question with next_appearance < now.
  // Each such subject counts as 1 available quiz.
  ...
};

export const getAvailableQuizzesDetails = async (userId: string) => {
  // Returns array of { subject_id, subject_name, overdue_questions }
  // for subjects with questions past their next_appearance date.
  ...
};
*/

export const getAvailableQuizzesCount = async (): Promise<number> => 0;
export const getAvailableQuizzesDetails = async () => [];
