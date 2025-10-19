"use client"

import useLocalStorage from "../hooks/useLocalStorage";
import AdaptiveQuizLive from "./_components/AdaptiveQuizLive";

export default function Page(){
    const [selectedTimeline] = useLocalStorage("Timeline", null);
    const [selectedCountry] = useLocalStorage("selectedCountry", null);
    const [selected] = useLocalStorage("Menu", null);
    if (selected == "General"){
        return(
        <div>
            {selectedCountry}
            {selected}
        </div>
    )
    }
    return(
        <div>
            {selectedCountry}
            {selectedTimeline}
            {selected}
            <AdaptiveQuizLive />
        </div>
    )
}