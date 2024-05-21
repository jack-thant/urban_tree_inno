"use client"

import Map, { NavigationControl } from 'react-map-gl';
import { DeckGL } from '@deck.gl/react';
import "mapbox-gl/dist/mapbox-gl.css";
import { lightingEffect, material, INITIAL_VIEW_STATE, colorRange } from "@/app/lib/mapconfig";

export default function LocationAggregatorMap() {
    return (
        <>
            <div>
                <DeckGL
                    effects={[lightingEffect]}
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={true}
                >
                    <Map
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                        // mapStyle="https://www.onemap.gov.sg/maps/json/raster/mbstyle/Night.json"
                        mapStyle="mapbox://styles/petherem/cl2hdvc6r003114n2jgmmdr24"
                    >
                        <NavigationControl
                            position='bottom-left'/>
                    </Map>

                    

                    <div className="absolute text-white min-h-[100px] top-10 left-10 rounded-lg p-4 text-sm backdrop-blur-lg">
                        <h1 className="font-bold md:text-xl lg:text-2xl p-3 text-wrap">Urban Tree Inno</h1>
                        <div className="flex flex-row gap-5 align-middle">
                            <button type="button" className="inline-flex w-48 h-15 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                Island Urban View
                                <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button type="button" className="inline-flex w-48 h-full justify-center rounded-md bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                Compare Simulations
                                <label htmlFor="one" className="mt-2">
                                    <input id="one" type="checkbox" />
                                </label>
                            </button>
                        </div>
                    </div>
                </DeckGL>
            </div>
        </>
    )
}