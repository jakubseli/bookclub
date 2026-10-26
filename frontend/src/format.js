export const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const formatDate = (isoDate) => dateFormat.format(new Date(isoDate))

export function formatDay(day) {
  const [year, month, date] = day.split('-').map(Number)
  return dateFormat.format(new Date(year, month - 1, date))
}

const DAY_MS = 24 * 60 * 60 * 1000

function dayNumber(isoDay) {
  const [year, month, date] = isoDay.split('-').map(Number)
  return Date.UTC(year, month - 1, date) / DAY_MS
}

function todayNumber() {
  const now = new Date()
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS
}

export function readingStatus(from, until, today = todayNumber()) {
  const total = dayNumber(until) - dayNumber(from) + 1
  const day = today - dayNumber(from) + 1
  const progress = Math.min(Math.max(day / total, 0), 1)
  if (day < 1) {
    return { progress, label: `Starts in ${plural(1 - day, 'day')}` }
  }
  if (day > total) {
    return { progress, label: 'Finished' }
  }
  return { progress, label: `Day ${day} of ${total}` }
}
