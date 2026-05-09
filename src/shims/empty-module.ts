// Stub for optional peer dependencies of maplibre-gl-components
// (GeoTIFF/Shapefile/DuckDB converters) that the lidar viewer never uses.
// Any property access returns undefined; if a code path that needs the real
// dependency ever runs, install the real package.
const stub = new Proxy({}, { get: () => undefined });
export default stub;
