import React, { Suspense } from 'react'
import { getTreeData, getUHIIslandData, getUHIDistrictData, getIslandTrees, getDistrictTrees } from '../lib/action'
import Loading from './loading';
import type { Metadata } from 'next'
import CompareMapView from '@/app/ui/CompareMapView';
import { TreeData, TreePosition, UHIData } from '@/app/lib/definitions';
import { generateCacheKey, getCachedData, setCachedData } from '../lib/cache';
 
export const metadata: Metadata = {
  title: 'Compare Page',
  description: 'Comparison between two Map Views to see the UHI Data Changes',
}

const fetchIslandData = async () => {
    // set the key to store in the cache
    const treeCacheKey: 'treeData' = 'treeData';
    const uhiCacheKey: 'uhiData' = 'uhiData';

    // get the cache data from the lrucache
    let treeCache = getCachedData(treeCacheKey);
    let uhiCache = getCachedData(uhiCacheKey);

    let treeData: Array<TreePosition>;
    let uhiData: UHIData;

    // check there is treeData cache, if not fetch from the backend
    if (treeCache?.key === 'treeData') {
        treeData = treeCache.value;
    } else {
        treeData = await getTreeData();
        setCachedData(treeCacheKey, { key: 'treeData', value: treeData });
    }

    // check there is uhiData cache, if not fetch from the backend
    if (uhiCache?.key === 'uhiData') {
        uhiData = uhiCache.value;
    } else {
        uhiData = await getUHIIslandData();
        setCachedData(uhiCacheKey, { key: 'uhiData', value: uhiData });
    }

    return { treeData, uhiData };
};

const fetchDistrictData = async (district: string) => {
    // use static key for treeData
    const treeCacheKey: 'treeData' = 'treeData';

    // Generate dynamic cahce key for uhiData based on district
    const uhiCacheKey = generateCacheKey('uhiData', district);

    // Retrieve cache data
    let treeCache = getCachedData(treeCacheKey);
    let uhiCache = getCachedData(uhiCacheKey as 'uhiData');

    let treeData: Array<TreePosition>;
    let uhiData: UHIData;

    // Check if treeData is in cache, otherwise fetch from backend
    if (treeCache?.key === 'treeData') {
        treeData = treeCache.value;
    }
    else {
        treeData = await getTreeData(); 
        setCachedData(treeCacheKey, {
            key: 'treeData',
            value: treeData
        })
    }

    // Check if uhiData is in cache, otherwise fetch from backend
    if (uhiCache?.key === 'uhiData') {
        uhiData = uhiCache.value;
    }
    else {
        uhiData = await getUHIDistrictData(district);
        setCachedData(uhiCacheKey, {
            key: 'uhiData',
            value: uhiData
        })
    }

    return { treeData, uhiData };
}

const ComparePage = async ({searchParams}: {
    searchParams: {
        mapView: string,
        districtName?: string, 
        feature?: string
    }
}) => {

    let treeData: TreePosition[] = [];
    let trees: TreeData[] = [];
    let uhiData: UHIData = {
        min_uhii: 0,
        max_uhii: 0,
        data: []
    }

    if (searchParams.mapView == 'Island Urban View') {
        const start = performance.now();
        ({ treeData, uhiData } = await fetchIslandData());
        trees = await getIslandTrees();
        const end = performance.now();
        console.log(`Execution time for Island view: ${Math.round((end - start) * 0.001)} s`);
    }
    else if (searchParams.mapView == 'District Urban View' && searchParams.districtName) {
        const start = performance.now();
        ({ treeData, uhiData } = await fetchDistrictData(searchParams.districtName));
        trees = await getDistrictTrees(searchParams.districtName);
        const end = performance.now();
        console.log(`Execution time for District View: ${Math.round((end - start) * 0.001)} s`);
    }

    return (
        <Suspense fallback={<Loading />}>
            <CompareMapView treeData={treeData} trees={trees} uhiData={uhiData} districtCoordinates={ searchParams.feature } />
        </Suspense>
    );
}

export default ComparePage
