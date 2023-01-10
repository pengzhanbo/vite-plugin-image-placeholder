# vite-plugin-image-placeholder

占位图片插件。

在项目开发过程中，为未准备好图片资源的内容区域，生成占位图片。

## 安装

> 还未正式发布到 npm

```sh
npm i -D vite-plugin-image-placeholder
```

由于插件以来 `sharp` 库生成图片资源。`sharp`在安装过程中依赖 `libvips`，在中国地区安装可能失败。

解决方式是，在 项目的根目录中的 `.npmrc` 文件中，写入以下配置：

```conf
sharp_binary_host=https://npmmirror.com/mirrors/sharp
sharp_libvips_binary_host=https://npmmirror.com/mirrors/sharp-libvips
```

## 使用
```ts
import { defineConfig } from 'vite'
import imagePlaceholder from 'vite-plugin-image-placeholder'

export default defineConfig(() => ({
  plugins: [imagePlaceholder({
    prefix: 'image/placeholder' // 图片路径前缀
  })],
}))

```

### 匹配规则
```ts
const rules = [
    '',
    '/:width?/:height?{.:type}?',
    '/bg/:background/:width?/:height?{.:type}?',
    '/text/:text/:width?/:height?{.:type}?',
    '/text/:text/bg/:background/:width?/:height?{.:type}?',
    '/bg/:background/text/:text/:width?/:height?{.:type}?',
  ].map((rule) => `${prefix}${rule}`)
```
- width
- height
- background
- text
- type


# 示例

```html
<img src="/image/placeholder" alt="">
<img src="/image/placeholder/200" alt="">
<img src="/image/placeholder/300/200" alt="">
<img src="/image/placeholder/bg/255,255,255" alt="">
<img src="/image/placeholder/text/人生如梦" alt="">
<img src="/image/placeholder/bg/00ffcc/text/youcan" alt="">
<img src="/image/placeholder/text/i can/bg/ccffcc" alt="">
<img src="/image/placeholder/bg/255,255,255/30/200" alt="">

```

## TODO

- [x] 开发时为 `GET` 请求的生成图片
- [ ] 为通过模块引入的资源生成图片资源
- [ ] 在构建项目时将占位图片内联到代码中
