import { parse as urlParse } from 'node:url'
import { match, pathToRegexp } from 'path-to-regexp'
import type { Create, CreateText } from 'sharp'
import sharp from 'sharp'
import { bufferCache } from './cache'
import { DEFAULT_PARAMS } from './constants'
import type {
  ImageCacheItem,
  ImagePlaceholderOptions,
  ImagePlaceholderParams,
  ImagePlaceholderQuery,
  ImageType,
} from './types'
import { formatColor, formatText, getBackground } from './utils'

export type CreateOptions = Create

export type TextOptions = CreateText

export async function pathToImage(
  url: string,
  rules: string[],
  options: Required<ImagePlaceholderOptions>,
): Promise<ImageCacheItem | undefined> {
  if (bufferCache.has(url)) {
    return bufferCache.get(url)
  }
  const { query: urlQuery, pathname } = urlParse(url, true)

  const rule = rules.find((rule) => {
    return pathToRegexp(rule).test(pathname!)
  })

  if (!rule) return
  const urlMatch = match(rule, { decode: decodeURIComponent })(pathname!) || {
    params: {
      width: options.width,
      background: getBackground(options.background),
      type: options.type,
    } as ImagePlaceholderParams,
  }

  const params = urlMatch.params as ImagePlaceholderParams
  const query = urlQuery as ImagePlaceholderQuery
  const imgType = params.type || DEFAULT_PARAMS.type!
  const width = Number(params.width) || 300
  const height = Number(params.height) || Math.ceil((width / 16) * 9)

  const createOptions: CreateOptions = {
    width,
    height,
    channels: 4,
    background: formatColor(
      params.background || getBackground(options.background),
    ),
  }
  if (Number(query.noise) === 1) {
    createOptions.noise = {
      type: 'gaussian',
      mean: query.noiseMean || Math.ceil((Math.min(width, height) / 100) * 10),
      sigma: query.noiseSigma || 10,
    }
  }

  const textOptions: TextOptions = {
    dpi: Math.floor((Math.min(width, height) / 4) * 3) || 1,
    text: formatText(
      params.text || options.text || `${width}x${height}`,
      formatColor(query.textColor, true) || options.textColor,
    ),
    rgba: true,
  }

  const imgBuf = await createImage({
    type: imgType,
    create: createOptions,
    text: textOptions,
    quality: options.quality,
    compressionLevel: options.compressionLevel,
  })
  const result: ImageCacheItem = {
    type: imgType,
    buffer: imgBuf,
  }
  bufferCache.set(url, result)
  return result
}

export async function createImage({
  type = 'png',
  create,
  text,
  quality,
  compressionLevel,
}: {
  type: ImageType
  create: CreateOptions
  text: TextOptions
  quality: number
  compressionLevel: number
}) {
  let image = sharp({ create })

  text && image.composite([{ input: { text } }])

  switch (type) {
    case 'jpg':
    case 'jpeg':
      image = image.jpeg({ quality })
      break
    case 'webp':
      image = image.webp({ quality })
      break
    case 'heif':
      image = image.heif({ quality })
      break
    case 'avif':
      image = image.avif({ quality })
      break
    case 'gif':
      image = image.gif()
      break
    default:
      image = image.png({ compressionLevel })
  }

  const buf = await image.toBuffer()

  return buf
}
