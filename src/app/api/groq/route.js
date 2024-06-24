
import {load_dotenv} from "dotenv";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// load_dotenv();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getResponse(query) {
    const chatCompletion = await getGroqChatCompletion(query);
    return chatCompletion.choices[0]?.message?.content || "";
}

export async function getGroqChatCompletion(query) {
    console.log(query)
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: query,
            },
        ],
        model: "llama3-8b-8192",
    });
}


export async function POST(request) {
    const { query } = await request.json();
    if (query == "") {
        return NextResponse.json({ response: "Please enter a query" });
    }
    return NextResponse.json({ response: await getResponse(query) });
}