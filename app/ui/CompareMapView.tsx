"use client";

import Map from "react-map-gl";
import { DeckGL } from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { INITIAL_VIEW_STATE, lightingEffect } from "@/app/lib/mapconfig";
import {
  DataPoint,
  INITIAL_VIEW_STATE_FRAME,
  InterpolatedTempRecord,
  TransitionProps,
  TreePosition,
  UHIData,
} from "../lib/definitions";
import { useEffect, useState } from "react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { ScreenGridLayer } from "@deck.gl/aggregation-layers";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import Legend from "../ui/legend";
import { MapViewState, ViewStateChangeParameters } from "@deck.gl/core";
import { heatMapColorRange } from "@/constants/config";

interface CompareMapViewProps {
  treeData: Array<TreePosition>;
  uhiData: UHIData;
  districtCoordinates?: string;
}

const CompareMapView = ({
  treeData,
  uhiData,
  districtCoordinates,
}: CompareMapViewProps) => {
  const [toggleHeatSpot, setHeatSpot] = useState<boolean>(false);
  const [toggleTree, setTreeToggle] = useState<boolean>(false);
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);

  const handleHeatSpotCheckedChange = (checked: boolean) => {
    setHeatSpot(checked);
  };

  const handleTreeSpotCheckedChange = (checked: boolean) => {
    setTreeToggle(checked);
  };

  const handleViewStateChange = <
    ViewStateT extends TransitionProps | MapViewState
  >(
    params: ViewStateChangeParameters<ViewStateT>
  ): void | ViewStateT | null => {
    setViewState(params.viewState as MapViewState);
  };

  const districtCoord = districtCoordinates
    ? JSON.parse(districtCoordinates)
    : "";

  const centerLng = (districtCoord[0] + districtCoord[2]) / 2;
  const centerLat = (districtCoord[1] + districtCoord[3]) / 2;

  // Zoom to district if districtCoord is available
    // Zoom to district if districtCoord is available
    useEffect(() => {
        if (districtCoord) {
          setViewState((prevState) => {
            // Only update if necessary
            if (
              prevState.longitude !== centerLng ||
              prevState.latitude !== centerLat ||
              prevState.zoom !== 13
            ) {
              return {
                ...prevState,
                longitude: centerLng,
                latitude: centerLat,
                zoom: 13, // Adjust zoom level as needed
              };
            }
            return prevState;
          });
        }
      }, [districtCoord, centerLng, centerLat]);

  const layers = [];
  const secondMapLayers = [];

  if (toggleTree) {
    layers.push(
      new ScatterplotLayer<TreePosition>({
        id: "scatter-plot",
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
      new ScreenGridLayer<DataPoint>({
        id: "heat-map-grid",
        data: uhiData.data,
        opacity: 0.8,
        getPosition: (d: DataPoint) => [d.lon, d.lat],
        getWeight: (d: DataPoint) => d.UHI_Intensity_before,
        cellSizePixels: 15,
        aggregation: "MEAN",
      })
    );
    secondMapLayers.push(
      new ScreenGridLayer<DataPoint>({
        id: "heat-map-grid",
        data: uhiData.data,
        opacity: 0.8,
        getPosition: (d: DataPoint) => [d.lon, d.lat],
        getWeight: (d: DataPoint) => d.UHI_Intensity,
        cellSizePixels: 15,
        aggregation: "MEAN",
      })
    );
  }

  return (
    <>
      <div className="flex flex-row h-screen">
        <div className="flex-1">
          <DeckGL
            effects={[lightingEffect]}
            viewState={viewState}
            onViewStateChange={handleViewStateChange}
            controller={true}
            width="50%"
            layers={[layers]}
          >
            <Map
              reuseMaps
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              mapStyle="mapbox://styles/mapbox/light-v11"
            />
            <div className="relative flex justify-start ml-4 py-4 h-screen">
              <div className="absolute text-white rounded-lg p-4 text-sm bg-black">
                <div className="mx-0 bg-black">
                  <h2 className="font-bold">2024 (Current)</h2>
                </div>
              </div>
            </div>
          </DeckGL>
        </div>
        <div style={{ height: "100vh", width: "50vw", position: "relative" }}>
          <DeckGL
            controller={true}
            viewState={viewState}
            onViewStateChange={handleViewStateChange}
            layers={[secondMapLayers]}
          >
            <Map
              reuseMaps
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              mapStyle="mapbox://styles/mapbox/light-v11"
            />
            {/* Card to toggle */}
            <div className="flex flex-col float-right px-3 py-4 md:px-2 max-w-[20rem]">
              <div className="bg-white min-w-[300px] rounded-lg text-blac px-6 py-4 mb-5">
                <h2 className="font-bold text-lg mb-4">
                  Layer Visibility Control
                </h2>
                <div className="flex flex-row justify-between gap-y-5 mt-4">
                  <div className="inline-flex items-center">
                    <Image
                      src="./urban_key_data/sun.svg"
                      width={20}
                      height={20}
                      alt="Icon of Heat Spot Data"
                    />
                    <p className="font-semibold text-sm ml-3">UHI Data</p>
                  </div>
                  <Switch
                    id="heat_spot"
                    onCheckedChange={handleHeatSpotCheckedChange}
                  />
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
                  <Switch
                    id="tree_spot"
                    onCheckedChange={handleTreeSpotCheckedChange}
                  />
                </div>
              </div>
              {toggleHeatSpot && uhiData && (
                <Legend
                  colorRange={heatMapColorRange}
                  numberLegend={[
                    Number(uhiData.min_uhii.toFixed(2)),
                    Number(uhiData.max_uhii.toFixed(2)),
                  ]}
                  title={"UHI Temperature Legend (°C)"}
                />
              )}
            </div>
            <div className="flex justify-start ml-4 py-4">
              <div className="p-4 rounded-lg bg-black text-white">
                <h2 className="text-center font-bold">Simulation</h2>
              </div>
            </div>
          </DeckGL>
        </div>
      </div>
    </>
  );
};

export default CompareMapView;
