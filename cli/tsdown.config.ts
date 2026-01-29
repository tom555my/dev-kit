import { defineConfig } from 'tsdown';
import Raw from 'unplugin-raw/rolldown'

export default defineConfig({
  entry: ['./src/cli.ts'],
  exports: true,
  target: 'node20',
  outDir: 'dist',
  clean: true,
  dts: true,
  sourcemap: true,
  shims: true,
  inlineOnly: false,
  plugins: [Raw()],
});
