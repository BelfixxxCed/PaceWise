import supabase from "@/supabase/supabase_client";
import { error } from "console";

interface SubjectRow {
  id: string;
  name: string;
  progress: number;  // 0–100
  score: number;     // correct
  maxScore: number;  // correct + wrong
  completed: boolean;
}

export const getSubjectsProgress = async (): Promise<SubjectRow[]> => {


  // Get the userID
   const {data : userID, error : userID_error} = await supabase.auth.getUser();
   if (userID_error){
    console.log("There was error in getting the userID: ", userID_error.message);
    return [];
   }
   const temp_userID = userID.user.id

    // Let's get all of the subjects first:
    const {data : subject_list , error : subject_error} = await supabase
      .from("subjects")
      .select(`subject_id, subject_name`)
      .eq("user_id", temp_userID);
    
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
    
    const now_timestamptz = new Date().toISOString();
    const {count : undue_question_count, error : undue_question_error} = await supabase.from("questions").select("*", {count:"exact", head:true}).gt("next_appearance", now_timestamptz).eq("subject_id", each.subject_id);
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
    let temp_progress = total > 0 ? undue / total : 0;
    temp_progress *= 100;
    temp_progress = Math.round(temp_progress);

    let temp_completed = true;
    if((total - undue) > 0){
      temp_completed = false;
    }

    return {
      id: each.subject_id,
      name: each.subject_name,
      progress : temp_progress,
      completed : temp_completed,
      score : score,
      maxScore : total_score_latest_quiz
    };
  })
)).filter((item): item is SubjectRow => item !== null);  
  return subjects_array;
};