/**
 * 这个测试文件对 `plugin.ts` 中的 `transformPlaceholder` 函数进行测试，
 * 用于检查可能的各种输入是否能被正确匹配并替换
 */
import { Buffer } from 'node:buffer'
import type { ResolvedConfig } from 'vite'
import { describe, expect, test, vi } from 'vitest'
import { createPathRuleMatch } from '../src/pathRules'
import {
  createPlaceholderPattern,
  parseOptions,
  transformPlaceholder,
} from '../src/plugin'
import type { PluginContext } from '../src/types'

vi.mock('../src/transformBuffer', () => {
  return {
    async bufferToFile() {
      return '[image-placeholder]'
    },
    bufferToBase64() {
      return '[image-placeholder]'
    },
  }
})

vi.mock('../src/pathToImage', () => {
  return {
    async pathToImage() {
      return { type: 'png', buffer: Buffer.from('[image-placeholder]', 'utf8') }
    },
  }
})

describe('transform in HTML', () => {
  const pattern = createPlaceholderPattern('/image/placeholder')
  const findPathRule = createPathRuleMatch('/image/placeholder')
  const transform = async (code: string) =>
    await transformPlaceholder(
      {} as PluginContext,
      code,
      pattern,
      findPathRule,
      parseOptions({}),
      {
        command: 'serve',
        build: { assetsInlineLimit: 4096 },
      } as ResolvedConfig,
    )
  test.each([
    { content: '', result: null },
    {
      content: '<img src="image/placeholder">',
      result: null,
    },
    {
      content: '<img src="/image/placeholder">',
      result: '<img src="[image-placeholder]">',
    },
    {
      content: '<img data-src="/image/placeholder/300">',
      result: '<img data-src="[image-placeholder]">',
    },
    {
      content: '<p>/image/placeholder</p>',
      result: null,
    },
    {
      content: '<img src="/public/image/placeholder">',
      result: null,
    },
    {
      content: '<style>.img{background:url(/image/placeholder)}<style>',
      result: '<style>.img{background:url("[image-placeholder]")}<style>',
    },
    {
      content: '<style>.img{background:url("/image/placeholder")}<style>',
      result: '<style>.img{background:url("[image-placeholder]")}<style>',
    },
    {
      content: '<script>const s = "/image/placeholder"</script>',
      result: '<script>const s = "[image-placeholder]"</script>',
    },
    {
      content: '<img src="/image/placeholder"><img src="/image/placeholder">',
      result: '<img src="[image-placeholder]"><img src="[image-placeholder]">',
    },
    {
      content: '<img src="/image/placeholder"><img src="image/placeholder">',
      result: '<img src="[image-placeholder]"><img src="image/placeholder">',
    },
  ])('transform: $content -> $result', async ({ content, result }) => {
    expect(await transform(content)).toBe(result)
  })
})

describe('transform in CSS', () => {
  const pattern = createPlaceholderPattern('/image/placeholder')
  const findPathRule = createPathRuleMatch('/image/placeholder')
  const transform = async (code: string) =>
    await transformPlaceholder(
      {} as PluginContext,
      code,
      pattern,
      findPathRule,
      parseOptions({}),
      {
        command: 'serve',
        build: { assetsInlineLimit: 4096 },
      } as ResolvedConfig,
    )
  test.each([
    {
      content: '.img{background: url(/image/placeholder)}',
      result: '.img{background: url("[image-placeholder]")}',
    },
    {
      content: '.img{background: url("/image/placeholder")}',
      result: '.img{background: url("[image-placeholder]")}',
    },
    {
      content: ".img{background: url('/image/placeholder')}",
      result: '.img{background: url("[image-placeholder]")}',
    },
    {
      content: '.img{background: url(/image/placeholder)}',
      result: '.img{background: url("[image-placeholder]")}',
    },
  ])('transform: $content -> $result', async ({ content, result }) => {
    expect(await transform(content)).toBe(result)
  })
})

describe('transform in JS', () => {
  const pattern = createPlaceholderPattern('/image/placeholder')
  const findPathRule = createPathRuleMatch('/image/placeholder')
  const transform = async (code: string) =>
    await transformPlaceholder(
      {} as PluginContext,
      code,
      pattern,
      findPathRule,
      parseOptions({}),
      {
        command: 'serve',
        build: { assetsInlineLimit: 4096 },
      } as ResolvedConfig,
    )
  test.each([
    {
      content: 'const s = "/image/placeholder"',
      result: 'const s = "[image-placeholder]"',
    },
    {
      content: 'import s from "virtual:image/placeholder"',
      result: null,
    },
    {
      content: 'const img = new Image(); img = "/image/placeholder"',
      result: 'const img = new Image(); img = "[image-placeholder]"',
    },
    {
      content: 'const s = "/image/" + "placeholder"',
      result: null,
    },
    {
      // eslint-disable-next-line no-template-curly-in-string
      content: 'const s = `/image/placeholder/t/${name}`',
      result: null,
    },
  ])('transform: $content -> $result', async ({ content, result }) => {
    expect(await transform(content)).toBe(result)
  })
})

describe('transform in Vue', () => {
  const pattern = createPlaceholderPattern('/image/placeholder')
  const findPathRule = createPathRuleMatch('/image/placeholder')
  const transform = async (code: string) =>
    await transformPlaceholder(
      {} as PluginContext,
      code,
      pattern,
      findPathRule,
      parseOptions({}),
      {
        command: 'serve',
        build: { assetsInlineLimit: 4096 },
      } as ResolvedConfig,
    )
  test.each([
    {
      content: `<template>
      <img src="/image/placeholder">
      </template>`,
      result: `<template>
      <img src="[image-placeholder]">
      </template>`,
    },
    {
      content: `<style>
      .img {
        background: url(/image/placeholder);
      }
      </style>
      <template>
      <img src="/image/placeholder">
      </template>`,
      result: `<style>
      .img {
        background: url("[image-placeholder]");
      }
      </style>
      <template>
      <img src="[image-placeholder]">
      </template>`,
    },
  ])('transform: $content -> $result', async ({ content, result }) => {
    expect(await transform(content)).toBe(result)
  })
})
