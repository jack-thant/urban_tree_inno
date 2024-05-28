interface LegendProps {
    colorRange: Array<string>
}

export default function Legend({ colorRange }: LegendProps) {
    return (
        <div className="bg-white rounded-lg w-full text-black mb-5 md:px-2">
            <div className="px-6 py-5">
                <h1 className="font-bold text-lg mb-4">Legends</h1>
                <div className="flex flex-row">
                    {colorRange.map((color, id) => (
                        <div
                            key={id}
                            style={{ backgroundColor: color }}
                            className="w-[60px] h-[50px]"
                        ></div>
                    ))}

                </div>
            </div>

        </div>
    )
}