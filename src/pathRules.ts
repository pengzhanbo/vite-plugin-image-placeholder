import { pathToRegexp } from 'path-to-regexp'

export type FindPathRule = (pathname: string) => string | undefined

const pattern
  = /([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8}|rgba?\(\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*\d?\.?\d+)?\)|\d{1,3},\s*\d{1,3}?,\s*\d{1,3}?(?:,\s*\d?\.?\d+)?)/
    .source

const background = `/(bg|background)/:background${pattern}`
const text = '/(text|t)/:text'
const textColor = `/(textColor|color|c)/:textColor${pattern}`
const last = '/:width(\\d+)?/:height(\\d+)?{.:type}?'

export function generatePathRules(prefix: string) {
  return [
    `${background}${text}${textColor}`,
    `${background}${textColor}${text}`,
    `${text}${background}${textColor}`,
    `${text}${textColor}${background}`,
    `${textColor}${background}${text}`,
    `${textColor}${text}${background}`,
    `${background}${text}`,
    `${text}${background}`,
    `${background}${textColor}`,
    `${textColor}${background}`,
    `${text}${textColor}`,
    `${textColor}${text}`,
    background,
    text,
    textColor,
    '',
  ].map(_ => `${prefix}${_}${last}`)
}

export function createPathRuleMatch(prefix: string): FindPathRule {
  const rules = generatePathRules(prefix).map(rule => ({
    regexp: pathToRegexp(rule),
    rule,
  }))
  return pathname => rules.find(({ regexp }) => regexp.test(pathname))?.rule
}
