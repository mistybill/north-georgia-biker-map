mapboxgl.accessToken = 'pk.eyJ1IjoiYndtaXN0eSIsImEiOiJjbTl0eTh5eDcwM3dsMmtvbHlwdTJtaTE3In0.y5vcdmYfqHCrTPz3OFyMCg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v12',
  center: [-83.9256, 34.7011],
  zoom: 9
});

// Add zoom controls
map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
  // 👇 Load custom icons for POIs
  const icons = ['fuel', 'waterfall', 'inn'];
  icons.forEach(name => {
    map.loadImage(`assets/icons/${name}.png`, (error, image) => {
      if (error) throw error;
      if (!map.hasImage(`${name}-icon`)) {
        map.addImage(`${name}-icon`, image);
      }
    });
  });

  // 👇 Load ROUTES GeoJSON
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

  // 👇 Load POIs after a slight delay to make sure icons are loaded
  fetch('data/pois.geojson')
    .then(res => res.json())
    .then(data => {
      map.addSource('pois', { type: 'geojson', data });

      setTimeout(() => {
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

        // Add popups + markers
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
      }, 500); // delay to ensure icons are loaded
    })
    .catch(err => console.error("Error loading pois.geojson:", err));
});
