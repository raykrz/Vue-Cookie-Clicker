const UNITS = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp']

export function formatNumber(num) {
  const sign = num < 0 ? '-' : ''
  let value = Math.abs(num)

  if (value < 1000) return sign + Math.floor(value)

  let unitIndex = -1
  while (value >= 1000 && unitIndex < UNITS.length - 1) {
    value /= 1000
    unitIndex++
  }

  const rounded = Math.floor(value * 10) / 10
  return sign + rounded.toFixed(1).replace(/\.0$/, '') + UNITS[unitIndex]
}
