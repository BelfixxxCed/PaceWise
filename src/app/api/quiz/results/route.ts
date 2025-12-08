import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { supabaseAdmin } from "@/supabase/supabase_admin";

function safeParseArray(s: string): string[] {
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subject_id");

  if (!subjectId) {
    return NextResponse.json(
      { error: "subject_id is required" },
      { status: 400 }
    );
  }

  const auth = await getUserId(req);
  if ("error" in auth) return auth.error;
  const { userId } = auth;

  // First, get the latest quiz for this subject
  const { data: latestQuiz, error: quizError } = await supabaseAdmin
    .from("quizzes")
    .select("quiz_id, subject_id, date")
    .eq("subject_id", subjectId)
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (quizError) {
    return NextResponse.json({ error: quizError.message }, { status: 500 });
  }

  if (!latestQuiz) {
    return NextResponse.json(
      { error: "No quiz found for this subject" },
      { status: 404 }
    );
  }

  // Verify ownership
  const { data: subject, error: subjectError } = await supabaseAdmin
    .from("subjects")
    .select("subject_name, user_id")
    .eq("subject_id", subjectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (subjectError || !subject) {
    return NextResponse.json(
      { error: "Subject not found or access denied" },
      { status: 404 }
    );
  }

  // Get the quiz results
  const { data: quizResults, error: resultsError } = await supabaseAdmin
    .from("quiz_results")
    .select("quiz_results_id, correct_items, wrong_items, date_of_completion")
    .eq("quiz_id", latestQuiz.quiz_id)
    .maybeSingle();

  if (resultsError) {
    return NextResponse.json({ error: resultsError.message }, { status: 500 });
  }

  if (!quizResults) {
    return NextResponse.json(
      { error: "No results found for this quiz" },
      { status: 404 }
    );
  }

  // Get all question IDs and correctness from this quiz
  const { data: quizQuestions, error: questionsError } = await supabaseAdmin
    .from("quizzes_question")
    .select("question_id, iscorrect")
    .eq("quiz_id", latestQuiz.quiz_id);

  if (questionsError) {
    return NextResponse.json(
      { error: questionsError.message },
      { status: 500 }
    );
  }

  if (!quizQuestions || quizQuestions.length === 0) {
    return NextResponse.json(
      { error: "No questions found for this quiz" },
      { status: 404 }
    );
  }

  // Get the actual question data separately
  const questionIds = quizQuestions.map((qq) => qq.question_id);
  const { data: questionDetails, error: detailsError } = await supabaseAdmin
    .from("questions")
    .select("question_id, question, answer, options")
    .in("question_id", questionIds);

  if (detailsError) {
    return NextResponse.json(
      { error: detailsError.message },
      { status: 500 }
    );
  }

  // Create a map of question details for easy lookup
  const questionMap = new Map(
    (questionDetails || []).map((q) => [q.question_id, q])
  );

  // Transform the data to match the expected format
  const questions = quizQuestions.map((qq) => {
    const questionDetail = questionMap.get(qq.question_id);
    const opts = Array.isArray(questionDetail?.options)
      ? questionDetail.options
      : typeof questionDetail?.options === "string"
      ? safeParseArray(questionDetail.options)
      : [];

    return {
      id: qq.question_id,
      text: questionDetail?.question || "",
      options: opts,
      correct: questionDetail?.answer || "",
      isCorrect: qq.iscorrect,
      userAnswer: qq.iscorrect ? questionDetail?.answer : null,
    };
  });

  const total = quizResults.correct_items + quizResults.wrong_items;

  return NextResponse.json(
    {
      quiz_id: latestQuiz.quiz_id,
      subject_name: subject.subject_name || "Practice Quiz",
      score: quizResults.correct_items,
      total: total,
      questions: questions,
      date_of_completion: quizResults.date_of_completion,
    },
    { status: 200 }
  );
}
