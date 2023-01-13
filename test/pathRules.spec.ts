/**
 * 这个测试文件的目的，是测试定义的 路径匹配规则是否符合期望。
 */
import { match as pathMatch } from 'path-to-regexp'
import { describe, expect, test } from 'vitest'
import { createPathRuleMatch } from '../src/pathRules'

describe('path pattern truthy', () => {
  const findPathRule = createPathRuleMatch('/image/placeholder')
  const matches = (pathname: string): boolean => !!findPathRule(pathname)
  test.each(
    [
      // -- width height type --- start ---
      '',
      '.png',
      '.jpg',
      '.jpeg',
      '.svg',
      '.gif',
      '.heif',
      '.avif',
      '.webp',
      '/300',
      '/300/200',
      '/300.png',
      '/300/200.png',
      '/bg/ccc',
      '/bg/00ffcc',
      '/bg/00ffccff',
      '/bg/255,255,255',
      '/bg/255,255,255,1',
      '/bg/rgb(255,255,255)',
      '/bg/rgba(255,255,255,1)',
      '/bg/ccc.png',
      '/bg/ccc/300',
      '/bg/ccc/300/200',
      '/bg/ccc/300/200.png',
      '/background/ccc',
      '/bg/ccc/text/mark',
      '/bg/ccc/text/mark.jpg',
      '/bg/ccc/text/mark/300',
      '/bg/ccc/text/mark/300/200.jpg',
      '/background/ccc/text/mark',
      '/text/文本',
      '/text/mark/300',
      '/text/mark/300/200',
      '/text/mark.jpg',
      '/text/mark/300.png',
      '/text/mark/bg/ccc',
      '/text/mark/bg/ccc.jpg',
      '/text/mark/bg/ccc/300',
      '/text/mark/bg/ccc/300/200.jpg',
      '/text/mark/background/ccc',
      '/t/mark',
      '/t/mark/bg/ccc',
      '/textColor/222',
      '/color/222',
      '/c/222',
      '/color/fff/bg/000',
      '/bg/fff/t/mark/c/000/300/200.png',
    ].map((path) => `/image/placeholder${path}`),
  )('path: %s', (pathname) => {
    expect(matches(pathname)).toBeTruthy()
  })
})

describe('path matches falsy', () => {
  const findPathRule = createPathRuleMatch('/image/placeholder')
  const matches = (pathname: string): boolean => !!findPathRule(pathname)
  test.each(
    [
      '/ee',
      '/cc/bb',
      '/ee.jpg',
      '/ee/cc.jpg',
      '/bg/ggg',
      '/bg/ggg/text',
      '/b/gggg',
      '/text/mark/bg/ccc/c/ggg',
    ].map((path) => `/image/placeholder${path}`),
  )('path: %s', (pathname) => {
    expect(matches(pathname)).toBeFalsy()
  })
})

describe('path matches parse', () => {
  const findPathRule = createPathRuleMatch('/image/placeholder')
  const parse = (pathname: string) => {
    const rule = findPathRule(pathname)
    if (rule) {
      const res = pathMatch(rule, { decode: decodeURIComponent })(pathname)
      return (res as any)?.params || {}
    }
    return {}
  }

  test.each(
    [
      { pathname: '', expected: {} },
      { pathname: '/300', expected: { width: '300' } },
      { pathname: '/300/200', expected: { width: '300', height: '200' } },
      { pathname: '.jpg', expected: { type: 'jpg' } },
      { pathname: '/bg/ccc', expected: { background: 'ccc' } },
      { pathname: '/bg/255,255,255', expected: { background: '255,255,255' } },
      { pathname: '/background/fff', expected: { background: 'fff' } },
      { pathname: '/t/mark', expected: { text: 'mark' } },
      { pathname: '/text/mark', expected: { text: 'mark' } },
      { pathname: '/color/ccc', expected: { textColor: 'ccc' } },
      { pathname: '/textColor/ccc', expected: { textColor: 'ccc' } },
      { pathname: '/c/ccc', expected: { textColor: 'ccc' } },
      {
        pathname: '/bg/ccc/text/mark',
        expected: { text: 'mark', background: 'ccc' },
      },
      {
        pathname: '/text/mark/bg/ccc',
        expected: { text: 'mark', background: 'ccc' },
      },
      {
        pathname: '/bg/ccc/text/mark/300/200.jpg',
        expected: {
          background: 'ccc',
          text: 'mark',
          width: '300',
          height: '200',
          type: 'jpg',
        },
      },
    ].map(({ pathname, expected }) => ({
      pathname: `/image/placeholder${pathname}`,
      expected,
    })),
  )('path: $pathname -> $expected', ({ pathname, expected }) => {
    expect(parse(pathname)).toMatchObject(expected)
  })
})
