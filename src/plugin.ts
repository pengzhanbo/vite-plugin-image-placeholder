import type { Plugin } from 'vite'
import { DEFAULT_PREFIX } from './constants'
import { imagePlaceholderMiddlewares } from './middlewares'
import type { ImagePlaceholderOptions } from './types'

const parseOptions = (
  options: ImagePlaceholderOptions,
): Required<ImagePlaceholderOptions> => {
  options = Object.assign(
    {
      prefix: DEFAULT_PREFIX,
      background: '#ccc',
      textColor: '#999',
      width: 300,
      type: 'png',
    } as ImagePlaceholderOptions,
    options,
  )
  options.prefix = `/${options.prefix}`.replace(/\/\//g, '/').replace(/\/$/, '')

  return options as Required<ImagePlaceholderOptions>
}

export function imagePlaceholderPlugin(
  options: ImagePlaceholderOptions = {},
): Plugin {
  const opts = parseOptions(options)
  return {
    name: 'vite-plugin-image-placeholder',
    apply: 'serve',
    async configureServer({ middlewares }) {
      middlewares.use(imagePlaceholderMiddlewares(opts))
    },
  }
}
