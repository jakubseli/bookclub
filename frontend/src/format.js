export const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const formatDate = (isoDate) => dateFormat.format(new Date(isoDate))

export function formatDay(day) {
  const [year, month, date] = day.split('-').map(Number)
  return dateFormat.format(new Date(year, month - 1, date))
}
