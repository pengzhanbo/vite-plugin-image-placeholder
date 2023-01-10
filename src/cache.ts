import LRU from 'lru-cache'
import type { ImageCacheItem } from './types'

export const bufferCache = new LRU<string, ImageCacheItem>({
  max: 500,
})

export const contentCache = new LRU<string, string>({
  max: 500,
})
