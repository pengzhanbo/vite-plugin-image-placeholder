import { parse as urlParse } from 'node:url'
import { match } from 'path-to-regexp'
import type { Create, CreateText } from 'sharp'
import sharp from 'sharp'
import { bufferCache } from './cache'
import { DEFAULT_PARAMS } from './constants'
import type { FindPathRule } from './pathRules'
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
  findPathRule: FindPathRule,
  options: Required<ImagePlaceholderOptions>,
): Promise<ImageCacheItem | undefined> {
  if (bufferCache.has(url)) {
    return bufferCache.get(url)
  }
  const { query: urlQuery, pathname } = urlParse(url, true)

  const rule = findPathRule(pathname!)

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
  const height = Number(params.height) || Math.ceil(width * options.ratio)

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
    text: params.text || options.text || `${width}x${height}`,
    rgba: true,
  }

  try {
    const imgBuf = await createImage({
      type: imgType,
      create: createOptions,
      text: textOptions,
      quality: options.quality,
      compressionLevel: options.compressionLevel,
      textColor: formatColor(query.textColor, true) || options.textColor,
    })
    const result: ImageCacheItem = {
      type: imgType,
      buffer: imgBuf,
    }
    bufferCache.set(url, result)
    return result
  } catch (e) {
    console.error(e)
  }
}

export async function createImage({
  type = 'png',
  create,
  text,
  quality,
  compressionLevel,
  textColor,
}: {
  type: ImageType
  create: CreateOptions
  text: TextOptions
  quality: number
  compressionLevel: number
  textColor: string
}) {
  if (type === 'svg') {
    return createSVG(create, text.text, textColor)
  }
  let image = sharp({ create })

  text.text = formatText(text.text, textColor)

  image.composite([{ input: { text } }])

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

export function createSVG(
  create: CreateOptions,
  text: string,
  textColor: string,
) {
  const { width, height, background } = create
  const fs = Math.floor(Math.min(width, height) / 8)
  const mw = Math.floor(width / 2)
  const mh = Math.floor(height / 2 + fs / 4)
  const svg = `<svg version="1.1" baseProfile="full" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${background}" /><text font-family="monospace" x="${mw}" y="${mh}" font-size="${fs}" text-anchor="middle" fill="${textColor}">${text}</text></svg>`
  const buffer = Buffer.from(svg, 'utf-8')
  return buffer
}
