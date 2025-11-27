import supabase from "@/supabase/supabase_client";
import { SendText } from "@/LLM_Request_FrontEnd/LLM_Request_Frontend";

export const Create_Questions = async (subject_id : String) => {

    // In here we query the data
    const {data, error} = await supabase
        .from("subjects")
        .select("*")
        .eq("subject_id", subject_id);

    if(error){
        console.log("There was an error in getting the subjects! Error message: ", error.message);
    }

    // Insert function ni johnric




    // In here assuming may data na tayo na parsed
    // Please delete this variable below
    const deleteMe_fakeParsedData = `🧬 What You Will See (Predictions)
1. Cooperative clusters emerge

Even if defectors dominate globally, pockets of cooperation survive like islands.

2. New strategies evolve that Axelrod never observed

For example:

“Fence strategies”: agents who defect to outside nodes but cooperate internally

“Conditional cooperators with neighbourhood memory”

“Vengeful cooperators” who sacrifice themselves to punish defectors

These do not appear in fully-mixed models.

3. Network topology affects evolution

Small-world networks massively help cooperation.
        Scale-free networks allow “hub enforcers”.`

    const LLM_reply = await SendText(deleteMe_fakeParsedData);
    console.log("LLM Reply: ", LLM_reply);


    // This is where we set to the session variables the new questions:
    sessionStorage.setItem("new_generate_quiz_items", JSON.stringify(LLM_reply));


    // Testing area, please delete everything after this

    // const editorRaw = localStorage.getItem("editor");
    // const {error: error1} = await supabase.from("notes_pages").insert({
    //     "notes_json": editorRaw,
    //     "subject_id" : subject_id,
    // })
    // if(error1){
    //     console.log("Error beh, ", error1.message);
    // }

}