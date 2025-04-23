mapboxgl.accessToken = 'sk.eyJ1IjoiYndtaXN0eSIsImEiOiJjbTl1OXk3OGQwN2RkMmtvaHdmOGo2cW1sIn0.hXmAfWCBaN4U19oi_Ssknw';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v12',
  center: [-83.9256, 34.7011], // Center on a location in North Georgia
  zoom: 9
});

// Add zoom controls
map.addControl(new mapboxgl.NavigationControl());

// Add custom icons for POIs (important for the icon image layers)
map.on('load', () => {
  // Load route images (if custom icons are used in the routes layer)
  map.loadImage('assets/icons/route.jpg', (error, image) => {
    if (error) throw error;
    map.addImage('route-icon', image);
  });

  map.loadImage('assets/icons/waterfall.jpg', (error, image) => {
    if (error) throw error;
    map.addImage('waterfall-icon', image);
  });

  map.loadImage('assets/icons/fuel.jpg', (error, image) => {
    if (error) throw error;
    map.addImage('fuel-icon', image);
  });

  map.loadImage('assets/icons/inn.jpg', (error, image) => {
    if (error) throw error;
    map.addImage('inn-icon', image);
  });

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
    })
    .catch(err => console.error("Error loading routes.geojson:", err));
    
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
          'icon-image': ['get', 'type'], // Make sure 'type' in your GeoJSON matches the icon names
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
    })
    .catch(err => console.error("Error loading pois.geojson:", err));
});
