import type { ImagePlaceholderParams } from './types'

export const DEFAULT_PREFIX = 'image/placeholder'

export const DEFAULT_PARAMS: ImagePlaceholderParams = {
  width: 300,
  type: 'png',
}

export const imageMimeType = {
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  heif: 'image/heif',
  gif: 'image/gif',
}
