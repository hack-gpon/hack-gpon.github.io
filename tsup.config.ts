import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['assets/ts/'],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'assets/js/generated'
})
