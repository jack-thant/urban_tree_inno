interface LegendProps {
    colorRange: Array<string>
    numberLegend: Array<number>
    title: string
}

export default function Legend({ colorRange, numberLegend, title }: LegendProps) {
    return (
        <div className="bg-white rounded-lg w-full text-black mb-5 md:px-2">
            <div className="px-6 py-5">
                <h1 className="font-bold text-lg mb-4">{ title }</h1>
                <div className="flex flex-row">
                    {colorRange.map((color, id) => (
                        <div
                            key={id}
                            style={{ backgroundColor: color }}
                            className="w-[60px] h-[50px]"
                        ></div>
                    ))}
                </div>
                <div className="flex flex-row gap-[38px] mt-1">
                    {
                        numberLegend.map((legend, id) => {
                            return (
                                <p key= {id} className='font-bold'>
                                    { legend }
                                </p>
                            )
                        })
                    }

                </div>  
            </div>

        </div>
    )
}