import QuickLRU from 'quick-lru'
import type { ImageCacheItem } from './types'

export const bufferCache = new QuickLRU<string, ImageCacheItem>({
  maxSize: 500,
})

export const contentCache = new QuickLRU<string, string>({
  maxSize: 500,
})
