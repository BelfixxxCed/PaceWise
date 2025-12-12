import supabase from "@/supabase/supabase_client";

interface SubjectRow {
  id: string;
  name: string;
  progress: number;  // 0–100
  score: number;     // correct
  maxScore: number;  // correct + wrong
  completed: boolean;
}

export const getSubjectsProgress = async (): Promise<SubjectRow[]> => {
    // Let's get all of the subjects first:
    const {data : subject_list , error : subject_error} = await supabase
      .from("subjects")
      .select(`subject_id, subject_name`);
    
    if(subject_error){
      console.log("There was an error with the query of subjects: ", subject_error.message);
      return [];
    }

    // NOW we find the progress...

const subjects_array : SubjectRow[] = (await Promise.all(
    subject_list.map(async (each): Promise<SubjectRow | null> => {

    const {count : total_question_count, error : total_question_error} = await supabase.from("questions").select("*", {count:"exact", head:true}).eq("subject_id", each.subject_id);
    if(total_question_error){
      console.log("There was an error in getting the question for a subject: ", total_question_error.message);
      return null;
    }
    
    // Get tomorrow's date at midnight (start of day) to check if questions are scheduled for future dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const tomorrow_timestamptz = tomorrow.toISOString();
    
    const {count : undue_question_count, error : undue_question_error} = await supabase.from("questions").select("*", {count:"exact", head:true}).gte("next_appearance", tomorrow_timestamptz).eq("subject_id", each.subject_id);
    if(undue_question_error){
      console.log("There was an error in getting the question for a subject: ", undue_question_error.message);
      return null;
    }

    const {data : temp_score, error : temp_score_error} = await supabase
      .from("quizzes")
      .select("*, quiz_results(correct_items, wrong_items)")
      .eq("subject_id", each.subject_id)
      .order("date", {ascending:false})
      .limit(1);

    if(temp_score_error){
      console.log("Error in getting the latest score for this subject: ", temp_score_error.message);
      return null;
    }


    const latestQuiz = temp_score?.[0];
    const latestResult = latestQuiz?.quiz_results?.[0];

    const score = latestResult?.correct_items ?? 0;
    const wrong = latestResult?.wrong_items ?? 0;
    const total_score_latest_quiz = score + wrong;

    const undue = undue_question_count ?? 0;
    const total = total_question_count ?? 0;
    
    // Handle case when no questions exist yet
    if (total === 0) {
      return {
        id: each.subject_id,
        name: each.subject_name,
        progress: 0,
        completed: false,
        score: 0,
        maxScore: 0
      };
    }
    
    // Progress = percentage of questions that are "done" (scheduled for tomorrow or later)
    // undue already represents the count of done questions
    const done = undue;
    let temp_progress = (done / total) * 100;
    temp_progress = Math.round(temp_progress);

    console.log("for", each.subject_name, "done:", done, "/", total, "=", temp_progress + "%");

    // A subject is completed when progress reaches 100% (all questions done)
    // AND there's a quiz result available
    const hasCompletedQuiz = temp_progress === 100 && !!latestResult;

    return {
      id: each.subject_id,
      name: each.subject_name,
      progress : temp_progress,
      completed : hasCompletedQuiz,
      score : score,
      maxScore : total_score_latest_quiz
    };
  })
)).filter((item): item is SubjectRow => item !== null);  
  return subjects_array;
};