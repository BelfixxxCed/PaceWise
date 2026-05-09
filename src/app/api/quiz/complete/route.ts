import { NextResponse } from "next/server";

// QUIZ FEATURE DISABLED
/*
import { getUserId } from "@/lib/auth";
import { supabaseAdmin } from "@/supabase/supabase_admin";
import { maybeIncrementStreak } from "@/lib/streak";

export async function POST(req: Request) {
  const auth = await getUserId(req);
  if ("error" in auth) return auth.error;
  const { userId } = auth;

  let body: { quiz_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { quiz_id } = body;
  if (!quiz_id) {
    return NextResponse.json({ error: "quiz_id required" }, { status: 400 });
  }

  const { data: quiz, error: quizErr } = await supabaseAdmin
    .from("quizzes")
    .select("quiz_id, user_id")
    .eq("quiz_id", quiz_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (quizErr || !quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const { data: responses, error: respErr } = await supabaseAdmin
    .from("quizzes_question")
    .select("iscorrect")
    .eq("quiz_id", quiz_id);

  if (respErr) {
    return NextResponse.json({ error: respErr.message }, { status: 500 });
  }

  const totalQuestions = responses?.length || 0;
  const correctAnswers = responses?.filter((r) => r.iscorrect).length || 0;
  const wrongAnswers = totalQuestions - correctAnswers;

  const { data: result, error: resultErr } = await supabaseAdmin
    .from("quiz_results")
    .insert([{
      quiz_id,
      correct_items: correctAnswers,
      wrong_items: wrongAnswers,
      date_of_completion: new Date().toISOString(),
    }])
    .select()
    .single();

  if (resultErr) {
    return NextResponse.json({ error: resultErr.message }, { status: 500 });
  }

  const { error: updateErr } = await supabaseAdmin
    .from("quizzes")
    .update({ date: new Date().toISOString() })
    .eq("quiz_id", quiz_id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  await maybeIncrementStreak(userId);

  return NextResponse.json({
    ok: true,
    quiz_results_id: result.quiz_results_id,
    correct_items: correctAnswers,
    wrong_items: wrongAnswers,
  }, { status: 200 });
}
*/

export async function POST() {
  return NextResponse.json({ error: "Quiz feature is disabled" }, { status: 503 });
}
