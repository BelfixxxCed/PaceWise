export const SendText = async (payload: string): Promise<any[]> => {
    const dev_prompt = `
    You are a teacher creating quiz questions based on user input.
    ONLY output JSON. DO NOT include any text, headings, or explanations.

    Each object must have:
    - "Type": "MultipleChoice" or "TrueOrFalse"
    - "Question": string
    - "Options": array of strings
    - "Answer": string (must match one of the options)

    Example input: "Water boils at 100C."
    Example output:
    [
    {
        "Type": "TrueOrFalse",
        "Question": "Does water boil at 100C?",
        "Options": ["True", "False"],
        "Answer": "True"
    },
    {
        "Type": "MultipleChoice",
        "Question": "What temperature does water boil at?",
        "Options": ["90C", "100C", "110C"],
        "Answer": "100C"
    }
    ]

    Now generate quiz questions for the following user input as strictly JSON only:
    `;

    const response = await fetch("/api/llm_questionnaire_request_api_call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prompt: `${dev_prompt}\nUser: ${payload}`
        })
    });

    const data = await response.json();
    
    
    // Parse the LLM response string into an array
    try {
        // Remove markdown code blocks if present
        let cleanOutput = data.output;
        
        // Remove ```json and ``` if the LLM wrapped the response
        if (typeof cleanOutput === 'string') {
            cleanOutput = cleanOutput.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        }
        
        
        const parsedOutput = JSON.parse(cleanOutput);
        
        
        // Ensure it's an array
        if (!Array.isArray(parsedOutput)) {
            console.error("LLM response is not an array:", parsedOutput);
            return [];
        }
        
        return parsedOutput;
    } catch (error) {
        console.error("Failed to parse LLM output:", error);
        console.error("Raw output was:", data.output);
        return []; // Return empty array on parse failure
    }
}