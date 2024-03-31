import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: false,
  dts: true,
  splitting: false,
  clean: true,
  minify: true,
  shims: true,
  format: ['esm'],
})
