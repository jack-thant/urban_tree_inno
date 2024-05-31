"use client"

import Map, { Marker, NavigationControl, useMap } from 'react-map-gl';
import { DeckGL } from '@deck.gl/react';
import "mapbox-gl/dist/mapbox-gl.css";
import { lightingEffect, INITIAL_VIEW_STATE } from "@/app/lib/mapconfig";

export default function Compare() {
    return (
        <>
            <div className="flex flex-row h-screen">
                <div className="flex-1">
                    <DeckGL
                        effects={[lightingEffect]}
                        initialViewState={INITIAL_VIEW_STATE}
                        controller={true}
                        width="50%"
                    >
                        <Map
                            reuseMaps
                            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                            mapStyle="mapbox://styles/mapbox/outdoors-v12"
                        />
                    </DeckGL>
                </div>
                <div style={{ height: '100vh', width: '50vw', position: 'relative' }}>
                    <DeckGL
                        effects={[lightingEffect]}
                        initialViewState={INITIAL_VIEW_STATE}
                        controller={true}
                    >
                        <Map
                            reuseMaps
                            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                            mapStyle="mapbox://styles/mapbox/outdoors-v12"
                        />
                    </DeckGL>
                </div>
            </div>


        </>
    )
}