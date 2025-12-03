import supabase from "@/supabase/supabase_client";
import { SendText } from "@/LLM_Request_FrontEnd/LLM_Request_Frontend";
import { slateToPlainText } from "@/lib/parseNotes";

export const Create_Questions = async (subjectId: string) => {

    // In here we query the data
    const {data, error} = await supabase
        .from("notes_pages")
        .select("notes_json")
        .eq("subject_id", subjectId);

    if (error) {
        console.error("Error fetching notes:", error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.error("No notes found for subject_id:", subjectId);
        return;
    }

    const parsed_notes_per_page = data?.map(each => {
        // `notes_json` can be returned by Supabase as either a string or already-parsed object.
        // Avoid calling JSON.parse on an object (which would coerce to "[object Object]").
        let slateObject: unknown = null;
        try {
            if (typeof each.notes_json === "string") {
            const raw = each.notes_json.trim();
            if (raw === "[object Object]") {
                console.warn("notes_json is the string '[object Object]'; treating as empty slate array.", each);
                slateObject = [];
            } else if (raw.startsWith("{") || raw.startsWith("[")) {
                // Looks like JSON — attempt to parse once. Any parsing error will be handled by outer catch.
                slateObject = JSON.parse(raw);
            } else {
                // Non-JSON string — treat as empty slate array
                console.warn("notes_json is a non-JSON string; treating as empty slate array.", raw);
                slateObject = [];
            }
            } else {
            slateObject = each.notes_json;
            }
        } catch (e) {
            console.warn("Failed to parse notes_json for a page, treating as empty slate array:", e, each.notes_json);
            slateObject = [];
        }
        const parsed_data = slateToPlainText(slateObject as Parameters<typeof slateToPlainText>[0]);
        return parsed_data;
    });

    const LLM_payload = parsed_notes_per_page.join('\n') || '';
        
    const LLM_reply = await SendText(LLM_payload);
    
    // Check if LLM_reply is actually an array
    if (!Array.isArray(LLM_reply)) {
        console.error("LLM response is not an array! Type:", typeof LLM_reply);
        console.error("Value:", LLM_reply);
        return;
    }

    if (LLM_reply.length === 0) {
        console.error("LLM returned empty array");
        return;
    }

    // Save to session storage
    sessionStorage.setItem("new_generate_quiz_items", JSON.stringify(LLM_reply));

    const data_fix_column = LLM_reply.map(each => {
        return {
            question: each.Question,
            answer: each.Answer,
            options: Array.isArray(each.Options) ? each.Options : (typeof each.Options === 'string' ? safeParseOptions(each.Options) : []),
            subject_id: subjectId,
            // initialize spaced repetition fields
            repetition: 0,
            ease_factor: 2.5,
            interval: 1,
            next_appearance: new Date().toISOString(),
            // link back to notes may be unknown here — omit unknown columns to match DB schema
        }
    });

    // Upload generated questions to Supabase
    try {
        const { data: inserted, error: insertErr } = await supabase
            .from("questions")
            .insert(data_fix_column)
            .select();

        if (insertErr) {
            console.error("Failed to upload generated questions:", insertErr.message);
            // still return the parsed LLM reply so caller can use it (and sessionStorage keeps a copy)
            return LLM_reply;
        }

        // Return inserted rows (or the original parsed LLM reply if insert returned nothing)
        return inserted ?? LLM_reply;
    } catch (err) {
        console.error("Unexpected error uploading generated questions:", err);
        return LLM_reply;
    }

}

function safeParseOptions(s: unknown): string[] {
    if (Array.isArray(s)) return s as string[];
    if (typeof s === "string") {
        try {
            const p = JSON.parse(s);
            return Array.isArray(p) ? p : [];
        } catch {
            // try splitting by commas as a fallback
            return s.split(",").map((x: string) => x.trim()).filter(Boolean);
        }
    }
    return [];
}