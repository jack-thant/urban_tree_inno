import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex flex-row gap-4 p-4 h-screen">
            <Skeleton className="w-full rounded-xl" />
            <Skeleton className="w-full rounded-xl" />
        </div>
    )
}