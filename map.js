let map = L.map('map', { zoomControl: false }).setView(1,1], 13);
let isFocused = true;
let isSatellite = false;
let activeMarker = null;
const layers = {
  street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }),
  topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenTopoMap contributors'
  }),
  carto: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CARTO'
  }),
  dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors & CartoDB'
  })
};

let currentLayer; // just declare

// Initialize based on dark mode
if (document.body.classList.contains('dark')) {
  currentLayer = layers.dark;
} else {
  currentLayer = layers.street;
}
currentLayer.addTo(map);
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.attributeName === 'class') {
      if (document.body.classList.contains('dark')) {
        map.removeLayer(currentLayer);
        currentLayer = layers.dark;
        map.addLayer(currentLayer);
      } else {
        map.removeLayer(currentLayer);
        currentLayer = layers.street;
        map.addLayer(currentLayer);
      }
    }
  });
});

observer.observe(document.body, { attributes: true });
function toggleMapView() {
  map.removeLayer(currentLayer);
  if (currentLayer === layers.street) currentLayer = layers.topo;
  else if (currentLayer === layers.topo) currentLayer = layers.carto;
  else if (currentLayer === layers.carto) currentLayer = layers.street;
  map.addLayer(currentLayer);
}

function getUserLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported");
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    map.setView([latitude, longitude], 13);
    if (activeMarker) map.removeLayer(activeMarker);
    activeMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("You are here").openPopup();
  }, () => alert("Unable to retrieve location"), { enableHighAccuracy: true });
}
// Toggle Map View
function toggleMapFocus() {
  if (isFocused) {
    map.dragging.disable();
    map.scrollWheelZoom.disable();
  } else {
    map.dragging.enable();
    map.scrollWheelZoom.enable();
  }
  isFocused = !isFocused;
}
function resetToNorth() {
  map.setView([1,1], map.getZoom());
}

