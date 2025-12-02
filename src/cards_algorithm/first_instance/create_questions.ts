import supabase from "@/supabase/supabase_client";
import { SendText } from "@/LLM_Request_FrontEnd/LLM_Request_Frontend";
import { slateToPlainText } from "@/lib/parseNotes";

export const Create_Questions = async (subject_id : string) => {

    // In here we query the data
    const {data, error} = await supabase
        .from("notes_pages")
        .select("notes_json")
        .eq("subject_id", subject_id);

    if(error){
        console.log("There was an error in getting the subjects! Error message: ", error.message);
        return;
    }


    const parsed_notes_per_page = data?.map(each => {
        // `notes_json` can be returned by Supabase as either a string or already-parsed object.
        // Avoid calling JSON.parse on an object (which would coerce to "[object Object]").
        let slateObject: unknown = null;
        try {
            if (typeof each.notes_json === "string") {
                const raw = each.notes_json.trim();
                // Sometimes a stringified object can end up as "[object Object]" — treat that as empty
                if (raw === "[object Object]") {
                    console.warn("notes_json is the string '[object Object]'; treating as empty slate array.", each);
                    slateObject = [];
                } else if (raw.startsWith("{") || raw.startsWith("[")) {
                    slateObject = JSON.parse(raw);
                } else {
                    // Attempt to parse anyway; if it fails we'll fall back to empty array
                    try {
                        slateObject = JSON.parse(raw);
                    } catch (innerE) {
                        console.warn("notes_json is a non-JSON string; treating as empty slate array.", raw, innerE);
                        slateObject = [];
                    }
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

    const LLM_payload = parsed_notes_per_page?.join('\n') || '';
    const LLM_raw = await SendText(LLM_payload) as unknown;

    type LLMItem = { Question: string; Answer: string; Options: string[] };
    let LLM_reply: LLMItem[] = [];

    if (typeof LLM_raw === "string") {
        try {
            const parsed = JSON.parse(LLM_raw);
            if (Array.isArray(parsed)) {
                LLM_reply = parsed as LLMItem[];
            } else {
                console.warn("LLM reply parsed to non-array:", parsed);
            }
        } catch (e) {
            console.warn("Failed to parse LLM reply JSON:", e);
        }
    } else if (Array.isArray(LLM_raw)) {
        LLM_reply = LLM_raw as LLMItem[];
    } else {
        console.warn("Unexpected LLM reply type:", typeof LLM_raw);
    }

    // This is where we set to the session variables the new questions:
    sessionStorage.setItem("new_generate_quiz_items", JSON.stringify(LLM_reply));

    const data_fix_column = LLM_reply.map(each => {
        return {
            "question" : each.Question,
            "answer" : each.Answer,
            "options" : each.Options,
            "subject_id": subject_id
        }
    })
    // Save in Supabase the new generated questions
    const {error : error_uploading_data} = await supabase
        .from("questions")
        .insert(data_fix_column);

    if (error_uploading_data){
        console.log("There was an error in uploading the questions data: ", error_uploading_data.message);
        return;
    }

}