# vite-plugin-image-placeholder

<p align="center"><b>占位图片插件</b></p>
<p align="center">
<img src="/example/image-placeholder.svg" alt="logo" style="margin:auto">
</p>
<p align="center">在项目开发过程中，为未准备好图片资源的内容区域，生成占位图片。</p>

## 特性

- 🗺 本地生成图片
- 🎨 自定义图片宽高、背景色、文字、文字颜色
- 🛠 自定义图片格式：`png`, `jpe?g`, `webp`, `avif`, `heif`, `gif`, `svg`
- 🎉 灵活的路径匹配规则
- 🔥 HMR
- 🧱 支持通过模块导入
- 📥 支持打包内联到代码中（html/css/js)
- 📤 支持打包时图片输出到构建目录
- 🖥 开发服务注入中间件，支持`GET`请求获取图片


## 安装

```sh
npm i -D vite-plugin-image-placeholder
```

插件依赖 `sharp` 库生成图片资源。`sharp`在安装过程中依赖 `libvips`，在中国地区安装可能失败。解决方式是，在 项目的根目录中的 `.npmrc` 文件中，写入以下配置:

```conf
sharp_binary_host=https://npmmirror.com/mirrors/sharp
sharp_libvips_binary_host=https://npmmirror.com/mirrors/sharp-libvips
```
然后重新安装插件。


## 使用
```ts
import { defineConfig } from 'vite'
import imagePlaceholder from 'vite-plugin-image-placeholder'

export default defineConfig(() => ({
  plugins: [imagePlaceholder({
    prefix: 'image/placeholder'
  })],
}))

```

### 匹配规则

路径匹配由 [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) 提供支持。

在一个生成占位图片的路径中，URL由`pathname` + `query` 组成。
其中，`pathname` 由 `prefix` + `named parameters`构成，

- `prefix` 在引入插件时配置，默认为 `image/placeholder`。
- `named parameters` 设置占位图片的各种属性。

#### Named Parameters

支持定义图片 背景色、文本内容、文本颜色、宽度、高度、图片格式

- 背景色： `/background/:background`, 或者 `/bg/:background`
  
  exp: `/background/ccc`, `/bg/fff`, `/bg/255,255,255`

- 文本内容：`/text/:text`, 或者 `/t/:text`
  
  exp: `/text/mark`, `/t/mark`

- 文本颜色： `/textColor/:textColor`, 或者 `/color/:textColor` , 或者 `/c/:textColor` 
  
  exp: `/textColor/999`, `/color/333`, `/c/0,0,0`

- 宽度、高度、图片格式： `/:width?/:height?/{.:type}?`
  
  exp: `/300` , `/300/200`, `/300/200.png`, `.png`, `/300.png`

其中，背景色，文本内容，文本颜色 三者可以任意排列或缺省，这意味着支持：
```
/text/:text/bg/:background/textColor/:textColor
/text/:text/textColor/:textColor
/bg/:background/text/:text
/textColor/:textColor
```
宽度、高度、图片格式 三者则固定跟随在 `pathname`的尾部：
```
/text/:text/bg/:background/textColor/:textColor/:width?/:height?/{.:type}?
/text/:text/textColor/:textColor/:width?/:height?/{.:type}?
/bg/:background/text/:text/:width?/:height?/{.:type}?
/textColor/:textColor/:width?/:height?/{.:type}?
/:width?/:height?/{.:type}?
```

对于 背景色和文本颜色的 值，支持 `Hex`格式和 `RGB` 两种格式，

由于 `Hex` 中的 `#` 与 路径中的`hash` 部分冲突，所以 `Hex`的值需要省略 `#`，即 `#ccc` 需要写为 `ccc`, 路径中即为 `/bg/ccc`。

`RGB` 格式支持简写，可以是 `rgb(0,0,0)` 也可以是 `0,0,0`，如果图片格式支持透明度，还可以写 `rgba(0,0,0,0.5)`, 或`0,0,0,0.5`。

图片格式支持： `png`, `jpe?g`, `webp`, `avif`, `heif`, `gif`, `svg`


> 插件会严格校验 named parameters 各个值的格式是否符合要求，比如 颜色值必须符合 hex 和 rgb 的格式， width和height必须是整数。
> 
> 如果校验不通过，则不会生成图片，而是当做普通文本处理。


#### query 参数

query 部分是不常用的一些图片设置支持，目前主要支持了产生图片噪声。
```ts
interface Query {
  noise: 1 | 0 // 图片噪声
  noiseMean: number // 产生噪声的像素
  noiseSigma: number // 标准偏差产生噪声的像素
}
```

# 示例

```txt
/image/placeholder
/image/placeholder/300
/image/placeholder/300/200
/image/placeholder/300/300.png
/image/placeholder/t/customText
/image/placeholder/text/customText
/image/placeholder/t/customText/c/0,0,0
/image/placeholder/text/customText/textColor/0,0,0
/image/placeholder/text/customText/bg/255,255,255
/image/placeholder/bg/00ffcc
/image/placeholder/bg/00ffcc/text/customText/textColor/0,0,0
/image/placeholder/bg/fff/text/customText
/image/placeholder/text/customText.png
/image/placeholder/bg/fff.png
/image/placeholder/bg/fff/400/400.png
/image/placeholder/bg/00ffcc/text/customText/textColor/0,0,0/300/200.png
/image/placeholder?noise=1&noiseMean=10
```

在 `html` 中
```html
<img src="/image/placeholder" alt="">
<img src="/image/placeholder/200" alt="">
<img src="/image/placeholder/300/200" alt="">
```

在 `css` 中
```css
.placeholder {
  background: url('/image/placeholder');
}
```

在 `js` 中通过模块导入
```js
import placeholder from 'virtual:image/placeholder'
const img = new Image()
img.src = placeholder
```
在 `js` 中以字符串的形式内联为 `base64`
``` js
const img = new Image()
img.src = '/image/placeholder'
```

## Option

```ts
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
   * @default '#efefef'
   *
   */
  background?: string | string[]
  /**
   * 文本默认颜色， `Hex` 或者 `RGB` 格式的值
   *
   * @default '#666'
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
   * @type 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif' | 'heif' | 'gif' | 'svg'
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
   * @default 9/16
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

  /**
   * 生产构建时，输出图片资源到构建目录中
   *
   * 如果取值为 true，默认根据 vite build 配置，输出到 dist/assets，
   *
   * @default true
   */
  output?:
    | true
    | string
    | {
        dir?: string
        /**
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
```

## MIT

[GPL-3.0](/LICENSE)
