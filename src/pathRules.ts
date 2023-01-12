import { pathToRegexp } from 'path-to-regexp'

export type FindPathRule = (pathname: string) => string | undefined

export function generatePathRules(prefix: string) {
  return [
    '/bg/:background/text/:text/:width?/:height?{.:type}?',
    '/text/:text/bg/:background/:width?/:height?{.:type}?',
    '/text/:text/:width?/:height?{.:type}?',
    '/bg/:background/:width?/:height?{.:type}?',
    '/:width?/:height?{.:type}?',
  ].map((_) => `${prefix}${_}`)
}

export function createPathRuleMatch(prefix: string): FindPathRule {
  const rules = generatePathRules(prefix).map((rule) => ({
    regexp: pathToRegexp(rule),
    rule,
  }))
  return (pathname) => rules.find(({ regexp }) => regexp.test(pathname))?.rule
}
