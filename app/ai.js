// PaperPilot AI Engine
// Ready for Featherless connection

const FEATHERLESS_API_KEY = "PASTE_YOUR_KEY_HERE"; // ← You will replace this later
const FEATHERLESS_BASE_URL = "https://api.featherless.ai/v1";

async function callFeatherless(messages, model = "Qwen/Qwen2.5-7B-Instruct") {
  // If no real key yet, return temporary response
  if (!FEATHERLESS_API_KEY || FEATHERLESS_API_KEY === "PASTE_YOUR_KEY_HERE") {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return null; // Signal that we should use fallback
  }

  const response = await fetch(`${FEATHERLESS_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FEATHERLESS_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.4,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error("Featherless API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateSummary(pdfText) {
  const prompt = `
You are an expert research assistant. 
Read the following research paper text and create:

1. A clear, simple summary (around 150-200 words) that a university student can easily understand.
2. 4 important key points from the paper.

Return the response in this exact format:

SUMMARY:
(your summary here)

KEY POINTS:
- point 1
- point 2
- point 3
- point 4

Paper text:
${pdfText.slice(0, 12000)}
`;

  try {
    const result = await callFeatherless([
      { role: "system", content: "You are a helpful research paper assistant." },
      { role: "user", content: prompt },
    ]);

    // If no real API key yet, use temporary response
    if (!result) {
      return {
        summary:
          "This is a temporary high-quality summary. Once you paste your Featherless API key in ai.js, this will become a real AI-generated summary of the research paper written in clear and simple language.",
        keyPoints: [
          "The paper addresses an important research problem",
          "A new method or approach is proposed and evaluated",
          "Experiments show meaningful results compared to previous work",
          "The authors discuss limitations and possible future directions",
        ],
      };
    }

    // Parse the AI response
    const summaryMatch = result.match(/SUMMARY:\s*([\s\S]*?)(?=KEY POINTS:|$)/i);
    const keyPointsMatch = result.match(/KEY POINTS:\s*([\s\S]*)/i);

    const summary = summaryMatch
      ? summaryMatch[1].trim()
      : result.slice(0, 500);

    let keyPoints = [];
    if (keyPointsMatch) {
      keyPoints = keyPointsMatch[1]
        .split("\n")
        .map((line) => line.replace(/^[-•*\d.]+\s*/, "").trim())
        .filter((line) => line.length > 10)
        .slice(0, 5);
    }

    if (keyPoints.length === 0) {
      keyPoints = [
        "Key insights will appear here once the AI response is properly parsed.",
      ];
    }

    return { summary, keyPoints };
  } catch (error) {
    console.error("Summary error:", error);
    return {
      summary: "Sorry, there was a problem generating the summary. Please try again.",
      keyPoints: ["An error occurred while processing the paper."],
    };
  }
}

export async function askQuestion(pdfText, question) {
  const prompt = `
You are a helpful research assistant. 
Answer the user's question based only on the research paper content below.
Give a clear and direct answer.

Question: ${question}

Paper content:
${pdfText.slice(0, 10000)}
`;

  try {
    const result = await callFeatherless([
      { role: "system", content: "You are a helpful research paper assistant. Answer questions clearly based on the paper." },
      { role: "user", content: prompt },
    ]);

    if (!result) {
      return "This is a temporary answer. Once you add your Featherless API key in the ai.js file, you will receive real answers based on the content of the paper.";
    }

    return result;
  } catch (error) {
    console.error("Question error:", error);
    return "Sorry, I couldn't answer that question right now. Please try again.";
  }
}