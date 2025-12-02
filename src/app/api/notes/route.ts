import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import supabase from "@/supabase/supabase_client";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function authenticateRequest(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return {
      error: NextResponse.json(
        { error: "Missing auth token" },
        { status: 401 }
      ),
    };
  }

  const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(
    token
  );

  if (authError || !userData?.user) {
    console.error("Authentication error:", authError);
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  return { userId: userData.user.id };
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    if (!text) {
      return NextResponse.json(
        { error: "Missing request body" },
        { status: 400 }
      );
    }

    let body: { subject_id?: string | null; notes_json?: any };
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { subject_id = null, notes_json = null } = body;
    if (!notes_json) {
      return NextResponse.json(
        { error: "Missing notes_json" },
        { status: 400 }
      );
    }

    const authResult = await authenticateRequest(req);
    if ("error" in authResult) return authResult.error;
    const { userId } = authResult;

    const now = new Date().toISOString();

    if (subject_id) {
      const { data: existingNote, error: fetchError } = await supabaseAdmin
        .from("notes_pages")
        .select("notes_id")
        .eq("user_id", userId)
        .eq("subject_id", subject_id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking existing note:", fetchError);
        return NextResponse.json(
          { error: fetchError.message },
          { status: 500 }
        );
      }

      if (existingNote) {
        const { data, error } = await supabaseAdmin
          .from("notes_pages")
          .update({ notes_json, updated_at: now })
          .eq("notes_id", existingNote.notes_id)
          .select()
          .single();

        if (error) {
          console.error("Supabase update error:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Updated", data }, { status: 200 });
      }
    }

    const { data, error } = await supabaseAdmin
      .from("notes_pages")
      .insert([{ subject_id, notes_json, user_id: userId, updated_at: now }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Saved", data }, { status: 200 });
  } catch (err) {
    console.error("API error saving notes:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject_id = searchParams.get("subject_id");

    const authResult = await authenticateRequest(req);
    if ("error" in authResult) return authResult.error;
    const { userId } = authResult;

    let query = supabaseAdmin
      .from("notes_pages")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (subject_id) {
      query = query.eq("subject_id", subject_id);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? null }, { status: 200 });
  } catch (err) {
    console.error("API error fetching notes:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}