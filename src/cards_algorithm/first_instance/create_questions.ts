import supabase from "@/supabase/supabase_client";
import { SendText } from "@/LLM_Request_FrontEnd/LLM_Request_Frontend";
import { slateToPlainText } from "@/lib/parseNotes";

export const Create_Questions = async (subject_id : String) => {

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
        const slateObject = JSON.parse(each.notes_json); // <-- parse the JSON string
        const parsed_data = slateToPlainText(slateObject);
        return parsed_data;
    });

    const LLM_payload = parsed_notes_per_page?.join('\n') || '';
    const LLM_reply = await SendText(JSON.stringify(LLM_payload)) as any[];

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