import { LRUCache } from 'lru-cache'
import type { ImageCacheItem } from './types'

export const bufferCache = new LRUCache<string, ImageCacheItem>({
  max: 500,
})

export const contentCache = new LRUCache<string, string>({
  max: 500,
})
