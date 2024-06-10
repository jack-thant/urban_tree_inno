import LocationAggregatorMap from "@/app/ui/map"
import WelcomeModel from "./ui/WelcomeModel"

export default function HomePage() {
    
    return (
        <>
           <WelcomeModel/>
            <div className="relative min-h-screen">
                <LocationAggregatorMap />
            </div>
        </>
    )
}