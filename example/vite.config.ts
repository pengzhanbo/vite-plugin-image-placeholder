import { defineConfig } from 'vite'
import imagePlaceholder from '../src/index'

export default defineConfig(() => ({
  plugins: [imagePlaceholder({ inline: false })],
}))
