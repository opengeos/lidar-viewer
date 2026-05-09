import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const emptyShim = fileURLToPath(new URL('./src/shims/empty-module.ts', import.meta.url));

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: [
      { find: /^buffer$/, replacement: 'buffer/' },
      // maplibre-gl-components ships dynamic imports for optional peer deps
      // (GeoTIFF/Shapefile/DuckDB converters) that this app never uses.
      // Stub them so Vite's import analysis succeeds.
      { find: '@developmentseed/deck.gl-raster/gpu-modules', replacement: emptyShim },
      { find: '@developmentseed/deck.gl-geotiff', replacement: emptyShim },
      { find: '@duckdb/duckdb-wasm', replacement: emptyShim },
      { find: 'shpjs', replacement: emptyShim },
    ],
  },
  define: {
    'global.Buffer': ['buffer', 'Buffer'],
  },
  optimizeDeps: {
    include: ['buffer'],
  },
});
