import maplibregl from 'maplibre-gl';
import { LidarControl, LidarLayerAdapter } from 'maplibre-gl-lidar';
import { LayerControl } from 'maplibre-gl-layer-control';
import 'maplibre-gl-lidar/style.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibre-gl-layer-control/style.css';
// DOM elements
const urlFormContainer = document.getElementById('url-form-container') as HTMLDivElement;
const urlForm = document.getElementById('url-form') as HTMLFormElement;
const urlInput = document.getElementById('url-input') as HTMLInputElement;
const loadBtn = document.getElementById('load-btn') as HTMLButtonElement;
const loadingIndicator = document.getElementById('loading-indicator') as HTMLDivElement;

let map: maplibregl.Map | null = null;
let lidarControl: LidarControl | null = null;
let layerControl: LayerControl | null = null;

/**
 * Initialize the MapLibre GL map instance.
 *
 * Creates a new map with a dark basemap style, 3D pitch enabled,
 * and standard navigation controls.
 *
 * Returns:
 *     The initialized MapLibre GL map instance.
 */
function initMap(): maplibregl.Map {
  if (map) return map;

  const BASEMAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
  map = new maplibregl.Map({
    container: 'map',
    style: BASEMAP_STYLE,
    center: [0, 0],
    zoom: 2,
    pitch: 60,
    maxPitch: 85,
  });

  map.addControl(new maplibregl.NavigationControl(), 'top-right');
  map.addControl(new maplibregl.FullscreenControl(), 'top-right');
  map.addControl(new maplibregl.GlobeControl(), 'top-right');
  map.addControl(new maplibregl.ScaleControl(), 'bottom-left');

  // Add layer control for basemap layers
  layerControl = new LayerControl({
    collapsed: true,
    basemapStyleUrl: BASEMAP_STYLE,
  });
  map.addControl(layerControl, 'top-right');

  return map;
}

/**
 * Initialize the LiDAR control panel.
 *
 * Creates a new LidarControl instance with default settings
 * for point size, opacity, and color scheme.
 *
 * Returns:
 *     The initialized LidarControl instance.
 */
function initLidarControl(): LidarControl {
  if (lidarControl) return lidarControl;

  lidarControl = new LidarControl({
    title: 'LiDAR Viewer',
    collapsed: false,
    panelWidth: 360,
    pointSize: 2,
    opacity: 1.0,
    colorScheme: 'elevation',
  });

  return lidarControl;
}

/**
 * Load a point cloud from the given URL.
 *
 * Initializes the map and LiDAR control if needed, loads the point cloud
 * data, and updates the UI accordingly.
 *
 * Args:
 *     url: The URL of the COPC LAZ file to load.
 */
async function loadPointCloud(url: string): Promise<void> {
  // Show loading indicator
  loadingIndicator.style.display = 'block';
  loadBtn.disabled = true;

  try {
    // Initialize map if needed
    const mapInstance = initMap();

    // Wait for map to load
    if (!mapInstance.loaded()) {
      await new Promise<void>((resolve) => {
        mapInstance.on('load', () => resolve());
      });

        // Add Google Satellite basemap
      mapInstance.addSource('google-satellite', {
        type: 'raster',
        tiles: ['https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'],
        tileSize: 256,
        attribution: '&copy; Google',
      });

      mapInstance.addLayer(
        {
          id: 'google-satellite',
          type: 'raster',
          source: 'google-satellite',
          paint: {
            'raster-opacity': 1,
          },
          layout: {
            visibility: 'none', // Hidden by default
          },
        },
      );

    }

    // Initialize LiDAR control if needed
    const control = initLidarControl();
    if (!mapInstance.hasControl(control)) {
      mapInstance.addControl(control, 'top-right');

      // Register LidarLayerAdapter with LayerControl
      if (layerControl) {
        const lidarAdapter = new LidarLayerAdapter(control);
        layerControl.registerCustomAdapter(lidarAdapter);
      }
    }

    // Clear existing point clouds
    const existingClouds = control.getPointClouds();
    for (const cloud of existingClouds) {
      control.unloadPointCloud(cloud.id);
    }

    // Load the point cloud
    const info = await control.loadPointCloud(url);
    console.log('Point cloud loaded:', info.name);
    console.log(`  - Points: ${info.pointCount.toLocaleString()}`);

    // Fly to point cloud
    control.flyToPointCloud(info.id);

    // Update URL in browser (without reload)
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('url', url);
    window.history.pushState({}, '', newUrl.toString());

    // Update page title
    const filename = url.split('/').pop() || 'Point Cloud';
    document.title = `${filename} - LiDAR Viewer`;

    // Hide form when point cloud is loaded
    urlFormContainer.style.display = 'none';
  } catch (err) {
    console.error('Failed to load point cloud:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    alert(`Failed to load point cloud: ${message}`);
  } finally {
    loadingIndicator.style.display = 'none';
    loadBtn.disabled = false;
  }
}

// Event listeners
urlForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (url) {
    loadPointCloud(url);
  }
});

// Sample URL buttons
document.querySelectorAll('.sample-urls button[data-url]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const url = btn.getAttribute('data-url');
    if (url) {
      urlInput.value = url;
      loadPointCloud(url);
    }
  });
});

// Check for URL parameter on page load
const params = new URLSearchParams(window.location.search);
const initialUrl = params.get('url');

if (initialUrl) {
  urlInput.value = initialUrl;
  loadPointCloud(initialUrl);
}
