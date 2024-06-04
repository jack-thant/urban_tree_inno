"use client"

import Map from 'react-map-gl';
import { DeckGL } from '@deck.gl/react';
import "mapbox-gl/dist/mapbox-gl.css";
import { INITIAL_VIEW_STATE, lightingEffect } from "@/app/lib/mapconfig";
import { heatMapColorRange, heatMapLegendTitle, heatMapNumberLegend, INITIAL_VIEW_STATE_FRAME, InterpolatedTempRecord, TransitionProps, TreePosition } from '../lib/definitions';
import { useEffect, useState } from 'react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { ScreenGridLayer } from '@deck.gl/aggregation-layers';
import { Switch } from "@/components/ui/switch"
import Image from "next/image";
import Legend from '../ui/legend';
import { MapViewState, ViewStateChangeParameters } from '@deck.gl/core';

export default function Compare() {

    const [treeData, setTreeData] = useState<Array<TreePosition>>([]);
    const [testData, setTestData] = useState(null);
    const [toggleHeatSpot, setHeatSpot] = useState<boolean>(false);
    const [toggleTree, setTreeToggle] = useState<boolean>(false);
    const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);

    const handleHeatSpotCheckedChange = (checked: boolean) => {
        setHeatSpot(checked);
    }

    const handleTreeSpotCheckedChange = (checked: boolean) => {
        setTreeToggle(checked);
    }

    const handleViewStateChange = <ViewStateT extends TransitionProps | MapViewState>(
        params: ViewStateChangeParameters<ViewStateT>
    ): void | ViewStateT | null => {
        setViewState(params.viewState as MapViewState);
    }

    useEffect(() => {
        const fetchTreeData = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/trees/202403');
                const data = await res.json();
                setTreeData(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }
        fetchTreeData();
    }, []);

    useEffect(() => {
        const fetchTempData = async () => {
            try {
                const res = await fetch('/mean_temperature_202403.json');
                const data = await res.json();
                setTestData(data)
            } catch (error) {
                console.error("Error fetching data", error);
            }
        }
        fetchTempData();
    }, []);

    const layers = [];

    if (treeData && testData) {
        if (toggleTree) {
            layers.push(
                new ScatterplotLayer<TreePosition>({
                    id: 'scatter-plot',
                    data: treeData,
                    radiusScale: 10,
                    radiusMinPixels: 0.25,
                    getPosition: (d: TreePosition) => [d.lon, d.lat],
                    getFillColor: [22, 163, 74],
                    getRadius: 1,
                })
            );
        }
        if (toggleHeatSpot) {
            layers.push(
                new ScreenGridLayer<InterpolatedTempRecord>({
                    id: 'heat-map-grid',
                    data: testData,
                    opacity: 0.8,
                    getPosition: d => [d.lon, d.lat],
                    getWeight: d => d['Mean Temperature'],
                    cellSizePixels: 15,
                    aggregation: "MEAN",
                })
            )
        }
    }


    return (
        <>
            <div className="flex flex-row h-screen">
                <div className="flex-1">
                    <DeckGL
                        effects={[lightingEffect]}
                        viewState={viewState}
                        // TODO: Fix the type error
                        onViewStateChange={handleViewStateChange}
                        controller={true}
                        width="50%"
                        layers={[layers]}
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
                        controller={true}
                        viewState={viewState}
                        // TODO: Fix the type error
                        onViewStateChange={handleViewStateChange}
                    >
                        <Map
                            reuseMaps
                            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                            mapStyle="mapbox://styles/mapbox/outdoors-v12"
                        />
                        {/* Card to toggle */}
                        <div className="flex flex-col h-screen float-right px-3 py-4 md:px-2">
                            <div className="bg-white min-w-[300px] rounded-lg text-blac px-6 py-4 mb-5">
                                <h2 className='font-bold text-lg mb-4'>Layer Visibility Control</h2>
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
                                    <Switch id="heat_spot" onCheckedChange={handleHeatSpotCheckedChange} />
                                </div>
                                <div className="flex flex-row justify-between gap-y-5 mt-4">
                                    <div className="inline-flex items-center">
                                        <Image
                                            src="./impact_assess/tree-notfill.svg"
                                            width={20}
                                            height={20}
                                            alt="Icon of Tree Data"
                                        />
                                        <p className="font-semibold text-sm ml-3">Tree Data</p>
                                    </div>
                                    <Switch id="tree_spot" onCheckedChange={handleTreeSpotCheckedChange} />
                                </div>

                            </div>
                            {
                                toggleHeatSpot && (
                                    <Legend colorRange={heatMapColorRange} numberLegend={heatMapNumberLegend} title={heatMapLegendTitle} />
                                )
                            }
                        </div>
                    </DeckGL>
                </div>

            </div>


        </>
    )
}