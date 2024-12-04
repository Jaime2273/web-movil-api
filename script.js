const apiKey = '2f67a9b5ef749579a8c1e4dc12372a04';
const map = L.map('map');
const markers = [];
let capitalMarkers = [];

// Mostrar mensajes de error
function showErrorMessage(message) {
  const errorMessageDiv = document.getElementById('error-message');
  if (message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
  } else {
    errorMessageDiv.style.display = 'none';
  }
}

// Obtener la ubicación del usuario y centrar el mapa
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 10);
        fetchLocalWeather(); // Actualiza la lista de lugares cercanos
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error);
        showErrorMessage('No se pudo obtener tu ubicación. Usa el mapa.');
        map.setView([20, 0], 2); // Vista global por defecto
        fetchCapitalCities(); // Mostrar capitales
      }
    );
  } else {
    showErrorMessage('Tu navegador no soporta geolocalización.');
    map.setView([20, 0], 2); // Vista global por defecto
    fetchCapitalCities(); // Mostrar capitales
  }
}

// Añadir capa base de mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Limpiar todos los marcadores
function clearMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers.length = 0;
}

// Limpiar los marcadores de las capitales
function clearCapitalMarkers() {
  capitalMarkers.forEach(marker => map.removeLayer(marker));
  capitalMarkers.length = 0;
}

// Obtener clima local en el área visible y poblar la lista
async function fetchLocalWeather() {
  clearMarkers();
  clearCapitalMarkers(); // Asegurar que no se muestren capitales al buscar lugares cercanos
  const locationsList = document.getElementById('locations-list');
  locationsList.innerHTML = '<p>Cargando lugares cercanos...</p>';

  const bounds = map.getBounds();
  const { _southWest: sw, _northEast: ne } = bounds;

  const url = `https://api.openweathermap.org/data/2.5/find?lat=${(sw.lat + ne.lat) / 2}&lon=${(sw.lng + ne.lng) / 2}&cnt=10&units=metric&lang=es&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.list && data.list.length > 0) {
      showErrorMessage(''); // Ocultar el mensaje de error
      locationsList.innerHTML = ''; // Limpiar lista
      data.list.forEach(city => {
        const marker = L.marker([city.coord.lat, city.coord.lon]).addTo(map);
        marker.bindPopup(`
          <div class="weather-popup">
            <h3>${city.name}</h3>
            <p>Temperatura: ${city.main.temp}°C</p>
            <p>Clima: ${city.weather[0].description}</p>
          </div>
        `);
        markers.push(marker);

        // Crear elemento en la lista
        const locationItem = document.createElement('div');
        locationItem.className = 'location-item';
        locationItem.innerHTML = `
          <h3>${city.name}</h3>
          <p>Temperatura: ${city.main.temp}°C</p>
          <p>Clima: ${city.weather[0].description}</p>
        `;
        locationItem.addEventListener('click', () => {
          map.setView([city.coord.lat, city.coord.lon], 10);
          marker.openPopup();
        });
        locationsList.appendChild(locationItem);
      });
    } else {
      locationsList.innerHTML = '<p>No se encontraron ciudades cercanas.</p>';
    }
  } catch (error) {
    console.error('Error al obtener datos locales:', error);
    showErrorMessage('Error al obtener datos locales.');
  }
}

// Obtener datos de las capitales del mundo
async function fetchCapitalCities() {
  clearMarkers();
  clearCapitalMarkers(); // Asegurar que no se muestren lugares cercanos al buscar capitales
  const locationsList = document.getElementById('locations-list');
  locationsList.innerHTML = '<p>Cargando capitales...</p>';

  const url = `https://restcountries.com/v3.1/all`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    data.forEach(country => {
      if (country.capital && country.latlng) {
        const [lat, lon] = country.latlng;
        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`
          <div class="weather-popup">
            <h3>${country.capital[0]}, ${country.name.common}</h3>
          </div>
        `);
        capitalMarkers.push(marker);
      }
    });

    locationsList.innerHTML = '<p>Mostrando capitales del mundo. Usa el zoom para ver lugares cercanos.</p>';
  } catch (error) {
    console.error('Error al obtener datos de capitales:', error);
    showErrorMessage('Error al obtener datos de capitales.');
  }
}

// Cambiar entre capitales y lugares cercanos según el nivel de zoom
function handleZoomLevelChange() {
  const zoomLevel = map.getZoom();
  if (zoomLevel > 8) {
    fetchLocalWeather(); // Mostrar lugares cercanos
  } else {
    fetchCapitalCities(); // Mostrar capitales
  }
}

// Agregar eventos al mapa
map.on('zoomend', handleZoomLevelChange);
map.on('moveend', fetchLocalWeather); // Actualizar lugares cercanos al mover el mapa

// Inicializar el mapa
getUserLocation();
