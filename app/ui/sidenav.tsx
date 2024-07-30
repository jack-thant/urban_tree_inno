"use client";

import Image from "next/image";
import StatsListItem from "./statsListItem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { years, months } from "@/constants/yearMonth";
import { useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import Legend from "./legend";
import { ImpactAssessment, InterpolatedTempRecord } from "../lib/definitions";
import { heatMapColorRange, heatMapLegendTitle } from "@/constants/config";
import config from "@/lib/config";

interface SideNavProps {
  sendDataToParent: (tempData: InterpolatedTempRecord[]) => void;
  heatSpotChecked: (checked: boolean) => void;
  impactStats: ImpactAssessment | null | undefined;
  view: string;
  district: string;
}

export default function SideNav({
  sendDataToParent,
  heatSpotChecked,
  impactStats,
  view,
  district,
}: SideNavProps) {
  const [year, setYear] = useState(years[0]);
  const [month, setMonth] = useState(months[2]);
  const [tempData, setTempData] = useState<InterpolatedTempRecord[]>([]);
  const [toggleHeatSpot, setHeatSpot] = useState<boolean>(false);
  const [minTemperature, setMinTemperature] = useState<number>(0);
  const [maxTemperature, setMaxTemperature] = useState<number>(0);

  const handleYearChange = (value: string) => {
    setYear(value);
  };

  const handleMonthChange = (value: string) => {
    setMonth(value);
  };

  const handleHeatSpotCheckedChange = (checked: boolean) => {
    if (year && month) {
      setHeatSpot(checked);
    }
  };
  // for testing
  // console.log(`Year: ${year}, Month: ${month}`)
  useEffect(() => {
    if (view == "Island Urban View") {
      const fetchTemperatureData = async (yearMonth: string) => {
        try {
          const res = await fetch(
            `${config.apiUrl}/mean_temperature/${yearMonth}`
          );
          const data = await res.json();
          setMinTemperature(data.min_temp);
          setMaxTemperature(data.max_temp);
          setTempData(data.data);
        } catch (error) {
          console.log("Error fetching data: ", error);
        }
      };
      if (year && month) {
        const yearMonth: string = year + month;
        fetchTemperatureData(yearMonth);
      }
    }
    else if (view == "District Urban View") {
      const fetchTemperatureData = async (yearMonth: string) => {
        try {
          const res = await fetch(
            `${config.apiUrl}/mean_temperature/${district}/${yearMonth}`
          );
          const data = await res.json();
          setMinTemperature(data.min_temp);
          setMaxTemperature(data.max_temp);
          setTempData(data.data);
        } catch (error) {
          console.log("Error fetching data: ", error);
        }
      };
      if (year && month && district) {
        const yearMonth: string = year + month;
        fetchTemperatureData(yearMonth)
      }
    }
  }, [year, month, view, district]);

  useEffect(() => {
    if (tempData) {
      sendDataToParent(tempData);
    }
  }, [tempData, sendDataToParent]);

  useEffect(() => {
    heatSpotChecked(toggleHeatSpot);
  }, [toggleHeatSpot, heatSpotChecked]);

  return (
    <div className="flex flex-col h-screen backdrop-blur-md p-4 md:px-2 border-l-4 border-white max-w-[25rem] absolute top-0 right-0 z-10">
      {/* Urban Key Data Point */}
      <div className="bg-white rounded-lg min-w-[300px] text-black mb-5">
        <div className="px-6 py-4">
          <div className="font-bold text-lg mb-4">Urban Key Data Point</div>
          <div className="flex flex-row gap-3">
            <Select onValueChange={handleYearChange} defaultValue={year}>
              <SelectTrigger className="w-full bg-teal-500 text-white font-semibold focus:outline-gray-500">
                <SelectValue placeholder="Years" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year, id) => {
                  return (
                    <SelectItem value={year} key={id}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select onValueChange={handleMonthChange} defaultValue={month}>
              <SelectTrigger className="w-full bg-teal-500 text-white font-semibold focus:outline-gray-500">
                <SelectValue placeholder="Months" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, id) => {
                  return (
                    <SelectItem value={month} key={id}>
                      {month}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

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

              {year && month && (
                <Switch
                  id="heat_spot"
                  onCheckedChange={handleHeatSpotCheckedChange}
                />
              )}
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

              {year && month && <Switch id="population-density" />}
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

              {year && month && <Switch id="high-value-estate" />}
            </div>
          </div>
        </div>
      </div>
      {/* Impact Assessment */}
      {impactStats && (
        <div className="bg-white rounded-lg text-black min-w-[300px] overflow-auto">
          <div className="px-6 py-4">
            <div className="font-bold text-lg mb-4">Impact Assessment</div>
            <div className="flex flex-col">
              <div className="flex flex-col justify-between gap-y-5 mt-2">
                <StatsListItem
                  image_src="tree-fill"
                  title="Planted Trees"
                  statistics={impactStats.planted_trees}
                  arrow_up_down="arrow_up_green"
                  growth_percentage={1}
                />
                <StatsListItem
                  image_src="tree-notfill"
                  title="Total Number of Trees"
                  statistics={impactStats.totalNumberOfTrees[0]}
                  arrow_up_down="arrow_up_green"
                  growth_percentage={Number(
                    impactStats.totalNumberOfTrees[1].toFixed(2)
                  )}
                />
                <StatsListItem
                  image_src="bolt"
                  title="Annual Energy Saved"
                  statistics={impactStats.annualEnergySaved}
                  arrow_up_down="arrow_up_green"
                  growth_percentage={5}
                />
                <StatsListItem
                  image_src="cloud"
                  title="Annual Carbon Sequestration (kg CO2)"
                  statistics={impactStats.annualCarbonSequestration}
                  arrow_up_down="arrow_down_green"
                  growth_percentage={1}
                />
                <StatsListItem
                  image_src="air"
                  title="Air Pollutants Removed (kg/year)"
                  statistics={impactStats.airPollutantsRemoved}
                  arrow_up_down="arrow_down_green"
                  growth_percentage={1}
                />
                <StatsListItem
                  image_src="storm-water"
                  title="Stormwater Runoff Reduction (m3/year)"
                  statistics={impactStats.stormWaterRunOffReduction}
                  arrow_up_down="arrow_down_green"
                  growth_percentage={5}
                />
                <StatsListItem
                  image_src="temperature"
                  title="Average Temperature Reduction (C)"
                  statistics={impactStats.averageTemperatureReduction}
                  arrow_up_down="arrow_down_green"
                  growth_percentage={1}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {toggleHeatSpot && (
        <Legend
          colorRange={heatMapColorRange}
          numberLegend={[
            Number(minTemperature.toFixed(2)),
            Number(maxTemperature.toFixed(2)),
          ]}
          title={heatMapLegendTitle}
        />
      )}
    </div>
  );
}
