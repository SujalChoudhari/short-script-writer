/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1P69iH8R3eQ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, SearchCheckIcon, SearchSlash, SearchSlashIcon, Sparkles, Star, Youtube } from "lucide-react"
import toast from "react-hot-toast"
import Markdown from "react-markdown"
import gfm from "remark-gfm";
import axios from "axios"
import cheerio from 'cheerio';
import { countries } from "./countries"
import { Combobox } from "@/components/combobox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { fromJSON } from "postcss"

export default function MainPage() {
    const [location, setLocation] = useState("")
    const [output, setOutput] = useState("")
    const queryRef = useRef(null);
    const contextRef = useRef(null);
    const websiteRef = useRef(null);
    const [scraping, setScraping] = useState(false);
    const [suggestions, setSuggestions] = useState([])


    useEffect(() => {
        const getTrendingTopics = async () => {
            try {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    if (location == "") {
                        const loadingToast  = toast.loading("Determining location...");
                        // Use a reverse geocoding service to get the country code
                        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                        const data = await response.json();

                        if (!data.countryName) {
                            toast.error("Unable to determine location");
                            return;
                        }
                        setLocation(data.countryCode);
                        toast.dismiss(loadingToast);
                        toast.success(`Location found: ${data.countryName}/${data.locality}`);

                        const fetchingToast = toast.loading("Fetching trending topics...");
                        const res = await fetch(`/api/trending`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ location: data.countryCode }),
                        });
                        if (!res.ok) {
                            toast.error("Failed to fetch trending topics");
                            return;
                        }
                        const result = await res.json();
                        setSuggestions(result.response);
                        toast.dismiss(fetchingToast);
                        toast.success(`Trending topics found based in: ${data.countryName}`);
                    } else {
                        const loadingToast = toast.loading("Fetching trending topics based o selected location: " + location);
                        const res = await fetch(`/api/trending`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ location: location }),
                        });
                        if (!res.ok) {
                            toast.error("Failed to fetch trending topics");
                            return;
                        }
                        const result = await res.json();
                        setSuggestions(result.response);
                        toast.dismiss(loadingToast);
                        toast.success(`Trending topics found based in: ${location}`);
                    }

                }, (error) => {
                    console.error("Error getting geolocation", error);
                    toast.error("Error getting your location");
                });
            } catch (error) {
                console.error("Error in getTrendingTopics:", error);
                toast.error("An error occurred while fetching trending topics");
            }
        };

        getTrendingTopics();
    }, [location]);

    const onGeneratePressed = async (query, context) => {
        const t1 = toast.loading("Generating script...")
        const res = await fetch(`api/groq`, {
            method: "POST",
            body: JSON.stringify({ query, context }),
        })
        toast.dismiss(t1)
        if (res.ok) {
            const data = await res.json()
            setOutput(data.response)
            console.log(data.response)
            toast.success("Script generated")
        } else {
            toast.error(res.statusText)
        }
    }
    const onQuerySubmit = async () => {
        const query = queryRef.current.value;
        const context = contextRef.current.value;
        if (query == "") {
            toast.error("Please enter a query")
        }
        const t1 = toast.loading("Generating script...")
        const res = await fetch(`api/groq`, {
            method: "POST",
            body: JSON.stringify({ query, context: context.slice(0, 600) }),
        })
        toast.dismiss(t1)
        if (res.ok) {
            const data = await res.json()
            setOutput(data.response)
            console.log(data.response)
            toast.success("Script generated")
        } else {
            toast.error(res.statusText)
        }
    }

    const handleScrapeWebsite = async () => {
        const websiteUrl = websiteRef.current.value.trim();

        if (!websiteUrl) {
            toast.error('Please enter a valid website URL');
            return;
        }

        setScraping(true);
        const scrapingToast = toast.loading('Scraping website...');

        try {
            const response = await axios.get(websiteUrl, { timeout: 10000 }); // 10 second timeout
            const htmlContent = response.data;

            // Use cheerio to load the HTML content
            const $ = cheerio.load(htmlContent);

            // Remove all script, style, and other non-text nodes
            $('script, style, link, meta, noscript, svg, image, video, audio, iframe, object, embed, canvas, map, area').remove();

            // Extract readable text content
            let readableText = $('body').text();

            // remove lines with only 3 or less words
            const lines = readableText.split('\n');
            const filteredLines = lines.filter((line) => {
                const words = line.trim().split(/\s+/);
                return words.length > 2;
            });
            readableText = filteredLines.join('\n');

            // Update context input field with cleaned up text
            contextRef.current.value = readableText.trim();
            toast.success('Website scraped successfully');
        } catch (error) {
            console.error('Error scraping website:', error);
            toast.error('Failed to scrape website. Paste the context manually');
        }
        toast.dismiss(scrapingToast);
        setScraping(false);
    };


    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 shadow-md p-6">
                <h1 className="text-3xl font-bold text-white flex items-center"><Youtube className="inline-block mr-4" /> Shorts Script Generator</h1>
                <Card className="max-w-full mx-4 my-8">
                    <CardContent className="">
                        <CardTitle className="text-white py-4">Generate Script</CardTitle>
                        <div className="flex justify-evenly">
                            <input
                                type="text"
                                placeholder="Website (optional) The website will be scraped for context"
                                className=" w-full flex-grow px-4 py-2 rounded-md border text-white bg-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                ref={websiteRef}
                            />
                            <button
                                className="flex ml-4 items-center justify-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                                onClick={handleScrapeWebsite}
                                disabled={scraping}
                            >
                                {scraping ? <SearchSlashIcon/>   : <SearchCheckIcon/>}
                            </button>

                        </div>
                        <textarea
                            cols={20}
                            rows={5}
                            placeholder="Context (optional) Scraped context appears here, add additional context to use in the script"
                            className="flex-grow px-4 my-4 py-2 w-full rounded-md border text-white bg-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            ref={contextRef}
                        />
                        <div className="flex justify-evenly">
                            <input
                                type="text"
                                placeholder="A reel about biggest car fails"
                                className=" w-full flex-grow px-4 py-2 rounded-md border text-white bg-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                ref={queryRef}
                            />
                            <button
                                className="flex ml-4 items-center justify-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                                onClick={onQuerySubmit}
                            >
                                <Sparkles className="h-5 w-5" />
                            </button>
                        </div>
                       
                        
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-8 mb-8 p-6">
                <Markdown remarkPlugins={[gfm]}>{output || "Generated output will be shown here..."}</Markdown>
            </Card>

            <div className="flex justify-between">
                <h2 className="text-2xl font-bold mb-4 text-white">Trending Topics in <Combobox list={countries} setLocation={setLocation} location={location}></Combobox></h2>
            </div>
            <div className="">
                {/* {JSON.stringify(suggestions)} */}
                {typeof suggestions === 'object' && suggestions.map((suggestion, index) => (
                    <Card key={index} className="shadow-lg rounded-md my-4 overflow-hidden">
                        <CardContent className="p-4">
                            <h3 className="text-2xl font-bold">{suggestion.title}</h3>
                            <div className="flex items-center w-full justify-between align-middle">
                                <Markdown>{JSON.stringify(suggestion.res)}</Markdown>
                                <Button className="mt-4" onClick={() => onGeneratePressed(suggestion.res, JSON.stringify(suggestion.snippets))}>Generate Script</Button>
                            </div>
                            <Card className="mt-4">
                                <CardContent>
                                    <Accordion type="single" collapsible className="mt-4 w-full">
                                        <h3 className="text-lg font-bold">Articles used for generating the query:</h3>
                                        {suggestion.snippets && suggestion.snippets?.map((snippet, index) => (
                                            <AccordionItem value={index.toString()} >
                                                <AccordionTrigger>{snippet.title}</AccordionTrigger>
                                                <AccordionContent className="text-sm ml-2 text-wrap max-w-3xl" ><Markdown>{snippet.snippet}</Markdown></AccordionContent>
                                            </AccordionItem >
                                        ))}

                                    </Accordion>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                ))}
                {
                    typeof suggestions === 'string' && <h3 className="text-xl font-bold text-red-400">
                        {suggestions} <br/><br/>
                        TL;DR: The country is not supported.
                    </h3>
                }
            </div>

        </div>
    )
}