import { LRUCache } from 'lru-cache';
import { TreePosition, UHIData } from './definitions';

type CacheKey = 'treeData' | 'uhiData';

// Define a new type for the dynamic cache keys (with district)
type DynamicCacheKey = `${CacheKey}_${string}`;

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

export const getCachedData = (key: CacheKey | DynamicCacheKey): CacheValue | undefined => {
    return cache.get(key as CacheKey);
}

export const setCachedData = (key: CacheKey | DynamicCacheKey, value: CacheValue): void => {
    cache.set(key as CacheKey, value);
    console.log(`${key} Caching is successful`);
}

// Generate cache key function
export const generateCacheKey = (type: CacheKey, district?: string): CacheKey | DynamicCacheKey => {
    return district ? `${type}_${district}` as DynamicCacheKey : type;
};
