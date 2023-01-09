import type { Create, CreateText } from 'sharp'
import sharp from 'sharp'
import type { ImageType } from './types'

export type CreateOptions = Create

export type TextOptions = CreateText

export async function generateImage(
  type: ImageType = 'png',
  createOptions: CreateOptions,
  textOptions?: TextOptions,
) {
  let image = sharp({ create: createOptions })

  textOptions && image.composite([{ input: { text: textOptions } }])

  switch (type) {
    case 'jpg':
    case 'jpeg':
      image = image.jpeg({ quality: 100 })
      break
    case 'webp':
      image = image.webp({ quality: 100 })
      break
    case 'heif':
      image = image.heif({ quality: 100 })
      break
    case 'avif':
      image = image.avif({ quality: 100 })
      break
    case 'gif':
      image = image.gif()
      break
    default:
      image = image.png({ compressionLevel: 3 })
  }

  const buf = await image.toBuffer()

  return buf
}
