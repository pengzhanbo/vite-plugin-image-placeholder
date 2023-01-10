import MagicString from 'magic-string'
import type { Plugin, ResolvedConfig } from 'vite'
import { isCSSRequest } from 'vite'
import { contentCache } from './cache'
import { DEFAULT_PREFIX } from './constants'
import { generatePathRules } from './pathRules'
import { pathToImage } from './pathToImage'
import type { ImageCacheItem, ImagePlaceholderOptions } from './types'
import { getMimeType, isHTMLRequest, isNonJsRequest } from './utils'

const parseOptions = (
  options: ImagePlaceholderOptions,
): Required<ImagePlaceholderOptions> => {
  options = Object.assign(
    {
      prefix: DEFAULT_PREFIX,
      background: '#ccc',
      textColor: '#333',
      width: 300,
      type: 'png',
      quality: 100,
      compressionLevel: 6,
      inline: false,
    } as ImagePlaceholderOptions,
    options,
  )
  options.prefix = `/${options.prefix}`.replace(/\/\//g, '/').replace(/\/$/, '')

  return options as Required<ImagePlaceholderOptions>
}

const bufferToBase64 = (image: ImageCacheItem) => {
  const base64 = image.buffer.toString('base64')
  const content = `data:${getMimeType(image.type)};base64,${base64}`
  return content
}

function placeholderServerPlugin(
  options: ImagePlaceholderOptions = {},
): Plugin {
  const opts = parseOptions(options)
  const pathRules = generatePathRules(opts.prefix)

  return {
    name: 'vite-plugin-image-placeholder-server',
    apply: 'serve',
    async configureServer({ middlewares }) {
      middlewares.use(async function (req, res, next) {
        const url = req.url!
        if (!url.startsWith(opts.prefix)) return next()

        try {
          const image = await pathToImage(url, pathRules, opts)

          if (!image) return next()

          res.setHeader('Accept-Ranges', 'bytes')
          res.setHeader('Content-Type', getMimeType(image.type))
          res.end(image.buffer)
          return
        } catch (e) {
          console.error(e)
        }
        next()
      })
    },
  }
}

function placeholderImporterPlugin(
  options: ImagePlaceholderOptions = {},
): Plugin {
  const opts = parseOptions(options)
  const pathRules = generatePathRules(opts.prefix)
  const RE_VIRTUAL = /^\0virtual:\s*/
  const moduleId = `virtual:${opts.prefix.slice(1)}`
  const resolveVirtualModuleId = `\0${moduleId}`
  return {
    name: 'vite-plugin-image-placeholder-importer',
    resolveId(id) {
      if (id.startsWith(moduleId)) {
        return `\0${id}`
      }
    },
    async load(id) {
      if (id.startsWith(resolveVirtualModuleId)) {
        const url = `/${id.replace(RE_VIRTUAL, '')}`
        if (contentCache.has(url)) {
          return `export default '${contentCache.get(url)!}'`
        }
        const image = await pathToImage(url, pathRules, opts)
        if (image) {
          const content = bufferToBase64(image)
          contentCache.set(url, content)
          return `export default '${content}'`
        }
      }
    },
  }
}

function placeholderInlinePlugin(
  options: ImagePlaceholderOptions = {},
): Plugin {
  const opts = parseOptions(options)
  const pathRules = generatePathRules(opts.prefix)
  const moduleId = `virtual:${opts.prefix.slice(1)}`
  const resolveVirtualModuleId = `\0${moduleId}`
  const s = `(${opts.prefix}.*?)`
  const RE_PATTERN = new RegExp(
    `(?:"${s}")|(?:\\(${s}\\))|(?:\\('${s}'\\))|(?:\\("${s}"\\))`,
    'gu',
  )
  let isBuild = false
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-image-placeholder-inline',
    config(_, { command }) {
      isBuild = command === 'build'
    },
    configResolved(_config) {
      config = _config
    },
    async transform(code, id) {
      if (isBuild && !opts.inline) {
        return
      }
      if (
        (!isBuild && isCSSRequest(id)) ||
        isHTMLRequest(id) ||
        isNonJsRequest(id) ||
        config.assetsInclude(id) ||
        id.startsWith(resolveVirtualModuleId)
      ) {
        return
      }
      const s = new MagicString(code)
      let hasReplaced = false
      let match
      // eslint-disable-next-line no-cond-assign
      while ((match = RE_PATTERN.exec(code))) {
        const url = match[1] || match[2] || match[3] || match[4]
        const start = match.index
        const end = start + match[0].length
        if (contentCache.has(url)) {
          hasReplaced = true
          s.update(start, end, `"${contentCache.get(url)}"`)
        } else {
          const image = await pathToImage(url, pathRules, opts)
          if (image) {
            hasReplaced = true
            const content = bufferToBase64(image)
            contentCache.set(url, content)
            s.update(start, end, `"${content}"`)
          }
        }
      }
      if (!hasReplaced) {
        return null
      }
      return {
        code: s.toString(),
      }
    },
    async transformIndexHtml(html) {
      if (!isBuild) return html
      if (!opts.inline) return html
      const s = new MagicString(html)
      let match
      // eslint-disable-next-line no-cond-assign
      while ((match = RE_PATTERN.exec(html))) {
        const url = match[1] || match[2] || match[3] || match[4]
        const start = match.index
        const end = start + match[0].length
        if (contentCache.has(url)) {
          s.update(start, end, `"${contentCache.get(url)}"`)
        } else {
          const image = await pathToImage(url, pathRules, opts)
          if (image) {
            const content = bufferToBase64(image)
            contentCache.set(url, content)
            s.update(start, end, `"${content}"`)
          }
        }
      }
      return s.toString()
    },
  }
}

export function imagePlaceholderPlugin(
  options: ImagePlaceholderOptions = {},
): Plugin[] {
  return [
    placeholderServerPlugin(options),
    placeholderImporterPlugin(options),
    placeholderInlinePlugin(options),
  ]
}
