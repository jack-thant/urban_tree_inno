"use client"

import Map, { Marker, NavigationControl, useMap } from 'react-map-gl';
import { DeckGL } from '@deck.gl/react';
import "mapbox-gl/dist/mapbox-gl.css";
import { lightingEffect, material, INITIAL_VIEW_STATE, colorRange } from "@/app/lib/mapconfig";
import SideNav from './sidenav';
import { useState } from 'react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { InterpolatedTempRecord, MarkerPosition } from '../lib/definitions';
import Image from 'next/image';
import { PickingInfo } from '@deck.gl/core';

export default function LocationAggregatorMap() {

    const [tempDataFromSideNav, setTempDataFromSideNav] = useState<InterpolatedTempRecord[]>([]);
    const [toggleHeatSpotFromSideNav, setHeatSpotFromSideNav] = useState<boolean>();
    const [markers, setMarkers] = useState<number[][]>([]);

    const handleTempDataFromSideNav = (data: InterpolatedTempRecord[]) => {
        setTempDataFromSideNav(data);
    }

    const handleHeatSpotToggleFromSideNav = (checked: boolean) => {
        setHeatSpotFromSideNav(checked);
    }
    // Filter out records with null meanTemperature values
    const filteredData = tempDataFromSideNav.filter(e => e['Mean Temperature'] !== null)

    const layers = toggleHeatSpotFromSideNav && filteredData ? [
        new HeatmapLayer<InterpolatedTempRecord>({
            id: 'temperature-change',
            data: filteredData,
            aggregation: 'SUM',
            radiusPixels: 30,
            opacity: 0.4,
            getPosition: (d: InterpolatedTempRecord) => [d.lon, d.lat],
            getWeight: (d: InterpolatedTempRecord) => d['Mean Temperature'],
            // colorRange: [[239, 71, 111],[247, 140, 107],[255, 209, 102],[6, 214, 160],[17, 138, 178],[7, 59, 76]],
            colorRange: [[63,127,255],[92,156,255],[121,182,255],[255,0,0],[176,48,96],[198,40,40]],
            colorDomain: [0,100],
        })
    ] : [];

    // Function to handle clicks on the map
    const handleMapClick = (info: PickingInfo<MarkerPosition>) => {
        // Get the position from the click event
        const position: number[] | undefined = info.coordinate;

        // Check if the position is valid and has exactly two elements (longitude and latitude)
        if (position && position.length === 2) {
            // Update the state to add the new marker position
            setMarkers((prevMarkers) => [...prevMarkers, position]);
        }
    };

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
                                <Image src="./mingcute_tree-2-fill.svg" width={40} height={40} alt="marker" />
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
                            <button type="button" className="inline-flex justify-center rounded-md bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">

                                <label htmlFor="one" className="mt-1">
                                    <input id="one" type="checkbox" />
                                </label>
                                <p className='mt-1 ml-2'>Compare Simulation</p>
                            </button>
                        </div>
                    </div>
                    <SideNav sendDataToParent={handleTempDataFromSideNav} heatSpotChecked={handleHeatSpotToggleFromSideNav}></SideNav>

                </DeckGL>
            </div>
        </>
    )
}