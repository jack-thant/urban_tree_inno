import React, { Suspense } from 'react'
import { getTreeData, getUHIIslandData, getUHIDistrictData } from '../lib/action'
import Loading from './loading';
import type { Metadata } from 'next'
import CompareMapView from '@/app/ui/CompareMapView';
import { TreePosition, UHIData } from '@/app/lib/definitions';
import { getCachedData, setCachedData } from '../lib/cache';
 
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
        uhiData = await getUHIDistrictData(district);
        setCachedData(uhiCacheKey, { key: 'uhiData', value: uhiData });
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
    let uhiData: UHIData = {
        min_uhii: 0,
        max_uhii: 0,
        data: []
    }

    if (searchParams.mapView == 'Island Urban View') {
        ({ treeData, uhiData } = await fetchIslandData());
    }
    else if (searchParams.mapView == 'District Urban View' && searchParams.districtName) {
        ({ treeData, uhiData } = await fetchDistrictData(searchParams.districtName));
    }

    return (
        <Suspense fallback={<Loading />}>
            <CompareMapView treeData={treeData} uhiData={uhiData} />
        </Suspense>
    );
}

export default ComparePage
