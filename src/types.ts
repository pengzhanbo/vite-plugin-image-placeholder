export interface ImagePlaceholderOptions {
  /**
   * 图片路径前缀
   *
   * 使用模块加载时，需要通过 `virtual:${prefix}`作为模块路径前缀
   *
   * 使用GET请求或字符串内联时，必须使用绝对路径，以 `/${prefix}` 作为路径前缀
   *
   * @default 'image/placeholder'
   */
  prefix?: string
  /**
   * 图片默认背景色，`Hex` 或者 `RGB` 格式的值
   *
   * 或者传入一组颜色数组，将会随机选择任意颜色作为默认背景色
   *
   * @default '#ccc'
   *
   */
  background?: string | string[]
  /**
   * 文本默认颜色， `Hex` 或者 `RGB` 格式的值
   *
   * @default '#333'
   */
  textColor?: string
  /**
   * 图片默认文本
   *
   * @default `${width}x${height}`
   */
  text?: string
  /**
   * 图片默认类型
   *
   * @type 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif' | 'heif' | 'gif'
   *
   * @default 'png'
   */
  type?: ImageType
  /**
   * 图片默认宽度
   *
   * @default 300
   */
  width?: number
  /**
   * 图片默认高度
   * @default `${width}x${ratio}`
   */
  height?: number
  /**
   * 图片宽高比，当未明确指定高度时，高度将根据 ratio 计算
   *
   * @default 3/4
   */
  ratio?: number
  /**
   * 图片压缩质量比率， 取值范围为 0~100， 100为不压缩
   *
   * @default 80
   */
  quality?: number
  /**
   * png 格式图片压缩等级， 取值范围为 0~9， 0 最快但质量大，9最慢但质量小
   *
   * @default 6
   */
  compressionLevel?: number
  /**
   * 生产构建时是否将资源内联到代码中
   *
   * @default false
   */
  inline?: boolean
}

export type ImageType =
  | 'jpg'
  | 'png'
  | 'jpeg'
  | 'webp'
  | 'avif'
  | 'heif'
  | 'gif'

export interface ImagePlaceholderParams {
  width?: number
  height?: number
  text?: string
  background?: string
  type?: ImageType
}

export interface ImagePlaceholderQuery {
  noise?: 0 | 1
  noiseMean?: number
  noiseSigma?: number
  textColor?: string
}

export interface ImageCacheItem {
  type: ImageType
  buffer: Buffer
}
