export interface ImagePlaceholderOptions {
  prefix?: string
  background?: string | string[]
  textColor?: string
  text?: string
  type?: ImageType
  width?: number
  height?: number
  ratio?: string
  quality?: number
  compressionLevel?: number
  inline?: boolean
}

export type ImageType =
  | 'jpg'
  | 'png'
  | 'jpeg'
  | 'webp'
  | 'avif'
  | 'heif'
  | 'gif'

export interface ImagePlaceholderParams {
  width?: number
  height?: number
  text?: string
  background?: string
  type?: ImageType
}

export interface ImagePlaceholderQuery {
  noise?: 0 | 1
  noiseMean?: number
  noiseSigma?: number
  textColor?: string
}

export interface ImageCacheItem {
  type: ImageType
  buffer: Buffer
}
