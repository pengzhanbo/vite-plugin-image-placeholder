# vite-plugin-image-placeholder

占位图片插件。

在项目开发过程中，为未准备好图片资源的内容区域，生成占位图片。

## 特性

- 本地生成图片资源，缓存
- 自定义图片宽高、背景色、文字、文字颜色
- 自定义图片格式：`png`, `jpe?g`, `webp`, `avif`, `heif`, `gif`
- 支持通过模块导入
- 支持打包内联到代码中（html/css/js)
- 开发服务注入中间件，支持`GET`请求获取图片
- 灵活的路径匹配规则
- HMR

## 安装

```sh
npm i -D vite-plugin-image-placeholder
```

插件依赖 `sharp` 库生成图片资源。`sharp`在安装过程中依赖 `libvips`，在中国地区安装可能失败。

解决方式是，在 项目的根目录中的 `.npmrc` 文件中，写入以下配置:

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

**路径匹配**
```
/${prefix}/bg/:background/text/:text/:width?/:height?{.:type}?
/${prefix}/text/:text/bg/:background/:width?/:height?{.:type}?
/${prefix}/text/:text/:width?/:height?{.:type}?
/${prefix}/bg/:background/:width?/:height?{.:type}?
/${prefix}/:width?/:height?{.:type}?
```
- `width`: `type: {number}` 图片宽度
- `height`: `type: {number}` 图片高度
- `background`: `type: {hex | rgb | rgba}` 背景色
- `text`: `type: {string}` 文本
- `type`: `type: {string}` 图片格式 `png`, `jpe?g`, `webp`, `avif`, `heif`, `gif`

**query 参数**
```ts
interface Query {
  textColor: string // 文本颜色 hex | rgb | rgba
  noise: 1 | 0 // 图片噪声
  noiseMean: number // 产生噪声的像素
  noiseSigma: number // 标准偏差产生噪声的像素
}
```

# 示例

```txt
/image/placeholder
/image/placeholder/300/300
/image/placeholder.jpg
/image/placeholder/300/300.webp
/image/placeholder/text/customText
/image/placeholder/text/customText/bg/255,255,255
/image/placeholder/bg/00ffcc
/image/placeholder/bg/fff/text/customText
/image/placeholder/text/customText.png
/image/placeholder/bg/fff.png
/image/placeholder/bg/fff/400/400.png
/image/placeholder?textColor=999
/image/placeholder?textColor=220,220,220&noise=1&noiseMean=10
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

效果图：
![](/example/example.jpg)
