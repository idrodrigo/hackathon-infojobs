/* eslint-disable no-undef */
import blue from './public/blue.png'
import orange from './public/orange.png'
import green from './public/green.png'
import placeholder from './public/placeholder.png'

import { barcelona } from './data/dataBarcelona.js'
import { madrid } from './data/dataMadrid.js'
import { sevilla } from './data/dataSevilla.js'
import { getCurrentLocation } from './services/getUserLocation.js'
import { getSalaryClassification } from './services/getSalaryClassification.js'

let simulatedData = barcelona

const cityCoordinates = {
  Barcelona: { latitude: 41.3851, longitude: 2.1734 },
  Madrid: { latitude: 40.4168, longitude: -3.7038 },
  Sevilla: { latitude: 37.3891, longitude: -5.9845 }
}

getCurrentLocation()
  .then((coordinates) => {
    console.log('Coordenadas de geolocalización:', coordinates)
  })
  .catch((error) => {
    console.error('Error al obtener la geolocalización:', error)
  })

// Crea el mapa y centra la vista en Barcelona por defecto
const defaultCity = 'Barcelona'
const defaultCoordinates = cityCoordinates[defaultCity]
const map = L.map('map').setView([defaultCoordinates.latitude, defaultCoordinates.longitude], 16)

// Agrega el mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  minZoom: 15,
  attribution: 'Map data &copy; OpenStreetMap contributors'
}).addTo(map)

// Función para cambiar la vista del mapa según la ciudad seleccionada
function changeMapView (city) {
  const coordinates = cityCoordinates[city]
  map.setView([coordinates.latitude, coordinates.longitude], 16)

  // Cambia el valor de simulatedData según la ciudad seleccionada
  if (city === 'Barcelona') {
    simulatedData = barcelona
  } else if (city === 'Madrid') {
    simulatedData = madrid
  } else if (city === 'Sevilla') {
    simulatedData = sevilla
  }
}

async function addCurrentLocationMarker () {
  const icon = L.icon({
    iconUrl: placeholder, // Ruta de la imagen personalizada
    iconSize: [24, 40], // Tamaño del icono
    iconAnchor: [20, 40], // Punto de anclaje del icono
    popupAnchor: [0, -40], // Punto de anclaje del mensaje emergente
    shadowUrl: 'https://cdn.jsdelivr.net/leaflet/1.0.0/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
    className: 'custom-marker'
  })
  const marker = L.marker(await getCurrentLocation(), { icon }).addTo(map)
  marker.bindPopup('¡Estás aquí!')
}

// Añade el marcador de la ubicación actual
addCurrentLocationMarker()

// Calcula el salario promedio
const salaries = simulatedData.items.map((job) => {
  const parsedSalary = parseInt(job.salaryMin.value.replace('€', '').replace('.', ''))
  return isNaN(parsedSalary) || job.salaryMin.value === '' ? 0 : parsedSalary
})

const nonEmptySalaries = salaries.filter((salary) => salary !== 0)
const averageSalary = nonEmptySalaries.reduce((a, b) => a + b, 0) / nonEmptySalaries.length

// Itera sobre los trabajos simulados y agrega marcadores al mapa
simulatedData.items.forEach((job) => {
  const title = job.title
  const salaryMin = job.salaryMin.value
  const salaryMax = job.salaryMax.value
  const city = job.city
  const latitude = cityCoordinates[city].latitude + (Math.random() * 0.04 - 0.02) // Genera una pequeña variación en la latitud
  const longitude = cityCoordinates[city].longitude + (Math.random() * 0.04 - 0.02) // Genera una pequeña variación en la longitud
  const classification = getSalaryClassification(salaryMin, averageSalary)
  const link = job.link
  // Determinar el color del icono según la clasificación
  let iconUrl = blue
  if (classification === 'Por debajo del promedio') {
    iconUrl = orange
  } else if (classification === 'Promedio') {
    iconUrl = blue
  } else if (classification === 'Por encima del promedio') {
    iconUrl = green
  }

  // Crea un marcador en el mapa para cada trabajo
  const marker = L.marker([latitude, longitude], {
    icon: L.icon({
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
      shadowUrl: 'https://cdn.jsdelivr.net/leaflet/1.0.0/images/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
      className: 'custom-marker'
    })
  }).addTo(map)
  marker.bindPopup(`Título: ${title}<br>Salario: ${salaryMin} - ${salaryMax}<br>Ciudad: ${city}<br>Clasificación: ${classification}
    <br><a href=${link} target="_blank"><button>Ir</button></a>`)
})

// Obtén el elemento select del HTML
const citySelect = document.getElementById('city-select')

// Llena el select con las ciudades disponibles en cityCoordinates
Object.keys(cityCoordinates).forEach((city) => {
  const option = document.createElement('option')
  option.value = city
  option.textContent = city
  citySelect.appendChild(option)
})

// Agrega el evento de cambio al select para cambiar la vista del mapa y los datos simulados
citySelect.addEventListener('change', (event) => {
  const selectedCity = event.target.value
  changeMapView(selectedCity)

  // Limpia los marcadores existentes en el mapa
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer)
    }
  })

  // Añade el marcador de la ubicación actual
  addCurrentLocationMarker()

  // Calcula el salario promedio
  const salaries = simulatedData.items.map((job) => {
    const parsedSalary = parseInt(job.salaryMin.value.replace('€', '').replace('.', ''))
    return isNaN(parsedSalary) || job.salaryMin.value === '' ? 0 : parsedSalary
  })

  const nonEmptySalaries = salaries.filter((salary) => salary !== 0)
  const averageSalary = nonEmptySalaries.reduce((a, b) => a + b, 0) / nonEmptySalaries.length

  // Itera sobre los trabajos simulados y agrega marcadores al mapa
  simulatedData.items.forEach((job) => {
    const title = job.title
    const salaryMin = job.salaryMin.value
    const salaryMax = job.salaryMax.value
    const city = job.city
    const latitude = cityCoordinates[city].latitude + (Math.random() * 0.04 - 0.02) // Genera una pequeña variación en la latitud
    const longitude = cityCoordinates[city].longitude + (Math.random() * 0.04 - 0.02) // Genera una pequeña variación en la longitud
    const classification = getSalaryClassification(salaryMin, averageSalary)
    const link = job.link
    // Determinar el color del icono según la clasificación
    let iconUrl = blue
    if (classification === 'Por debajo del promedio') {
      iconUrl = orange
    } else if (classification === 'Promedio') {
      iconUrl = blue
    } else if (classification === 'Por encima del promedio') {
      iconUrl = green
    }

    // Crea un marcador en el mapa para cada trabajo
    const marker = L.marker([latitude, longitude], {
      icon: L.icon({
        iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
        shadowUrl: 'https://cdn.jsdelivr.net/leaflet/1.0.0/images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41],
        className: 'custom-marker'
      })
    }).addTo(map)
    marker.bindPopup(`Título: ${title}<br>Salario: ${salaryMin} - ${salaryMax}<br>Ciudad: ${city}<br>Clasificación: ${classification}
      <br><a href=${link} target="_blank"><button>Ir</button></a>`)
  })
})
