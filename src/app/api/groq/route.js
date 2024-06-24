
import { load_dotenv } from "dotenv";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// load_dotenv();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getResponse(query, context) {
    const chatCompletion = await getGroqChatCompletion(query, context);
    return chatCompletion.choices[0]?.message?.content || "";
}

export async function getGroqChatCompletion(query, context) {
    console.log(query);
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `You are a professional script writer tasked with creating a TikTok short script. 
Your goal is to craft a 30-second to 1-minute video script based on the query provided below. 
Ensure the script loops smoothly from start to finish for continuous playback.
No greets or introductions are needed. 
Script should start with a cliff hanger,or a question.
Need to grab the user's attention in the provided first 5 words.
No confirmation needed for responses, words are expensive.
**Example Structure:**
| Section | Script Text |
|---------|-------------|
| Start   | "<example:you should not do this.>" |
| Middle  | "<script>" |
... can have as many sections as needed.
| Middle  | "<script>" |
| End     | "And that's why" |

**Script Requirements:**
- The script should be narrated by a single person with background video and overlaid text.
- Use Markdown tables to clearly structure your script. No html

**Query:** ${query}

**Context:** ${context}\n`,
            },
        ],
        model: "llama3-8b-8192",
    });
}



export async function POST(request) {
    const { query, context } = await request.json();
    if (query == "") {
        return NextResponse.json({ response: "Please enter a query" });
    }
    if (context) {
        return NextResponse.json({ response: await getResponse(query, context) });
    } else {
        return NextResponse.json({ response: await getResponse(query, "Use your imagination") });
    }
}