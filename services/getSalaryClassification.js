// Función para obtener la clasificación del salario
export function getSalaryClassification (salary, averageSalary) {
  const parsedSalary = parseInt(salary.replace('€', '').replace('.', ''))

  if (parsedSalary < averageSalary - 1000) {
    return 'Por debajo del promedio'
  } else if (parsedSalary > averageSalary + 1000) {
    return 'Por encima del promedio'
  } else {
    return 'Promedio'
  }
}
