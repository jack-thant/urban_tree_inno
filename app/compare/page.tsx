import React, { Suspense } from 'react'
import { getTreeData, getUHIData } from '../lib/action'
import { TreePosition, UHIData } from '../lib/definitions';
import dynamic from 'next/dynamic';
// import CompareMapView from '@/app/ui/CompareMapView';

const CompareMapView = dynamic(() => import('@/app/ui/CompareMapView'), {
    suspense: true,
  });

const ComparePage = async () => {

    const treeData: Array<TreePosition> = await getTreeData();
    const uhiData: UHIData = await getUHIData();

    return (
        <Suspense fallback={
            <h1>Loading map ...</h1>
        }>
            <CompareMapView treeData={treeData} uhiData={uhiData} />
        </Suspense>
    )
}

export default ComparePage
