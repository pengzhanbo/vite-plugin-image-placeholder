import MagicString from 'magic-string'
import type { Plugin, ResolvedConfig } from 'vite'
import { isCSSRequest } from 'vite'
import { contentCache } from './cache'
import { DEFAULT_PREFIX } from './constants'
import type { FindPathRule } from './pathRules'
import { createPathRuleMatch } from './pathRules'
import { pathToImage } from './pathToImage'
import { bufferToBase64, bufferToFile } from './transformBuffer'
import type { ImagePlaceholderOptions, PluginContext } from './types'
import { getMimeType, isHTMLRequest, isNonJsRequest } from './utils'

export const parseOptions = (
  options: ImagePlaceholderOptions,
): Required<ImagePlaceholderOptions> => {
  options = Object.assign(
    {
      prefix: DEFAULT_PREFIX,
      background: '#ccc',
      textColor: '#333',
      width: 300,
      type: 'png',
      quality: 80,
      compressionLevel: 6,
      ratio: 9 / 16,
      inline: false,
    } as ImagePlaceholderOptions,
    options,
  )
  options.prefix = `/${options.prefix}`.replace(/\/\//g, '/').replace(/\/$/, '')

  return options as Required<ImagePlaceholderOptions>
}

const parseOutput = (
  output: Required<ImagePlaceholderOptions>['output'],
  config: ResolvedConfig,
) => {
  const { assetsDir } = config.build
  let assets
  let filename
  if (output === true) {
    assets = assetsDir
  } else if (typeof output === 'string') {
    assets = output.replace(/^\/+/, '')
  } else {
    assets = (output!.dir || assetsDir).replace(/^\/+/, '')
    filename = output.filename
  }
  return { assetsDir: assets, filename }
}

export const createPlaceholderPattern = (prefix: string) => {
  const s = `(${prefix}.*?)`
  return new RegExp(
    `(?:"${s}")|(?:\\(${s}\\))|(?:\\('${s}'\\))|(?:\\("${s}"\\))`,
    'gu',
  )
}

function placeholderServerPlugin(
  options: ImagePlaceholderOptions = {},
): Plugin {
  const opts = parseOptions(options)
  const findPathRule = createPathRuleMatch(opts.prefix)

  return {
    name: 'vite-plugin-image-placeholder-server',
    apply: 'serve',
    async configureServer({ middlewares }) {
      middlewares.use(async function (req, res, next) {
        const url = req.url!
        if (!url.startsWith(opts.prefix)) return next()

        const image = await pathToImage(url, findPathRule, opts)

        if (!image) return next()

        res.setHeader('Accept-Ranges', 'bytes')
        res.setHeader('Content-Type', getMimeType(image.type))
        res.end(image.buffer)
      })
    },
  }
}

function placeholderImporterPlugin(
  options: ImagePlaceholderOptions = {},
): Plugin {
  const opts = parseOptions(options)
  const findPathRule = createPathRuleMatch(opts.prefix)
  const RE_VIRTUAL = /^\0virtual:\s*/
  const moduleId = `virtual:${opts.prefix.slice(1)}`
  const resolveVirtualModuleId = `\0${moduleId}`
  let config: ResolvedConfig
  let isBuild: boolean
  return {
    name: 'vite-plugin-image-placeholder-importer',
    configResolved(_config) {
      config = _config
      isBuild = config.command === 'build'
    },
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
        const image = await pathToImage(url, findPathRule, opts)
        if (image) {
          let content: string
          if (
            isBuild &&
            opts.output &&
            image.buffer.byteLength >= config.build.assetsInlineLimit
          ) {
            const { assetsDir, filename } = parseOutput(opts.output, config)
            content = await bufferToFile(
              this,
              image.buffer,
              image.type,
              assetsDir,
              filename,
            )
          } else {
            content = bufferToBase64(image)
          }
          contentCache.set(url, content)
          return `export default '${content}'`
        }
      }
    },
  }
}

function placeholderTransformPlugin(
  options: ImagePlaceholderOptions = {},
): Plugin {
  const opts = parseOptions(options)
  const findPathRule = createPathRuleMatch(opts.prefix)
  const moduleId = `virtual:${opts.prefix.slice(1)}`
  const resolveVirtualModuleId = `\0${moduleId}`
  const RE_PATTERN = createPlaceholderPattern(opts.prefix)
  let isBuild = false
  let config: ResolvedConfig
  let ctx: PluginContext
  return {
    name: 'vite-plugin-image-placeholder-transform',
    configResolved(_config) {
      config = _config
      isBuild = config.command === 'build'
    },
    async transform(code, id) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      ctx = this
      // 构建时如果未配置 inline 和 output， 则不转换，直接跳过
      if (isBuild && !opts.inline && !opts.output) {
        return
      }
      // 开发环境不对css转换，因为CSS可以直接通过 GET请求获取资源，
      // 跳过html资源，在transformIndexHtml中转换，开发环境时也是通过 GET请求获取，
      // 优化性能，跳过非js资源和 assets 资源
      if (
        (!isBuild && isCSSRequest(id)) ||
        isHTMLRequest(id) ||
        isNonJsRequest(id) ||
        config.assetsInclude(id) ||
        id.startsWith(resolveVirtualModuleId)
      ) {
        return
      }
      const result = await transformPlaceholder(
        ctx,
        code,
        RE_PATTERN,
        findPathRule,
        opts,
        config,
      )

      return result ? { code: result } : null
    },
    async transformIndexHtml(html) {
      if (!isBuild) return html
      if (!opts.inline && !opts.output) return html
      const result = await transformPlaceholder(
        ctx,
        html,
        RE_PATTERN,
        findPathRule,
        opts,
        config,
      )

      return result || html
    },
  }
}

export async function transformPlaceholder(
  ctx: PluginContext,
  code: string,
  pattern: RegExp,
  findPathRule: FindPathRule,
  opts: Required<ImagePlaceholderOptions>,
  config: ResolvedConfig,
) {
  const s = new MagicString(code)
  let hasReplaced = false
  let match
  // eslint-disable-next-line no-cond-assign
  while ((match = pattern.exec(code))) {
    const url = match[4] || match[3] || match[2] || match[1]
    const dynamic = match[0].startsWith('(') ? ['("', '")'] : ['"', '"']
    const start = match.index
    const end = start + match[0].length
    if (contentCache.has(url)) {
      hasReplaced = true
      s.update(start, end, `${dynamic[0]}${contentCache.get(url)}${dynamic[1]}`)
    } else {
      const image = await pathToImage(url, findPathRule, opts)
      if (image) {
        hasReplaced = true
        let content: string
        if (
          opts.output &&
          image.buffer.byteLength >= config.build.assetsInlineLimit &&
          config.command === 'build'
        ) {
          const { assetsDir, filename } = parseOutput(opts.output, config)
          content = await bufferToFile(
            ctx,
            image.buffer,
            image.type,
            assetsDir,
            filename,
          )
        } else {
          content = bufferToBase64(image)
        }
        contentCache.set(url, content)
        s.update(start, end, `${dynamic[0]}${content}${dynamic[1]}`)
      }
    }
  }
  if (!hasReplaced) {
    return null
  }
  return s.toString()
}

export function imagePlaceholderPlugin(
  options: ImagePlaceholderOptions = {},
): Plugin[] {
  return [
    placeholderServerPlugin(options),
    placeholderImporterPlugin(options),
    placeholderTransformPlugin(options),
  ]
}
