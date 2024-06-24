import { useEffect } from 'react';
import toast from 'react-hot-toast';

const getTrendingTopics = async (latitude, longitude, location, setLocation, setSuggestions) => {
    try {
        if (location === "") {
            const loadingToast = toast.loading("Determining location...");
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await response.json();

            if (!data.countryName) {
                toast.error("Unable to determine location");
                setLocation("IN");
                toast.dismiss(loadingToast);
                return;
            }
            setLocation(data.countryCode);
            toast.dismiss(loadingToast);
            toast.success(`Location found: ${data.countryName}/${data.locality}`);
        }

        const fetchingToast = toast.loading(`Fetching trending topics based on ${location === "" ? "determined location" : "selected location: " + location}...`);
        const res = await fetch(`/api/trending`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ location: location === "" ? data.countryCode : location }),
        });

        if (!res.ok) {
            toast.error("Failed to fetch trending topics");
            return;
        }

        const result = await res.json();
        setSuggestions(result.response);
        toast.dismiss(fetchingToast);
        toast.success(`Trending topics found based on ${location === "" ? data.countryName : location}`);
    } catch (error) {
        console.error("Error in getTrendingTopics:", error);
        toast.error("An error occurred while fetching trending topics");
    }
};

const useTrendingTopics = (location, setLocation, setSuggestions) => {
    useEffect(() => {
        const fetchLocationAndTrendingTopics = () => {
            if (location !== "") {
                getTrendingTopics(null, null, location, setLocation, setSuggestions);
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        getTrendingTopics(latitude, longitude, location, setLocation, setSuggestions);
                    },
                    (error) => {
                        console.error("Error getting geolocation", error);
                        toast.error("Error getting your location. Using default location (IN).");
                        setLocation("IN");
                        getTrendingTopics(null, null, "IN", setLocation, setSuggestions);
                    }
                );
            }
        };

        fetchLocationAndTrendingTopics();
    }, [location, setLocation, setSuggestions]);
};

export default useTrendingTopics;
