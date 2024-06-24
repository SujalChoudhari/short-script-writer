import { NextResponse } from "next/server";
import googleTrends from "google-trends-api";

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

export async function POST(request) {
    const { location } = await request.json();
    if (!location) {
        return NextResponse.json({ response: "Please enter a location" });
    }
    try {
        const trendingTopics = await getTrendingTopics(location);
        return NextResponse.json({ response: trendingTopics });
    } catch (error) {
        return NextResponse.json({ response: `Error fetching trending topics: ${error.message}` });
    }
}
