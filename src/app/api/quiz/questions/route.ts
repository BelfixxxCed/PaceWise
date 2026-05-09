import { NextResponse } from "next/server";

// QUIZ FEATURE DISABLED
// Original implementation handled:
//   GET  - fetches spaced-repetition questions for a subject (SM-2 algorithm)
//   POST - submits a question answer, updates SM-2 fields, records quiz_question row
//
// SM-2 Spaced Repetition Algorithm (original notes):
//   Correct: repetition++, interval: 1d->6d->interval*EF, EF: +0.05 (max 3.0)
//   Incorrect: repetition=0, interval=1d, EF: -0.2 (min 1.3)

export async function GET() {
  return NextResponse.json({ error: "Quiz feature is disabled" }, { status: 503 });
}

export async function POST() {
  return NextResponse.json({ error: "Quiz feature is disabled" }, { status: 503 });
}
