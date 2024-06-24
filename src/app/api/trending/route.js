import { NextResponse } from "next/server";
import googleTrends from "google-trends-api";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getTrendingTopics(location) {
    return new Promise((resolve, reject) => {
        googleTrends.dailyTrends(
            {
                geo: location,
            },
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(results));
                }
            }
        );
    });
}

export async function getQueriesForTopics(query,snippets) {
    const chatCompletion = await getGroqChatCompletion(query,snippets);
    return chatCompletion.choices[0]?.message?.content || "";
}

export async function getGroqChatCompletion(query, snippets) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `You have to write down example query for the given topic:
Example for topic "IPhone":
\`\`\` What's wrong with the newest Iphone? \`\`\`
These queries will be fed to ChatGPT for generating a script for a youtube short
Hence write a 1 sentence query which can prompt ChatGPT to write a script based on the hot topics.
No extra words in response required, example "Here is ..." Words are expensive.
Topic: "${query}"
Here is the context for the topic:
${snippets}
`
            },
        ],
        model: "llama3-8b-8192",
    });
}

export async function POST(request) {
    const { location } = await request.json();
    if (!location) {
        return NextResponse.json({ response: "Please enter a location" });
    }
    try {
        const trendingTopics = await getTrendingTopics(location);
        console.log(trendingTopics)
        const topics = [...new Set(trendingTopics.default?.trendingSearchesDays[0]?.trendingSearches.slice(0, 4) || [])]
        // Define an array of promises for each API call to getQueriesForTopics
        const promises = [];
        for (const topic of topics) {
            let snippets = "";
            let jsonSnippets = [];
            for (const article of topic.articles) {
                snippets += `- **${article.title}**:\n ${article.snippet}\n  \n  `
                jsonSnippets.push({ title: article.title, snippet: article.snippet })
            }
            promises.push({
                title: topic.title.query,
                res: await getQueriesForTopics(topic.title.query, snippets.slice(0, 1000)),
                snippets: jsonSnippets
            });
        }

        // Execute all promises concurrently
        const topicsWithQueries = await Promise.all(promises);

        return NextResponse.json({ response: topicsWithQueries });
    } catch (error) {
        return NextResponse.json({ response: `Error fetching trending topics: ${error}` });
    }
}
