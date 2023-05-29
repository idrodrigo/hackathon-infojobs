/* eslint-disable no-undef */
import placeholder from '../../../../../../placeholder.png'
import { getCurrentLocation } from './getUserLocation.js'
// Función para añadir un marcador en la ubicación actual
export async function addCurrentLocationMarker () {
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
