// función para obtener la ubicación actual
export function getCurrentLocation () {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          resolve([coords.latitude, coords.longitude])
        },
        (error) => {
          reject(error)
        }
      )
    } else {
      reject(new Error('La geolocalización no es compatible en este navegador.'))
    }
  })
}
