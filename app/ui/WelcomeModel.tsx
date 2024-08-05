"use client"

import { Button } from "@/components/ui/button"
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
import Image from 'next/image'
import { useState, useEffect } from "react";

import React from 'react'

const WelcomeModel = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(true); // Open the dialog when the component mounts
    }, []);

    const handleClose = () => {
        setOpen(false); // Function to close the dialog
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='flex flex-row gap-2 text-teal-500 text-lg mb-3'>
                        <Image src='./mingcute_tree-2-fill.svg' width={24} height={24} alt='tree icon' />
                        <span>Welcome to Urban Tree Inno</span>
                    </DialogTitle>
                    <DialogDescription>
                        Leaf it to us provides users with a comprehensive visualization of environmental data, including heat maps, tree data, and Urban Heat Island (UHI) intensity.
                    </DialogDescription>
                    <DialogTitle className='text-md pt-4'>Instruction</DialogTitle>
                    <DialogDescription>Start by <strong className='text-black'>clicking on the map</strong> to plant trees and see a change in the impact assessment</DialogDescription>
                    <DialogDescription className='text-red-500 font-semibold pb-1'>{ `To ensure accurate tree planting, please switch off the "Heat Spot Data" toggle before proceeding.` } </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" className='w-full bg-teal-500 mt-1'>
                            Got it!
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default WelcomeModel
