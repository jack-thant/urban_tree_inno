import LocationAggregatorMap from "@/app/ui/map"
import WelcomeModel from "./ui/WelcomeModel"

import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Leaf it to Us: Home Page',
  description: 'Leaf it to us provides users with a comprehensive visualization of environmental data, including heat maps, tree data, and Urban Heat Island (UHI) intensity.',
}

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