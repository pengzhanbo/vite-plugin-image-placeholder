export function generatePathRules(prefix: string) {
  return [
    '',
    '/:width?/:height?{.:type}?',
    '/bg/:background/:width?/:height?{.:type}?',
    '/text/:text/:width?/:height?{.:type}?',
    '/text/:text/bg/:background/:width?/:height?{.:type}?',
    '/bg/:background/text/:text/:width?/:height?{.:type}?',
  ].map((_) => `${prefix}${_}`)
}
