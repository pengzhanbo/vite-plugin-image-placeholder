export function generatePathRules(prefix: string) {
  return [
    '/bg/:background/text/:text/:width?/:height?{.:type}?',
    '/text/:text/bg/:background/:width?/:height?{.:type}?',
    '/text/:text/:width?/:height?{.:type}?',
    '/bg/:background/:width?/:height?{.:type}?',
    '/:width?/:height?{.:type}?',
  ].map((_) => `${prefix}${_}`)
}
