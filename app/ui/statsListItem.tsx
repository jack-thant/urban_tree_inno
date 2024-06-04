import Image from "next/image";

interface StatsListItemProps {
  image_src: string;
  title: string;
  statistics: number;
  arrow_up_down: "arrow_up_green" | "arrow_down_green";
  growth_percentage: number;
}

export default function StatsListItem({
  image_src,
  title,
  statistics,
  arrow_up_down,
  growth_percentage,
}: StatsListItemProps) {

    const growthText = arrow_up_down === 'arrow_up_green' ? `(+${growth_percentage}%)`: `(-${growth_percentage}%)`
  return (
    <>
      <div className="inline-flex items-center justify-between w-full">
        <div className="flex flex-row align-middle max-w-[200px]">
          <Image
            src={`./impact_assess/${image_src}.svg`}
            width={20}
            height={20}
            alt={image_src}
          />
          <p className="font-semibold text-sm ml-3 text-pretty break-words">{title}</p>
        </div>
        <div className="flex flex-row">
          <p className="font-bold text-sm ml-3">{statistics.toFixed(2)}</p>
          <Image
            src={`./impact_assess/${arrow_up_down}.svg`}
            width={20}
            height={20}
            alt={arrow_up_down}
            className="ml-5"
          />
          <p className="font-bold text-sm ml-3 text-teal-500">
            {growthText}
          </p>
        </div>
      </div>
    </>
  );
}
