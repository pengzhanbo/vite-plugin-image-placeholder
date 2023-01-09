import LRU from 'lru-cache'
import type { ImageCacheItem } from './types'

export const cache = new LRU<string, ImageCacheItem>({
  max: 500,
})
