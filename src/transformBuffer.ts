import type { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import path from 'node:path'
import type {
  ImageCacheItem,
  ImageType,
  OutputFile,
  OutputFilename,
  PluginContext,
} from './types'
import { getMimeType } from './utils'

const RE_HTTP = /^https?:\/\//

const isHTTP = (url: string): boolean => RE_HTTP.test(url)

export async function bufferToFile(
  ctx: PluginContext,
  buffer: Buffer,
  type: ImageType,
  assetsDir: string,
  filename?: OutputFilename,
) {
  const hash = createHash('sha256')
  hash.update(buffer)
  const hex = hash.digest('hex').slice(0, 12)
  const _filename = path.join(assetsDir, `${hex}.${type}`)
  const file: OutputFile = { basename: hex, assetsDir, ext: type }

  const pathname = filename ? filename(_filename, file) : _filename

  const _http = isHTTP(pathname)

  ctx.emitFile({
    type: 'asset',
    fileName: _http ? _filename : pathname,
    source: buffer,
  })

  return _http ? pathname : path.join('/', _filename)
}

export function bufferToBase64(image: ImageCacheItem) {
  const base64 = image.buffer.toString('base64')
  const content = `data:${getMimeType(image.type)};base64,${base64}`
  return content
}
