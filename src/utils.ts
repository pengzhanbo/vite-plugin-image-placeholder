import debug from 'debug'
import rbg2hex from 'rgb-hex'
import { imageMimeType } from './constants'
import type { ImageType } from './types'

export const logger = debug('vite:plugin-image-placeholder')

export const RE_RGBA =
  /^(?:rgba?\()?(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d?.?\d))?(?:\))?$/

export const RE_HEX = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/

export const formatRGBA = (colors: string[]) => {
  const alpha = colors[3]
    ? colors[3].startsWith('.')
      ? `0${colors[3]}`
      : colors[3]
    : '1'
  return `rgba(${colors[0]},${colors[1]},${colors[2]},${alpha})`
}

export const formatColor = (
  color: string | string[] = '',
  hex = false,
): string => {
  if (Array.isArray(color)) {
    return hex ? `#${rbg2hex(formatRGBA(color))}` : formatRGBA(color)
  }
  if (RE_HEX.test(color)) {
    return color.startsWith('#') ? color : `#${color}`
  }
  const match = color.match(RE_RGBA)
  if (match) {
    const alpha = match[4]
      ? match[4].startsWith('.')
        ? `0${match[4]}`
        : match[4]
      : '1'
    const colors = [match[1], match[2], match[3], alpha]
    return hex ? `#${rbg2hex(formatRGBA(colors))}` : formatRGBA(colors)
  }
  return color
}

export const formatText = (text: string, color: string) => {
  return `<span font-family="monospace" foreground="${color}">${text}</span>`
}

export const getMimeType = (type: ImageType = 'png'): string => {
  return imageMimeType[type] || imageMimeType.png
}

export const getBackground = (background: string | string[]) => {
  if (typeof background === 'string') {
    return background
  }
  const rdm = Math.floor(Math.random() * background.length)
  return background[rdm]
}
