import { LRUCache } from 'lru-cache';
import { TreePosition, UHIData } from './definitions';

type CacheKey = 'treeData' | 'uhiData';

interface TreeCacheValue {
    key: 'treeData';
    value: Array<TreePosition>;
}

interface UHICacheValue {
    key: 'uhiData';
    value: UHIData;
}

type CacheValue = TreeCacheValue | UHICacheValue;

// Create a LRU cache
const cache = new LRUCache<CacheKey, CacheValue>({
    max: 20000,
    // how long to live in ms
    ttl: 1000 * 60 * 10, // Cache Item for 10 minutes
})

export const getCachedData = (key: CacheKey): CacheValue | undefined => {
    return cache.get(key);
}

export const setCachedData = (key: CacheKey, value: CacheValue): void => {
    cache.set(key, value);
    console.log("Caching is successful");
}