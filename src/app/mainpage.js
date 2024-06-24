/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1P69iH8R3eQ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Youtube } from "lucide-react"
import toast from "react-hot-toast"
import Markdown from "react-markdown"

export default function MainPage() {
    const [showDetails, setShowDetails] = useState(false)
    const [output, setOutput] = useState("")
    const queryRef = useRef(null);
    const suggestions = [
        {
            title: "Cozy Mountain Retreat",
            description: "Escape to a serene mountain oasis with breathtaking views.",
        },
        {
            title: "Beachfront Bungalow",
            description: "Wake up to the sound of the waves in this charming bungalow.",
        },
        {
            title: "Urban Loft",
            description: "Experience city living in this modern and stylish loft.",
        },
        {
            title: "Countryside Cottage",
            description: "Unwind in the peaceful countryside in this cozy cottage.",
        },
    ]

    const onQuerySubmit = async () => {
        const query = queryRef.current.value;
        if (query == "") {
            toast.error("Please enter a query")
        }
        const t1 = toast.loading("Generating script...")
        const res = await fetch(`api/groq`, {
            method: "POST",
            body: JSON.stringify({ query }),
        })
        if (res.ok) {
            const data = await res.json()
            setOutput(data.response)
            console.log(data.response)
            toast.dismiss(t1)
            toast.success("Script generated")
        } else {
            toast.error(res.statusText)
        }
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center"><Youtube className="inline-block mr-4" /> Shorts Script Generator</h1>
                <div className="relative w-full max-w-lg">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="A reel about biggest car fails"
                            className="flex-grow mr-4 px-4 py-2 rounded-md border text-white bg-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            ref={queryRef}
                        />
                        <Button variant="outline" className="text-white" onClick={onQuerySubmit}>
                            <Search />
                        </Button>
                    </div>
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Trending Topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {suggestions.map((suggestion, index) => (
                    <Card key={index} className="shadow-lg rounded-md overflow-hidden">
                        <CardContent className="p-4">
                            <h3 className="text-lg font-bold">{suggestion.title}</h3>
                            <p className="text-gray-500 mb-4">{suggestion.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card className="mt-8 p-6">
                <Markdown>{output}</Markdown>
            </Card>
        </div>
    )
}