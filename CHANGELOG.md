## [0.2.11](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.10...v0.2.11) (2023-05-13)



## [0.2.11](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.10...v0.2.11) (2023-05-13)



## [0.2.10](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.9...v0.2.10) (2023-05-13)



## [0.2.9](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.8...v0.2.9) (2023-05-13)


### Performance Improvements

* replace `quick-lru` to `lru-cache` ([ae040c1](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/ae040c1fe2595ca414d0bd33b4a4400538b96a90))



## [0.2.8](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.7...v0.2.8) (2023-05-08)


### Features

* update cache strategy ([bf52545](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/bf525451d55c605d50afc36c97475fd20f6c8997))



## [0.2.7](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.6...v0.2.7) (2023-04-23)


### Bug Fixes

* lru-cache import ([955fb18](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/955fb18020324c12e7ad8803b21535a9bdc3e15f))



## [0.2.6](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.5...v0.2.6) (2023-02-03)



## [0.2.5](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.4...v0.2.5) (2023-01-17)


### Bug Fixes

* image text options ([78b5f1b](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/78b5f1b6ab0931fa2b894bcca9f23c47fe0992c7))



## [0.2.4](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.3...v0.2.4) (2023-01-14)


### Bug Fixes

* color pattern rgb alpha ([98d5b36](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/98d5b369209d4941faffc8f51a976a6fd7102051))



## [0.2.3](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.2...v0.2.3) (2023-01-13)


### Bug Fixes

* **utils:** match rgb alpha ([247ef60](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/247ef60a16bd106df638582cd8e653a9f7c282ae))


### Features

* add path rules ([d300f8a](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/d300f8a8ab97ccdeef27382a3964a9fc673483c9))



## [0.2.2](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.1...v0.2.2) (2023-01-12)


### Bug Fixes

* **utils:** `formatColor` match alpha empty ([2ae596e](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/2ae596e3abbe4bc21a970df9636d8d031aa1934d))



## [0.2.1](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.2.0...v0.2.1) (2023-01-12)


### Performance Improvements

* optimize path matches ([7ee6fed](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/7ee6fed812247da6b1b6ff8ac8d0e75a01148afa))



# [0.2.0](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.1.2...v0.2.0) (2023-01-11)


### Features

* add support `output` when build env ([1e1c71e](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/1e1c71e64368c4e0d2d2eebf21658fe4ab500978))
* use emitFile to output assets ([2cedf6a](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/2cedf6a1486653ac6dd7235f981d105a6cdb6148))



## [0.1.2](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.1.1...v0.1.2) (2023-01-10)


### Bug Fixes

* inline `[('"]` to `("` ([a0a56c3](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/a0a56c3f8d1511a9a3fe37ceaae7e66e205ada4b))


### Features

* add ratio option to set w/h ([e6995fb](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/e6995fb0974890555701bca875881032d8b43b1d))
* add svg support ([01da606](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/01da6062862e72b9b990a872afa7bbf704990fba))
* **types:** add comment ([e7fbc8b](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/e7fbc8b5e06222aeaeef4c724bd2cd7750e3d6fc))



## [0.1.1](https://github.com/pengzhanbo/vite-plugin-image-placeholder/compare/v0.1.0...v0.1.1) (2023-01-10)


### Bug Fixes

* inline match pattern ([62063f5](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/62063f5ccd2764708a228cc678a31fea6c1e276f))



# 0.1.0 (2023-01-10)


### Features

* 开发服务注入中间件实现占位图片请求响应 ([8a48a35](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/8a48a35e8fb3839d461b9be99819289c060035c9))
* 支持通过模块导入占位图片(base64) ([9380ebe](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/9380ebe785991c0f560d5565a296349daf52bf26))
* 支持在html/js/css资源中内联占位图片 ([f2f2c3a](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/f2f2c3ab6721a97deadeedd7092296a67ce4c06c))
* initial image-placeholder ([caf04da](https://github.com/pengzhanbo/vite-plugin-image-placeholder/commit/caf04dafb7e9898067349c5dbbcecdf5004bfed1))
