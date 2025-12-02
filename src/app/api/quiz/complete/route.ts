import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUserId(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token)
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
  return { userId: data.user.id };
}

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
  const completionPercentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  const mastery = completionPercentage;

  const { data: result, error: resultErr } = await supabaseAdmin
    .from("quiz_results")
    .insert([
      {
        quiz_id,
        correct_items: correctAnswers,
        wrong_items: wrongAnswers,
        date_of_completion: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (resultErr) {
    return NextResponse.json({ error: resultErr.message }, { status: 500 });
  }

  const { error: updateErr } = await supabaseAdmin
    .from("quizzes")
    .update({
      completion_percentage: completionPercentage,
      mastery,
      date: new Date().toISOString(),
    })
    .eq("quiz_id", quiz_id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      ok: true,
      quiz_results_id: result.quiz_results_id,
      correct_items: correctAnswers,
      wrong_items: wrongAnswers,
      completion_percentage: completionPercentage,
      mastery,
    },
    { status: 200 }
  );
}
