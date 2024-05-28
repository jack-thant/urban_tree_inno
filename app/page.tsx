import LocationAggregatorMap from "@/app/ui/map";
import { promises as fs } from 'fs';

export default async function HomePage() {
    return (
        <>
            <div className="relative min-h-screen">
                <LocationAggregatorMap />
            </div>
        </>
    )
}