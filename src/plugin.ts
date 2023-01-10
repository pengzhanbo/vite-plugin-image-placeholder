import type { Plugin } from 'vite'
import { contentCache } from './cache'
import { DEFAULT_PREFIX } from './constants'
import { generatePathRules } from './pathRules'
import { pathToImage } from './pathToImage'
import type { ImagePlaceholderOptions } from './types'
import { getMimeType } from './utils'

const parseOptions = (
  options: ImagePlaceholderOptions,
  server = false,
): Required<ImagePlaceholderOptions> => {
  options = Object.assign(
    {
      prefix: DEFAULT_PREFIX,
      background: '#ccc',
      textColor: '#333',
      width: 300,
      type: 'png',
    } as ImagePlaceholderOptions,
    options,
  )
  options.prefix = `/${options.prefix}`.replace(/\/\//g, '/').replace(/\/$/, '')

  if (!server) {
    options.prefix = options.prefix.slice(1)
  }

  return options as Required<ImagePlaceholderOptions>
}

function placeholderServerPlugin(
  options: ImagePlaceholderOptions = {},
): Plugin {
  const opts = parseOptions(options, true)
  const pathRules = generatePathRules(opts.prefix)

  return {
    name: 'vite-plugin-image-placeholder-server',
    apply: 'serve',
    async configureServer({ middlewares }) {
      middlewares.use(async function (req, res, next) {
        const url = req.url!
        if (!url.startsWith(opts.prefix)) return next()
        // logger(url)

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

function placeholderInjectPlugin(
  options: ImagePlaceholderOptions = {},
): Plugin {
  const opts = parseOptions(options)
  const pathRules = generatePathRules(opts.prefix)
  const RE_VIRTUAL = /^\0virtual:\s*/
  const moduleId = `virtual:${opts.prefix}`
  const resolveVirtualModuleId = `\0${moduleId}`
  return {
    name: 'vite-plugin-image-placeholder-inject',
    resolveId(id) {
      if (id.startsWith(moduleId)) {
        return `\0${id}`
      }
    },
    async load(id) {
      if (id.startsWith(resolveVirtualModuleId)) {
        const url = id.replace(RE_VIRTUAL, '')
        if (contentCache.has(url)) {
          return `export default '${contentCache.get(url)!}'`
        }
        const image = await pathToImage(url, pathRules, opts)
        if (image) {
          const base64 = image.buffer.toString('base64')
          const content = `data:${getMimeType(image.type)};base64,${base64}`
          contentCache.set(url, content)
          return `export default '${content}'`
        }
      }
    },
  }
}

export function imagePlaceholderPlugin(
  options: ImagePlaceholderOptions = {},
): Plugin[] {
  return [placeholderServerPlugin(options), placeholderInjectPlugin(options)]
}
