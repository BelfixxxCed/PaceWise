export interface QuizQuestion {
    Type: "MultipleChoice" | "TrueOrFalse";
    Question: string;
    Options: string[];
    Answer: string;
}

export const SendText = async (payload: string): Promise<QuizQuestion[]> => {
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

    const data = await response.json() as { output?: unknown };

    // Parse the LLM response into an array, handling both string and object outputs
    try {
        let rawOutput: unknown = data.output;

        // If the API already returned an object/array, use it directly
        if (typeof rawOutput !== "string") {
            if (Array.isArray(rawOutput)) return rawOutput as QuizQuestion[];
            // If it's an object that contains a string payload, try to extract it
            if (rawOutput && typeof rawOutput === "object") {
                // some LLM adapters return { response: '...'} or { text: '...'}
                const rawObj = rawOutput as Record<string, unknown>;
                const potential = rawObj.response ?? rawObj.text ?? rawOutput;
                if (Array.isArray(potential)) return potential as QuizQuestion[];
                if (typeof potential === "string") rawOutput = potential;
                else rawOutput = JSON.stringify(potential);
            }
        }

        // At this point rawOutput should be a string. Clean code fences if present.
        const cleanOutput = typeof rawOutput === "string" ? rawOutput.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim() : "";

        // If it's an empty string after cleaning, log and return empty
        if (!cleanOutput) {
            console.error("LLM returned empty output");
            return [];
        }

        const parsedOutput = JSON.parse(cleanOutput) as unknown;

        if (!Array.isArray(parsedOutput)) {
            console.error("LLM response is not an array:", parsedOutput);
            return [];
        }

        return parsedOutput as QuizQuestion[];
    } catch (error) {
        console.error("Failed to parse LLM output:", error);
        console.error("Raw output was:", (data as { output?: unknown }).output);
        // If the raw output was already an array-like string (e.g. '[{...}]') but parse failed,
        // attempt a very small recovery: try evaluating JSON safely isn't possible here, so return []
        return [];
    }
}