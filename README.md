# LiDAR Point Cloud Viewer

A web-based LiDAR point cloud viewer built with [maplibre-gl-lidar](https://github.com/opengeos/maplibre-gl-lidar).

## Live Demo

Visit [https://lidar-viewer.gishub.org](https://lidar-viewer.gishub.org)

## Usage

### Load via URL Parameter

You can load any COPC LAZ file by passing the URL as a query parameter:

```
https://lidar-viewer.gishub.org/?url=https://s3.amazonaws.com/hobu-lidar/autzen-classified.copc.laz
```

### Sample Datasets

- [Autzen Stadium (Oregon)](https://lidar-viewer.gishub.org/?url=https://s3.amazonaws.com/hobu-lidar/autzen-classified.copc.laz)
- [Madison (Wisconsin)](https://lidar-viewer.gishub.org/?url=https://data.opengeos.org/madison.copc.laz)
- [Texas Coastal Region](https://lidar-viewer.gishub.org/?url=https://data.opengeos.org/USGS_LPC_TX_CoastalRegion_2018_A18_stratmap18-50cm-2995201a1.copc.laz)

## Features

- Load COPC LAZ files from any URL
- Dynamic streaming for large point clouds
- Multiple color schemes (elevation, intensity, classification, RGB)
- Adjustable point size and opacity
- Elevation range filtering
- Classification visibility control
- 3D view with pitch and rotation

## Development

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## Credits

Built with [maplibre-gl-lidar](https://github.com/opengeos/maplibre-gl-lidar) - A MapLibre GL JS plugin for visualizing LiDAR point clouds using deck.gl.

## License

MIT License
