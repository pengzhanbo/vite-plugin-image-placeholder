import { parse as queryParse } from 'node:querystring'
import { URL } from 'node:url'
import debug from 'debug'
import colors from 'picocolors'
import rbg2hex from 'rgb-hex'
import { imageMimeType } from './constants'
import type { ImageType } from './types'

export const logger = debug('vite:plugin-image-placeholder')

export const RE_RGBA
  = /^(?:rgba?\()?(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d?\.?\d+))?(?:\))?$/

export const RE_HEX = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/

export function formatRGBA(colors: string[]) {
  const alpha = colors[3]
    ? colors[3].startsWith('.')
      ? `0${colors[3]}`
      : colors[3]
    : undefined
  return alpha === undefined
    ? `rgb(${colors[0]},${colors[1]},${colors[2]})`
    : `rgba(${colors[0]},${colors[1]},${colors[2]},${alpha})`
}

export function formatColor(color: string | string[] = '', hex = false): string {
  if (Array.isArray(color))
    return hex ? `#${rbg2hex(formatRGBA(color))}` : formatRGBA(color)

  if (RE_HEX.test(color))
    return color.startsWith('#') ? color : `#${color}`

  const match = color.match(RE_RGBA)
  if (match) {
    const alpha = match[4]
      ? match[4].startsWith('.')
        ? `0${match[4]}`
        : match[4]
      : ''
    const colors = [match[1], match[2], match[3], alpha]
    return hex ? `#${rbg2hex(formatRGBA(colors))}` : formatRGBA(colors)
  }
  return color
}

export function formatText(text: string, color: string) {
  return `<span foreground="${color}">${text}</span>`
}

export function getMimeType(type: ImageType = 'png'): string {
  return imageMimeType[type] || imageMimeType.png
}

export function getBackground(background: string | string[]) {
  if (typeof background === 'string')
    return background

  const rdm = Math.floor(Math.random() * background.length)
  return background[rdm]
}

const htmlLangRE = /\.(?:html|htm)$/

export const isHTMLRequest = (request: string) => htmlLangRE.test(request)

const nonJsRe = /\.json(?:$|\?)/
export function isNonJsRequest(request: string): boolean {
  return nonJsRe.test(request)
}

export function imageWarn(url: string) {
  console.warn(
    `${colors.yellow('[vite:image-placeholder] warn')}: ${colors.gray(
      url,
    )} The URL does not generate images correctly. Please check the URL.`,
  )
}

export function urlParse(input: string) {
  const url = new URL(input, 'http://example.com')
  const pathname = decodeURIComponent(url.pathname)
  const query = queryParse(url.search.replace(/^\?/, ''))
  return { pathname, query }
}
