import Image from "next/image";
import StatsListItem from "./statsListItem";

export default function SideNav() {
  return (
    <div className="flex flex-col h-screen backdrop-blur-md px-3 py-4 md:px-2 float-right">
      {/* Urban Key Data Point */}
      <div className="bg-white rounded-lg min-w-[300px] text-black mb-5">
        <div className="px-6 py-4">
          <div className="font-bold text-lg mb-4">Urban Key Data Point</div>
          <button
            type="button"
            className="inline-flex justify-between w-full rounded-md bg-teal-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-teal-500 hover:bg-white hover:text-black"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            <p>2024 (Today)</p>
            <svg
              className="-mr-1 h-5 w-5 text-white hover:text-black"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          {/* Heat spot data */}
          <div className="flex flex-col">
            <div className="flex flex-row justify-between gap-y-5 mt-4">
              <div className="inline-flex items-center">
                <Image
                  src="./urban_key_data/sun.svg"
                  width={20}
                  height={20}
                  alt="Icon of Heat Spot Data"
                />
                <p className="font-semibold text-sm ml-3">Heat Spot Data</p>
              </div>

              <label htmlFor="one" className="mt-1">
                <input id="one" type="checkbox" />
              </label>
            </div>
          </div>
          {/* Population Density Area */}
          <div className="flex flex-col">
            <div className="flex flex-row justify-between gap-y-5 mt-4">
              <div className="inline-flex items-center">
                <Image
                  src="./urban_key_data/population.svg"
                  width={22}
                  height={19}
                  alt="Icon of Population Density Data"
                />
                <p className="font-semibold text-sm  ml-3">
                  Population Density Data
                </p>
              </div>

              <label htmlFor="one" className="mt-1">
                <input id="one" type="checkbox" />
              </label>
            </div>
          </div>
          {/* High Value Estate */}
          <div className="flex flex-col">
            <div className="flex flex-row justify-between gap-y-5 mt-4">
              <div className="inline-flex items-center">
                <Image
                  src="./urban_key_data/estate.svg"
                  width={18}
                  height={20}
                  alt="Icon of High Value Estate Data"
                />
                <p className="font-semibold text-sm ml-3">
                  High Value Estate Data
                </p>
              </div>

              <label htmlFor="one" className="mt-1">
                <input id="one" type="checkbox" />
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Impact Assessment */}
      <div className="bg-white rounded-lg text-black min-w-[300px] overflow-auto">
        <div className="px-6 py-4">
          <div className="font-bold text-lg mb-4">Impact Assessment</div>
          <div className="flex flex-col">
            <div className="flex flex-col justify-between gap-y-5 mt-2">
              <StatsListItem image_src="tree-fill" title="Planted Trees" statistics={0} arrow_up_down="arrow_up_green" growth_percentage={1}/>
              <StatsListItem image_src="tree-notfill" title="Total Number of Trees" statistics={100000} arrow_up_down="arrow_up_green" growth_percentage={1}/>
              <StatsListItem image_src="tree-notfill" title="Annual Number of Trees" statistics={5000} arrow_up_down="arrow_up_green" growth_percentage={5}/>
              <StatsListItem image_src="cloud" title="Annual Carbon Sequestration (kg CO2)" statistics={5000} arrow_up_down="arrow_down_green" growth_percentage={1}/>
              <StatsListItem image_src="air" title="Air Pollutants Removed (kg/year)" statistics={200} arrow_up_down="arrow_down_green" growth_percentage={1}/>
              <StatsListItem image_src="storm-water" title="Stormwater Runoff Reduction (m3/year)" statistics={1000} arrow_up_down="arrow_down_green" growth_percentage={5}/>
              <StatsListItem image_src="temperature" title="Average Temperature Reduction (C)" statistics={1.5} arrow_up_down="arrow_down_green" growth_percentage={1}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
