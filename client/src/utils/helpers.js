export const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''

export const truncate = (str, n = 100) =>
  str?.length > n ? str.slice(0, n) + '...' : str

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
