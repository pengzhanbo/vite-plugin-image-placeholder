import { createHash } from 'node:crypto'
import fs, { promises as fsp } from 'node:fs'
import path from 'node:path'
import type { ImageType, OutputFile, OutputFilename } from './types'

const RE_HTTP = /^https?:\/\//

const isHTTP = (url: string): boolean => RE_HTTP.test(url)

export async function bufferToFile(
  buffer: Buffer,
  type: ImageType,
  outDir: string,
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
  const output = path.join(outDir, _http ? _filename : pathname)

  const dirname = path.dirname(output)

  fs.mkdirSync(dirname, { recursive: true })
  await fsp.writeFile(output, new Uint8Array(buffer))

  return _http ? pathname : path.join('/', _filename)
}
