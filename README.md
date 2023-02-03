# vite-plugin-image-placeholder

<p align="center"><b>Image Placeholder Plugin</b></p>
<p align="center">
<img src="/example/image-placeholder.svg" alt="logo" style="margin:auto">
</p>

<p align="center">During project development, placeholder images are generated for content areas where no image resources are prepared.</p>

<p align="center">
<span>English</span> | <a href="/README.zh-CN.md">简体中文</a>
</p>

## Features

- 🗺 Generate images locally
- 🎨 Customize image width, background color, text, text color
- 🛠 Customize the image type`png`, `jpe?g`, `webp`, `avif`, `heif`, `gif`, `svg`
- 🎉 Flexible path matching rules
- 🔥 HMR
- 🧱 Support import image module  
- 📥 Support for build inline into code（html/css/js)
- 📤 Supports image output to build directory
- 🖥 Develop service injection middleware that supports `GET` requests to get images


## Install

```sh
npm i -D vite-plugin-image-placeholder
```

Plugin relies on `sharp` library to generate image resources. `sharp` relies on `libvips` during installation and may fail to install in China. The solution is to write the following configuration in `.npmrc` file at the root of the project:

```conf
sharp_binary_host=https://npmmirror.com/mirrors/sharp
sharp_libvips_binary_host=https://npmmirror.com/mirrors/sharp-libvips
```

Then reinstall the plugin.


## Usage
```ts
import { defineConfig } from 'vite'
import imagePlaceholder from 'vite-plugin-image-placeholder'

export default defineConfig(() => ({
  plugins: [imagePlaceholder({
    prefix: 'image/placeholder'
  })],
}))

```

### Match rules

Path matching is supported by [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) .

In a path to generate placeholder images, the URL consists of `pathname` + `query`.
`pathname` is composed of `prefix` + `named parameters`,

- `prefix` Configured when the plugin is provided. default: `image/placeholder`。
- `named parameters` Set the properties of the placeholder image.

#### Named Parameters

Supports the definition of image background color, text content, text color, width, height, and image type.

- background color： `/background/:background`, or `/bg/:background`
  
  exp: `/background/ccc`, `/bg/fff`, `/bg/255,255,255`

- text content：`/text/:text`, or `/t/:text`
  
  exp: `/text/mark`, `/t/mark`

- text color： `/textColor/:textColor`, or `/color/:textColor` , or `/c/:textColor` 
  
  exp: `/textColor/999`, `/color/333`, `/c/0,0,0`

- width、height、type： `/:width?/:height?/{.:type}?`
  
  exp: `/300` , `/300/200`, `/300/200.png`, `.png`, `/300.png`

Background color, text content, and text color can be arranged or default, 
which means support for:
```
/text/:text/bg/:background/textColor/:textColor
/text/:text/textColor/:textColor
/bg/:background/text/:text
/textColor/:textColor
```

Width, height and image format are fixed at the end of `pathname` :
```
/text/:text/bg/:background/textColor/:textColor/:width?/:height?/{.:type}?
/text/:text/textColor/:textColor/:width?/:height?/{.:type}?
/bg/:background/text/:text/:width?/:height?/{.:type}?
/textColor/:textColor/:width?/:height?/{.:type}?
/:width?/:height?/{.:type}?
```

Background color and text color values support both `Hex` and `RGB` formats.

Since the `#` in `Hex` conflicts with the `hash` part of the path, the value of `Hex` needs to be omitted, that is, `#ccc` needs to be written as `ccc`, and the path is `/bg/ccc`.

`RGB` format support shorthand, can be `rgb(0,0,0)` can also be `0,0,0`, if the image format supports transparency, can also write `rgba(0,0,0,0.5)`, or `0,0,0,0.5`.

Image type support： `png`, `jpe?g`, `webp`, `avif`, `heif`, `gif`, `svg`


> The plugin strictly checks whether the format of each value of the named parameters meets the requirements. For example, the color value must conform to the format of hex and rgb, and width and height must be integers.
> 
> If the check fails, the image is not generated, but treated as normal text.


#### query parameters

The query part is not commonly used some image Settings support, currently mainly support image noise.
```ts
interface Query {
  noise: 1 | 0 // image noise
  noiseMean: number // image noise mean
  noiseSigma: number // image noise sigma
}
```

# Example

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

In `html`
```html
<img src="/image/placeholder" alt="">
<img src="/image/placeholder/200" alt="">
<img src="/image/placeholder/300/200" alt="">
```

In `css`
```css
.placeholder {
  background: url('/image/placeholder');
}
```

In `js` , import modules
```js
import placeholder from 'virtual:image/placeholder'
const img = new Image()
img.src = placeholder
```
In `js`, Inline 'base64' as a string
``` js
const img = new Image()
img.src = '/image/placeholder'
```

## Option

```ts
export interface ImagePlaceholderOptions {
  /**
   * Picture path prefix
   *
   * When using modules import, you need to pass 'virtual:${prefix}' as the module path prefix
   *
   * When using GET requests or string inlining, you must use an absolute path, prefixed with '/${prefix}' as the path
   *
   * @default 'image/placeholder'
   */
  prefix?: string
  /**
   * image default background value of `Hex` or `RGB` 
   *
   * Passing in an array of colors will randomly select any color as the default background color
   *
   * @default '#efefef'
   *
   */
  background?: string | string[]
  /**
   * text default color value of `Hex` or `RGB`
   *
   * @default '#666'
   */
  textColor?: string
  /**
   * text default content
   *
   * @default `${width}x${height}`
   */
  text?: string
  /**
   * image default type 
   *
   * @type 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif' | 'heif' | 'gif' | 'svg'
   *
   * @default 'png'
   */
  type?: ImageType
  /**
   * default width
   *
   * @default 300
   */
  width?: number
  /**
   * default height
   * 
   * @default `${width}x${ratio}`
   */
  height?: number
  /**
   * Image aspect ratio. When the height is not explicitly specified, 
   * the height will be calculated according to the ratio
   *
   * @default 9/16
   */
  ratio?: number
  /**
   * Image compression quality ratio. The value ranges from 0 to 100. 
   * 100 indicates that the image is not compressed
   *
   * @default 80
   */
  quality?: number
  /**
   * png image compression level. 
   * The value ranges from 0 to 9. 
   * 0 is the fastest but has high quality, and 9 is the slowest but has low quality
   *
   * @default 6
   */
  compressionLevel?: number
  /**
   * Whether resources are inlined into code at production build time
   *
   * @default false
   */
  inline?: boolean

  /**
   * When producing a build, output the image resource to the build directory
   *
   * If the value is `true`, the default configuration is based on vite build and output to `dist/assets`.
   *
   * @default true
   */
  output?:
    | true
    | string
    | {
        dir?: string
        /**
         * Override filename. Sometimes image resources need to be published to CDN. 
         * You can change the filename here
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
