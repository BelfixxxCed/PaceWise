import supabase from "@/supabase/supabase_client";
import { SendText } from "@/LLM_Request_FrontEnd/LLM_Request_Frontend";
import { slateToPlainText } from "@/lib/parseNotes";

export const Create_Questions = async (subject_id: string) => {
    // Query the data
    const { data, error } = await supabase
        .from("notes_pages")
        .select("notes_json")
        .eq("subject_id", subject_id);

    if (error) {
        console.error("Error fetching notes:", error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.error("No notes found for subject_id:", subject_id);
        return;
    }

    const parsed_notes_per_page = data.map(each => {
        const slateObject = each.notes_json;
        const parsed_data = slateToPlainText(slateObject);
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
            options: each.Options,
            subject_id: subject_id
        }
    });

    // Save in Supabase
    const { data: insertedData, error: error_uploading_data } = await supabase
        .from("questions")
        .insert(data_fix_column)
        .select();

    if (error_uploading_data) {
        console.error("Error uploading questions:", error_uploading_data.message);
        console.error("Error details:", error_uploading_data);
        return;
    }

    console.log("Successfully inserted:", insertedData);
}