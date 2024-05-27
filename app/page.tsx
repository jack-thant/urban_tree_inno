import LocationAggregatorMap from "@/app/ui/map";

export default async function HomePage() {
    return (
        <>
            <div className="relative min-h-screen">
                <LocationAggregatorMap />
            </div>
        </>
    )
}