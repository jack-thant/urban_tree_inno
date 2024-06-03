"use client"

import Map from 'react-map-gl';
import { DeckGL } from '@deck.gl/react';
import "mapbox-gl/dist/mapbox-gl.css";
import { lightingEffect, INITIAL_VIEW_STATE } from "@/app/lib/mapconfig";
import { InterpolatedTempRecord, TreePosition } from '../lib/definitions';
import { useEffect, useState } from 'react';
import {ScatterplotLayer} from '@deck.gl/layers';
import {ScreenGridLayer} from '@deck.gl/aggregation-layers';

export default function Compare() {

    const [treeData, setTreeData] = useState<Array<TreePosition>>([]);
    const [testData, setTestData] = useState(null);

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
    },[]);

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
    },[]);
    
    console.log(testData);

    const layers = treeData && testData ? [
        new ScatterplotLayer<TreePosition>({
            id: 'scatter-plot',
            data: treeData,
            radiusScale: 10,
            radiusMinPixels: 0.25,
            getPosition: (d: TreePosition) => [d.lon, d.lat],
            getFillColor: [22,163,74], 
            getRadius: 1,
        }),
        new ScreenGridLayer<InterpolatedTempRecord>({
            id: 'heat-map-grid',
            data: testData,
            opacity: 0.3,
            getPosition: d => [d.lon, d.lat],
            getWeight: d => d['Mean Temperature'],
            cellSizePixels: 15,
            aggregation: "MEAN",
            colorRange: [[63, 127, 255], [92, 156, 255], [121, 182, 255], [255, 0, 0], [176, 48, 96], [198, 40, 40]],
        })
    ] : [];


    return (
        <>
            <div className="flex flex-row h-screen">
                <div className="flex-1">
                    <DeckGL
                        effects={[lightingEffect]}
                        initialViewState={INITIAL_VIEW_STATE}
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