export interface ImagePlaceholderOptions {
  prefix?: string
  background?: string
  textColor?: string
  text?: string
  type?: ImageType
  width?: number
  height?: number
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
  textAlign?: 'left' | 'center' | 'right' | 'centre'
  textJustify?: 0 | 1
  textSpacing?: number
}

export interface ImageCacheItem {
  type: ImageType
  content: Buffer
}
