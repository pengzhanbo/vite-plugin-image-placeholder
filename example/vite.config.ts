import { defineConfig } from 'vite'
import imagePlaceholder from '../src/index'

export default defineConfig(() => ({
  build: {
    assetsInlineLimit: 0,
  },
  plugins: [imagePlaceholder({ output: true })],
}))
