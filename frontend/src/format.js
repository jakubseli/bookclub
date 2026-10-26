export const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const formatDate = (isoDate) => dateFormat.format(new Date(isoDate))
