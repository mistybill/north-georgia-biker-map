mapboxgl.accessToken = 'mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2xleGFzY3QwMG1sMnBwaGV2cGRyZWFsIn0.8XLsB4-abcXYZ';
'; // Replace with your token

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v12',
  center: [-83.9256, 34.7011],
  zoom: 9
});

// Add zoom controls
map.addControl(new mapboxgl.NavigationControl());

// Load GeoJSON data once map is ready
map.on('load', () => {
  // ROUTES
  fetch('data/routes.geojson')
    .then(res => res.json())
    .then(data => {
      map.addSource('routes', { type: 'geojson', data });
      map.addLayer({
        id: 'routes',
        type: 'line',
        source: 'routes',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 4
        }
      });
    });

  // POIs
  fetch('data/pois.geojson')
    .then(res => res.json())
    .then(data => {
      map.addSource('pois', { type: 'geojson', data });
      map.addLayer({
        id: 'pois',
        type: 'symbol',
        source: 'pois',
        layout: {
          'icon-image': ['concat', ['get', 'type'], '-icon'],
          'icon-size': 1.5,
          'text-field': ['get', 'name'],
          'text-offset': [0, 1.5],
          'text-anchor': 'top'
        }
      });

      // POI popups
      data.features.forEach((feature) => {
        const { geometry, properties } = feature;
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>${properties.name}</strong><br>${properties.description || ''}`
        );

        new mapboxgl.Marker({ color: '#007cbf' })
          .setLngLat(geometry.coordinates)
          .setPopup(popup)
          .addTo(map);
      });
    });
});
