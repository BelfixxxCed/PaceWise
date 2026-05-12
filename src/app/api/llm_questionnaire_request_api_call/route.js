export async function POST() {
  // ################ONLY UN-COMMENT WHEN YOU ACTUALLY HAVE OLLAMA ALREADY####################

  // const { prompt } = await req.json();

  // const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //     model: "llama2:latest",
  //     prompt: prompt,
  //     stream: false
  //     }),
  // });

  // const data = await ollamaResponse.json();
  // return Response.json({output: data.response});

  // DELETE THE CODE BELOW IF YOU ALREADY HAVE LLAMA

  const fake_data = [
    {
      Type: "MultipleChoice",
      Question:
        "Which part of the cell controls its activities and contains DNA?",
      Options: ["Mitochondria", "Nucleus", "Ribosome", "Cell membrane"],
      Answer: "Nucleus",
    },
    {
      Type: "MultipleChoice",
      Question: "What is the primary function of mitochondria in a cell?",
      Options: [
        "Protein synthesis",
        "Energy production",
        "Storing genetic material",
        "Transporting substances",
      ],
      Answer: "Energy production",
    },
    {
      Type: "TrueOrFalse",
      Question: "Ribosomes are responsible for producing proteins in a cell.",
      Options: ["True", "False"],
      Answer: "True",
    },
    {
      Type: "MultipleChoice",
      Question: "Which structure forms the outer boundary of an animal cell?",
      Options: ["Cell wall", "Cell membrane", "Cytoplasm", "Nucleus"],
      Answer: "Cell membrane",
    },
    {
      Type: "TrueOrFalse",
      Question: "The vacuole stores water and nutrients in a cell.",
      Options: ["True", "False"],
      Answer: "True",
    },
  ];

  return Response.json({ output: fake_data });
}
