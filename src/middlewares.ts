import { parse as queryParse } from 'node:querystring'
import { parse as urlParse } from 'node:url'
import { match, pathToRegexp } from 'path-to-regexp'
import type { Connect } from 'vite'
import { cache } from './cache'
import { DEFAULT_PARAMS } from './constants'
import type { CreateOptions, TextOptions } from './generateImage'
import { generateImage } from './generateImage'
import { generatePathRules } from './pathRules'
import type {
  ImagePlaceholderOptions,
  ImagePlaceholderParams,
  ImagePlaceholderQuery,
} from './types'
import { formatColor, formatText, getMimeType, logger } from './utils'

export function imagePlaceholderMiddlewares(
  options: Required<ImagePlaceholderOptions>,
): Connect.NextHandleFunction {
  const pathRules = generatePathRules(options.prefix)

  return async function (req, res, next) {
    const url = req.url!

    if (!url.startsWith(options.prefix)) return next()

    if (cache.has(url)) {
      const img = cache.get(url)!
      res.setHeader('Accept-Ranges', 'bytes')
      res.setHeader('Content-Type', getMimeType(img.type))
      res.end(img.content)
      return
    }

    const { query: UrlQuery, pathname } = urlParse(url)

    const rule = pathRules.find((rule) => {
      return pathToRegexp(rule).test(pathname!)
    })
    if (!rule) return next()

    logger(pathname)

    const urlMatch = match(rule, { decode: decodeURIComponent })(pathname!) || {
      params: {
        width: options.width,
        background: options.background,
        type: options.type,
      } as ImagePlaceholderParams,
    }

    const params = urlMatch.params as ImagePlaceholderParams
    const query = queryParse(UrlQuery || '') as ImagePlaceholderQuery
    const imgType = params.type || DEFAULT_PARAMS.type!
    const width = Number(params.width) || 300
    const height = Number(params.height) || Math.ceil((width / 16) * 9)

    const createOptions: CreateOptions = {
      width,
      height,
      channels: 4,
      background: formatColor(params.background || options.background),
    }
    if (Number(query.noise) === 1) {
      createOptions.noise = {
        type: 'gaussian',
        mean:
          query.noiseMean || Math.ceil((Math.min(width, height) / 100) * 10),
        sigma: query.noiseSigma || 10,
      }
    }

    const textOptions: TextOptions = {
      dpi: Math.floor((Math.min(width, height) / 4) * 3) || 1,
      text: formatText(
        params.text || options.text || `${width}X${height}`,
        formatColor(query.textColor, true) || options.textColor,
      ),
      rgba: true,
      align: query.textAlign,
      justify: query.textJustify === 1,
      spacing: query.textSpacing,
    }

    const imgBuf = await generateImage(imgType, createOptions, textOptions)
    cache.set(url, {
      type: imgType,
      content: imgBuf,
    })
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-type', getMimeType(imgType))
    res.end(imgBuf)
  }
}
