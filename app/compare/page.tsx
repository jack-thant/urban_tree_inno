import React, { Suspense } from 'react'
import { getTreeData, getUHIData } from '../lib/action'
import { TreePosition, UHIData } from '../lib/definitions';
import dynamic from 'next/dynamic';
import Loading from './loading';
// cd 

const CompareMapView = dynamic(() => import('@/app/ui/CompareMapView'), {
    suspense: true,
});

const ComparePage = async () => {

    const [treeData, uhiData]: [Array<TreePosition>, UHIData] = await Promise.all([
        getTreeData(),
        getUHIData()
    ]);

    return (
        <Suspense fallback= {<Loading/>}>
            <CompareMapView treeData={treeData} uhiData={uhiData} />
        </Suspense>
    )
}

export default ComparePage
