"use client"

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
import { TemperatureRecord } from "../lib/definitions";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";

interface SideNavProps {
  sendDataToParent: (tempData: TemperatureRecord[]) => void;
}

export default function SideNav({ sendDataToParent }: SideNavProps) {

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [tempData, setTempData] = useState<TemperatureRecord[]>([]);

  const handleYearChange = (value: string) => {
    setYear(value);
  }

  const handleMonthChange = (value: string) => {
    setMonth(value);
  }
  // for testing
  // console.log(`Year: ${year}, Month: ${month}`)
  useEffect(() => {
    const fetchTemperatureData = async (yearMonth: string) => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/mean_temperature/${yearMonth}`)
        const data = await res.json();
        setTempData(data);
      } catch (error) {
        console.log('Error fetching data: ', error);
      }
    };
    if (year && month) {
      const yearMonth: string = year + month;
      fetchTemperatureData(yearMonth);
    }
  }, [year, month])

  useEffect(() => {
    if (tempData) {
      sendDataToParent(tempData);
    }

  }, [tempData, sendDataToParent])



  return (
    <div className="flex flex-col h-screen backdrop-blur-md px-3 py-4 md:px-2 float-right">
      {/* Urban Key Data Point */}
      <div className="bg-white rounded-lg min-w-[300px] text-black mb-5">
        <div className="px-6 py-4">
          <div className="font-bold text-lg mb-4">Urban Key Data Point</div>
          <div className="flex flex-row gap-3">
            <Select onValueChange={handleYearChange}>
              <SelectTrigger className="w-full bg-teal-500 text-white font-semibold focus:outline-gray-500">
                <SelectValue placeholder="Years" />
              </SelectTrigger>
              <SelectContent>
                {
                  years.map((year, id) => {
                    return <SelectItem value={year} key={id}>{year}</SelectItem>
                  })
                }
              </SelectContent>
            </Select>
            <Select onValueChange={handleMonthChange}>
              <SelectTrigger className="w-full bg-teal-500 text-white font-semibold focus:outline-gray-500">
                <SelectValue placeholder="Months" />
              </SelectTrigger>
              <SelectContent>
                {
                  months.map((month, id) => {
                    return <SelectItem value={month} key={id}>{month}</SelectItem>
                  })
                }
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

              <Switch id="heat_spot"/>
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
              <StatsListItem image_src="tree-fill" title="Planted Trees" statistics={0} arrow_up_down="arrow_up_green" growth_percentage={1} />
              <StatsListItem image_src="tree-notfill" title="Total Number of Trees" statistics={100000} arrow_up_down="arrow_up_green" growth_percentage={1} />
              <StatsListItem image_src="tree-notfill" title="Annual Number of Trees" statistics={5000} arrow_up_down="arrow_up_green" growth_percentage={5} />
              <StatsListItem image_src="cloud" title="Annual Carbon Sequestration (kg CO2)" statistics={5000} arrow_up_down="arrow_down_green" growth_percentage={1} />
              <StatsListItem image_src="air" title="Air Pollutants Removed (kg/year)" statistics={200} arrow_up_down="arrow_down_green" growth_percentage={1} />
              <StatsListItem image_src="storm-water" title="Stormwater Runoff Reduction (m3/year)" statistics={1000} arrow_up_down="arrow_down_green" growth_percentage={5} />
              <StatsListItem image_src="temperature" title="Average Temperature Reduction (C)" statistics={1.5} arrow_up_down="arrow_down_green" growth_percentage={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
