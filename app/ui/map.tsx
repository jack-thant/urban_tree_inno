"use client"

import Map, { Marker, NavigationControl, useMap } from 'react-map-gl';
import { DeckGL } from '@deck.gl/react';
import "mapbox-gl/dist/mapbox-gl.css";
import { lightingEffect, material, INITIAL_VIEW_STATE, colorRange } from "@/app/lib/mapconfig";
import SideNav from './sidenav';
import { useState } from 'react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { ImpactAssessment, InterpolatedTempRecord, MarkerPosition } from '../lib/definitions';
import Image from 'next/image';
import { PickingInfo } from '@deck.gl/core';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from 'next/link';
import { ScreenGridLayer } from '@deck.gl/aggregation-layers';

export default function LocationAggregatorMap() {

    const [tempDataFromSideNav, setTempDataFromSideNav] = useState<InterpolatedTempRecord[]>([]);
    const [toggleHeatSpotFromSideNav, setHeatSpotFromSideNav] = useState<boolean>();
    const [markers, setMarkers] = useState<number[][]>([]);
    const [lastAddedMarkerIndex, setLastAddedMarkerIndex] = useState<number | null>(null);
    const [impactAssessment, setImpactAssessment] = useState<ImpactAssessment>();
    const [popoverOpen, setPopoverOpen] = useState<number | null>(null);
    const [totalTreesPlanted, setTotalTreesPlanted] = useState<number>(0);

    const handleTempDataFromSideNav = (data: InterpolatedTempRecord[]) => {
        setTempDataFromSideNav(data);
    }

    const handleHeatSpotToggleFromSideNav = (checked: boolean) => {
        setHeatSpotFromSideNav(checked);
    }
    // Filter out records with null meanTemperature values
    const filteredData = tempDataFromSideNav.filter(e => e['Mean Temperature'] !== null)

    const layers = toggleHeatSpotFromSideNav && filteredData ? [
        new ScreenGridLayer<InterpolatedTempRecord>({
            id: 'heat-map-grid',
            data: filteredData,
            opacity: 0.8,
            getPosition: d => [d.lon, d.lat],
            getWeight: d => d['Mean Temperature'],
            cellSizePixels: 10,
            aggregation: "MEAN",
        })
    ] : [];

    // Function to handle clicks on the map
    const handleMapClick = (info: PickingInfo<MarkerPosition>) => {

        console.log(info.coordinate);
        // Get the position from the click event
        const position: number[] | undefined = info.coordinate;

        // Check if the position is valid and has exactly two elements (longitude and latitude)
        if (position && position.length === 2) {
            // Disable the handleEvent if the coordinates exceed the specified limits
            if (position[0] > 103.9 && position[1] > 1.42) {
                return;
            }

            // Update the state to add the new marker position
            setMarkers((prevMarkers) => {
                const newMarkers = [...prevMarkers, position];
                setLastAddedMarkerIndex(newMarkers.length - 1);
                setPopoverOpen(newMarkers.length - 1);
                return newMarkers;
            });
        }
    };
    const handleSubmitTrees = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Access form data using event.currentTarget
        const formData = new FormData(event.currentTarget);
        const trees = Number(formData.get('trees'));

        // Update total trees planted
        const newTotalTreesPlanted = totalTreesPlanted + trees;
        setTotalTreesPlanted(newTotalTreesPlanted);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/impact_assessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ number_of_trees: newTotalTreesPlanted })
            })
            if (!response.ok) {
                throw new Error('Cannot fetch the data');
            }
            const data: ImpactAssessment = await response.json();
            console.log('Response from the backend API: ', data);

            setImpactAssessment(data);
            setPopoverOpen(null);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    return (
        <>
            <div>
                <DeckGL
                    effects={[lightingEffect]}
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={true}
                    layers={layers}
                    onClick={handleMapClick}
                >
                    <Map
                        reuseMaps
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                        // mapStyle="https://www.onemap.gov.sg/maps/json/raster/mbstyle/Night.json"
                        mapStyle="mapbox://styles/mapbox/outdoors-v12"
                    // mapStyle="mapbox://styles/mapbox/dark-v11"
                    >
                        <NavigationControl
                            position='bottom-left' />
                        {markers.map((marker, index) => (
                            <Marker key={index} longitude={marker[0]} latitude={marker[1]} anchor="bottom">
                                <Popover open={lastAddedMarkerIndex === index && popoverOpen === index}>
                                    <PopoverTrigger asChild>
                                        <Image src="./mingcute_tree-2-fill.svg" width={40} height={40} alt="marker" />
                                    </PopoverTrigger>
                                    <PopoverContent className='w-80'>
                                        <form onSubmit={handleSubmitTrees}>
                                            <div className="grid gap-4 p-2">
                                                <h2 className="font-bold text-lg leading-none text-teal-500">Plant Trees</h2>
                                                <div className="grid gap-2">
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                        <Label htmlFor="width" className="leading-5">Number of Trees: </Label>
                                                        <Input
                                                            type='number'
                                                            id="trees"
                                                            name='trees'
                                                            defaultValue={100}
                                                            className="col-span-2 h-8"
                                                        />
                                                    </div>
                                                    <Button type='submit' className='bg-teal-500 mt-3'>Submit</Button>
                                                </div>
                                            </div>
                                        </form>
                                    </PopoverContent>
                                </Popover>

                            </Marker>
                        ))}
                    </Map>

                    <div className="absolute text-white min-h-[100px] top-10 left-10 rounded-lg p-4 text-sm bg-white">
                        <div className="flex flex-row">
                            <Image
                                src="./mingcute_tree-2-fill.svg"
                                width={27}
                                height={27}
                                alt="Urban Tree Inno Logo"
                            />
                            <h1 className="font-bold md:text-xl lg:text-2xl text-teal-500 p-3 text-wrap">Urban Tree Inno</h1>

                        </div>

                        <div className="flex flex-row gap-3">
                            <button type="button" className="inline-flex justify-center gap-x-1.5 rounded-md bg-teal-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-teal-500 hover:bg-white hover:text-black" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                Island Urban View
                                <svg className="-mr-1 h-5 w-5 text-white hover:text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <Button className='inline-flex bg-teal-500'>
                                <Link href='/compare'>Compare Simulation</Link>
                            </Button>
                        </div>
                    </div>
                    <SideNav sendDataToParent={handleTempDataFromSideNav} heatSpotChecked={handleHeatSpotToggleFromSideNav} impactStats={impactAssessment}></SideNav>

                </DeckGL>
            </div>
        </>
    )
}