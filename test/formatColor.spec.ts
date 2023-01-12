import { describe, expect, test } from 'vitest'
import { formatColor } from '../src/utils'

describe('Color to Hex', () => {
  test.each([
    ['ccc', '#ccc'],
    ['#ccc', '#ccc'],
    ['cccccc', '#cccccc'],
    ['255,255,255', '#ffffff'],
    ['255,255,255,1', '#ffffffff'],
    ['255,255,255,0', '#ffffff00'],
    ['rgb(0,0,0)', '#000000'],
    ['rgba(0,0,0,1)', '#000000ff'],
    ['0, 0, 0', '#000000'],
  ])('%s -> %s', (source, target) => {
    expect(formatColor(source, true)).toBe(target)
  })
})

describe('RGB Like to RGB', () => {
  test.each([
    ['255,255,255', 'rgb(255,255,255)'],
    ['255, 255, 255', 'rgb(255,255,255)'],
    ['255,255,255,1', 'rgba(255,255,255,1)'],
    ['255,255,255,.1', 'rgba(255,255,255,0.1)'],
    ['255,255,255,0.1', 'rgba(255,255,255,0.1)'],
    ['rgb(255,255,255)', 'rgb(255,255,255)'],
    ['rgba(255,255,255,1)', 'rgba(255,255,255,1)'],
    ['rgba(255,255,255)', 'rgb(255,255,255)'],
    ['rgb(255,255,255,1)', 'rgba(255,255,255,1)'],
  ])('%s -> %s', (source, target) => {
    expect(formatColor(source)).toBe(target)
  })
})
