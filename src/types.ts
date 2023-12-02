import type { Buffer } from 'node:buffer'
import type { Plugin } from 'vite'

export interface ImagePlaceholderOptions {
  /**
   * Image path prefix,
   * When using module loading, you need to use `virtual:${prefix}` as the module path prefix.
   * When using GET requests or inline strings,
   * you must use absolute paths with `/${prefix}` as the path prefix.
   *
   * 图片路径前缀，
   * 使用模块加载时，需要通过 `virtual:${prefix}`作为模块路径前缀。
   * 使用GET请求或字符串内联时，必须使用绝对路径，以 `/${prefix}` 作为路径前缀
   * @default 'image/placeholder'
   */
  prefix?: string
  /**
   * The default background color of the image is in `Hex` or `RGB` format.
   * Alternatively, if a set of color arrays is passed,
   * any color will be randomly selected as the default background color.
   *
   * 图片默认背景色，`Hex` 或者 `RGB` 格式的值，
   * 或者传入一组颜色数组，将会随机选择任意颜色作为默认背景色
   * @default '#ccc'
   */
  background?: string | string[]
  /**
   * 文本默认颜色， `Hex` 或者 `RGB` 格式的值
   *
   * @default '#333'
   */
  textColor?: string
  /**
   * Default text for image
   *
   * 图片默认文本
   * @default `${width}x${height}`
   */
  text?: string
  /**
   * Default image type
   *
   * 图片默认类型
   * @type 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif' | 'heif' | 'gif'
   * @default 'png'
   */
  type?: ImageType
  /**
   * Default image width
   *
   * 图片默认宽度
   * @default 300
   */
  width?: number
  /**
   * Default image height
   *
   * 图片默认高度
   * @default `${width}x${ratio}`
   */
  height?: number
  /**
   * Image aspect ratio, when the height is not explicitly specified,
   * will be calculated based on the ratio.
   *
   * 图片宽高比，当未明确指定高度时，高度将根据 ratio 计算
   * @default 9/16
   */
  ratio?: number
  /**
   * The compression quality ratio of the image,
   * with a value range of 0 to 100, where 100 means no compression.
   *
   * 图片压缩质量比率， 取值范围为 0~100， 100为不压缩
   * @default 80
   */
  quality?: number
  /**
   * PNG format image compression level,
   * with a range of values from 0 to 9. 0 is the fastest but with larger file size,
   * while 9 is the slowest but with smaller file size.
   *
   * png 格式图片压缩等级， 取值范围为 0~9， 0 最快但质量大，9最慢但质量小
   * @default 6
   */
  compressionLevel?: number
  /**
   * Whether to inline resources into the code during production build.
   *
   * 生产构建时是否将资源内联到代码中
   * @default false
   */
  inline?: boolean

  /**
   * When building production, output image resources to the build directory.
   * If the value is true, by default it will be outputted to dist/assets according
   * to the Vite build configuration.
   *
   * 生产构建时，输出图片资源到构建目录中，
   * 如果取值为 true，默认根据 vite build 配置，输出到 dist/assets
   * @default true
   */
  output?:
    | true
    | string
    | {
      dir?: string
      /**
       * Rewrite filename. Sometimes image resources need to be published on CDN,
       * and you can modify the file name here.
       *
       * 重写 filename，有时候图片资源需要发布到CDN，可以在这里修改文件名称
       */
      filename?: OutputFilename
    }
}

export type OutputFilename = (filename: string, file: OutputFile) => string

export interface OutputFile {
  basename: string
  assetsDir: string
  ext: string
}

export type ImageType =
  | 'jpg'
  | 'png'
  | 'jpeg'
  | 'webp'
  | 'avif'
  | 'heif'
  | 'gif'
  | 'svg'

export interface ImagePlaceholderParams {
  width?: number
  height?: number
  text?: string
  textColor?: string
  background?: string
  type?: ImageType
}

export interface ImagePlaceholderQuery {
  noise?: 0 | 1
  noiseMean?: number
  noiseSigma?: number
}

export interface ImageCacheItem {
  type: ImageType
  buffer: Buffer
}

export type PluginContext<T = Plugin['load']> = T extends (
  this: infer R,
  ...args: any[]
) => any
  ? R
  : never
