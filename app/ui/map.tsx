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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Divide } from 'lucide-react';
import config from '@/lib/config';

export default function LocationAggregatorMap() {

    const [tempDataFromSideNav, setTempDataFromSideNav] = useState<InterpolatedTempRecord[]>([]);
    const [toggleHeatSpotFromSideNav, setHeatSpotFromSideNav] = useState<boolean>();
    const [markers, setMarkers] = useState<number[][]>([]);
    const [lastAddedMarkerIndex, setLastAddedMarkerIndex] = useState<number | null>(null);
    const [impactAssessment, setImpactAssessment] = useState<ImpactAssessment>();
    const [coordinates, setCoordinates] = useState<number[]>();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleTempDataFromSideNav = (data: InterpolatedTempRecord[]) => {
        setTempDataFromSideNav(data);
    }

    const handleHeatSpotToggleFromSideNav = (checked: boolean) => {
        setHeatSpotFromSideNav(checked);
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

    // Function to handle clicks on the map
    const handleMapClick = (info: PickingInfo<MarkerPosition>) => {

        console.log(info.coordinate);
        setCoordinates(info.coordinate);
        // Get the position from the click event
        const position: number[] | undefined = info.coordinate;

        // Check if the position is valid and has exactly two elements (longitude and latitude)
        if (position && position.length === 2) {
            // Disable the handleEvent if the coordinates exceed the specified limits
            if (position[0] > 103.9 && position[1] > 1.36) {
                return;
            }

            // Update the state to add the new marker position
            setMarkers((prevMarkers) => {
                const newMarkers = [...prevMarkers, position];
                setLastAddedMarkerIndex(newMarkers.length - 1);
                setDialogOpen(true);
                return newMarkers;
            });
        }
    };
    async function onSubmit(values: z.infer<typeof plantTreeFormSchema>) {

        if (!coordinates) {
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
                        mapStyle="mapbox://styles/mapbox/light-v11"
                    // mapStyle="mapbox://styles/mapbox/dark-v11"
                    >
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
