"use client"

import Map, { Layer, Marker, NavigationControl, Popup, Source, useControl, useMap } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { lightingEffect, INITIAL_VIEW_STATE } from "@/app/lib/mapconfig";
import SideNav from './sidenav';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HoverDistrictProps, ImpactAssessment, InterpolatedTempRecord, MarkerPosition } from '../lib/definitions';
import Image from 'next/image';
import { PickingInfo } from '@deck.gl/core';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from "@/components/ui/select"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link';
import { ScreenGridLayer } from '@deck.gl/aggregation-layers';
import { listOfTreeSpecies, treeConditions } from '@/constants/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { plantTreeFormSchema } from '@/app/lib/validations';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import config from '@/lib/config';
import SGMapStyle, { highlightLayer } from '../lib/map-style';
import type { MapboxGeoJSONFeature, MapGeoJSONFeature, MapLayerMouseEvent, MapRef, MapStyle } from 'react-map-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { DeckProps } from '@deck.gl/core';
import 'mapbox-gl/dist/mapbox-gl.css';
import bbox from '@turf/bbox';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';

export default function LocationAggregatorMap() {

    const [tempDataFromSideNav, setTempDataFromSideNav] = useState<InterpolatedTempRecord[]>([]);
    const [toggleHeatSpotFromSideNav, setHeatSpotFromSideNav] = useState<boolean>();
    const [markers, setMarkers] = useState<[number, number][]>([]);
    const [lastAddedMarkerIndex, setLastAddedMarkerIndex] = useState<number | null>(null);
    const [impactAssessment, setImpactAssessment] = useState<ImpactAssessment>();
    const [coordinates, setCoordinates] = useState<[number, number]>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [hoverDistrict, setHoverDistrict] = useState<HoverDistrictProps | null>(null);

    const mapRef = useRef<MapRef>(null);
    const currentDistrictRef = useRef(null);

    const views: Array<string> = ['Island Urban View', 'District Urban View'];

    const [mapView, setMapView] = useState<string>(views[0]);

    const handleViewChange = (view: string) => {
        setMapView(view);
    }

    const handleTempDataFromSideNav = (data: InterpolatedTempRecord[]) => {
        setTempDataFromSideNav(data);
    }

    const handleHeatSpotToggleFromSideNav = (checked: boolean) => {
        setHeatSpotFromSideNav(checked);
    }

    function DeckGLOverlay(props: DeckProps) {
        const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
        overlay.setProps(props);
        return null;
    }

    const debouncedSetHoverDistrict = debounce((longitude, latitude, districtName) => {
        setHoverDistrict({ longitude, latitude, districtName });
    }, 1000);

    const onDistrictHover = useCallback((event: MapLayerMouseEvent) => {
        const district = event.features && event.features[0];
        if (district == null) return

        const districtName = district.properties?.district;
        // Check if the district has changed
        if (currentDistrictRef.current != districtName) {
            currentDistrictRef.current = districtName; // update the current state
            debouncedSetHoverDistrict(
                event.lngLat.lng,
                event.lngLat.lat,
                districtName
            );
        }
    }, [debouncedSetHoverDistrict])

    const selectedDistrict = (hoverDistrict && hoverDistrict.districtName) || '';
    const filter = useMemo(() => ['in', 'district', selectedDistrict], [selectedDistrict])

    const minLat = 1.1890;
    const maxLat = 1.47085;
    const minLon = 103.6053;
    const maxLon = 104.0723;

    function isWithinSingaporeBounds(position: number[]) {
        const lat = position[1]; // Assuming position is [longitude, latitude]
        const lon = position[0];

        if (lon < minLon || lon > maxLon || lat < minLat || lat > maxLat) {
            return false;
        }

        return true;
    }

    const plantTreeForm = useForm<z.infer<typeof plantTreeFormSchema>>({
        resolver: zodResolver(plantTreeFormSchema),
        defaultValues: {
            numberOfTrees: 100,
            trunkSize: 10,
            treeCondition: treeConditions[0],
            treeSpecies: listOfTreeSpecies[0],
        },
    })

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

    // Function to handle marker click on the map
    const handleMapClick = (event: MapLayerMouseEvent) => {
        // create an array to store the longitude and latitude array
        const position: [number, number] = [event.lngLat.lng, event.lngLat.lat];

        setCoordinates(position);

        // check the click is within singapore bounds
        if (!isWithinSingaporeBounds(position)) {
            return;
        }

        // update the state to add the new marker position
        setMarkers((prevMarkers) => {
            const newMarkers = [...prevMarkers, position];
            setLastAddedMarkerIndex(newMarkers.length - 1);
            setDialogOpen(true);
            return newMarkers;
        })
    }
    const handleZoomClick = (event: MapLayerMouseEvent) => {

        if (event.features && event.features.length > 0) {
            const feature = event.features[0];
            if (feature) {
                // calculate the bounding box of the feature
                const [minLng, minLat, maxLng, maxLat] = bbox(feature);

                // Use the mapRef to fit the map's viewport to the bounding box of the feature
                // Optional chaining (?.) is used to ensure that fitBounds is only called if mapRef.current is not null or undefined
                mapRef.current?.fitBounds(
                    [
                        [minLng, minLat],
                        [maxLng, maxLat]
                    ],
                    { padding: 20, duration: 1000 }
                );
            }
        }
    }

    async function onSubmit(values: z.infer<typeof plantTreeFormSchema>) {

        if (coordinates == null) {
            console.error("Coordinates are undefined");
            return;
        }

        setDialogOpen(false);

        try {
            const response = await fetch(`${config.apiUrl}/api/impact_assessment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lat: coordinates[1],
                    lon: coordinates[0],
                    numberOfTrees: values.numberOfTrees,
                    treeCondition: values.treeCondition,
                    treeSpecies: values.treeSpecies,
                    trunkSize: values.trunkSize
                })
            })
            const data: ImpactAssessment = await response.json();
            console.log('Response from the backend API: ', data);
            setImpactAssessment(data);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    return (
        <>
            <div>
                <div className="relative h-screen">
                    <Map
                        initialViewState={INITIAL_VIEW_STATE}
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                        mapStyle={mapView == views[0] ? "mapbox://styles/mapbox/light-v11" : SGMapStyle as MapStyle}
                        interactiveLayerIds={['sg-districts-fill']}
                        ref={mapRef}
                        onClick={mapView == views[0] ? handleMapClick : handleZoomClick}
                        onMouseMove={onDistrictHover}
                    >
                        <Source type='vector' url='mapbox://mapbox.82pkq93d'>
                            <Layer beforeId="waterway" {...highlightLayer} filter={filter} />
                        </Source>
                        {
                            selectedDistrict && hoverDistrict && (
                                <Popup
                                    longitude={hoverDistrict.longitude}
                                    latitude={hoverDistrict.latitude}
                                    offset={[0, -10] as [number, number]}
                                    closeButton={false}
                                >
                                    {selectedDistrict}
                                </Popup>
                            )
                        }
                        <DeckGLOverlay layers={layers} />
                        <NavigationControl
                            position='bottom-left' />
                        {markers.map((marker, index) => (
                            <Marker key={index} longitude={marker[0]} latitude={marker[1]} anchor="bottom">
                                <Dialog open={lastAddedMarkerIndex === index && dialogOpen} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Image src="./mingcute_tree-2-fill.svg" width={40} height={40} alt='marker' />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[450px]">
                                        <DialogHeader>
                                            <DialogTitle className='text-teal-500 text-lg'>Plant Trees</DialogTitle>
                                            <DialogDescription>
                                                {`Let's improve our environment!`}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form {...plantTreeForm}>
                                            <form onSubmit={plantTreeForm.handleSubmit(onSubmit)}>
                                                <div className="grid gap-5 py-4">
                                                    <FormField
                                                        control={plantTreeForm.control}
                                                        name="numberOfTrees"
                                                        render={({ field }) => (
                                                            // Number of Trees Input
                                                            <FormItem className='grid grid-cols-4 items-center gap-4'>
                                                                <FormLabel className='text-right leading-4'>Number of Trees</FormLabel>
                                                                <FormControl>
                                                                    <Input type='number' placeholder={"Enter the number of trees (e.g. 5)"} {...field} className='col-span-3' onChange={event => field.onChange(+event.target.value)} />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={plantTreeForm.control}
                                                        name="trunkSize"
                                                        render={({ field }) => (
                                                            <FormItem className='grid grid-cols-4 items-center gap-4'>
                                                                <FormLabel className='text-right leading-4'>Trunk Size (cm)</FormLabel>
                                                                <FormControl>
                                                                    <Input type='number' placeholder={"Enter the size of trunk (e.g. 5)"} {...field} className='col-span-3' onChange={event => field.onChange(+event.target.value)} />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={plantTreeForm.control}
                                                        name="treeSpecies"
                                                        render={({ field }) => (
                                                            <FormItem className='grid grid-cols-4 items-center gap-4'>
                                                                <FormLabel className='text-right leading-4'>Tree Species</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl className="col-span-3">
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder={listOfTreeSpecies[0]} />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {
                                                                            listOfTreeSpecies.map((species, id) => {
                                                                                return (
                                                                                    <SelectItem value={species} key={id}>{species}</SelectItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={plantTreeForm.control}
                                                        name="treeCondition"
                                                        render={({ field }) => (
                                                            <FormItem className='grid grid-cols-4 items-center gap-4'>
                                                                <FormLabel className='text-right leading-4'>Tree Conditions</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl className="col-span-3">
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder={treeConditions[0]} />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {
                                                                            treeConditions.map((condition, id) => {
                                                                                return (
                                                                                    <SelectItem value={condition} key={id}>{condition}</SelectItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="submit" className="bg-teal-500 mt-3">Save changes</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </Marker>
                        ))}
                    </Map>
                </div>


                <div className="absolute text-white min-h-[100px] z-2 top-5 left-10 rounded-lg p-4 text-sm bg-white">
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
                        <Select onValueChange={handleViewChange} defaultValue={mapView}>
                            <SelectTrigger className="w-full bg-teal-500 text-white font-semibold focus:outline-gray-500">
                                <SelectValue placeholder="Island Urban View" defaultValue={views[0]} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {views.map((view, id) => (
                                        <SelectItem value={view} key={id}>
                                            {view}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button className='bg-teal-500'>
                            <Link href='/compare'>Compare Simulation</Link>
                        </Button>
                    </div>
                </div>
                {/* Only display before the user place the marker */}
                {
                    markers.length <= 0 && (
                        <div className="grid place-content-center w-full absolute top-5">
                            <h1 className='bg-black text-white p-3 text-sm rounded-lg'>Click on the map to plant trees</h1>
                        </div>
                    )
                }

                <SideNav sendDataToParent={handleTempDataFromSideNav} heatSpotChecked={handleHeatSpotToggleFromSideNav} impactStats={impactAssessment}></SideNav>
            </div>
        </>
    )
}

