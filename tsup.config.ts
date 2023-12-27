import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/index.ts', 'src/bare.ts'],
  outDir: 'dist',
  format: ['esm'],
  tsconfig: './tsconfig.json',
  target: 'es2018',
  minify: false,
  minifySyntax: true,
  minifyWhitespace: false,
  minifyIdentifiers: false,
  clean: true,
  dts: true,
})
