const isPrime = (num) => {
  if (num <= 1) return false // 0 and 1 are not prime
  for (let i = 2, s = Math.sqrt(num); i <= s; i++)
    if (num % i === 0) return false
  return true
}

export const applyFilters = (items, filters) => {
  return items.filter((item) => {
    const id = parseInt(item.id, 10)
    const passesEvenFilter = !filters.isEven || (id !== 0 && id % 2 === 0)
    const passesPrimeFilter = !filters.isPrime || isPrime(id)
    const passesEndsWithFilter =
      !filters.endsWith || item.id.endsWith(filters.endsWith)
    const passesRangeFilter = id >= filters.range.min && id <= filters.range.max

    return (
      passesEvenFilter &&
      passesPrimeFilter &&
      passesEndsWithFilter &&
      passesRangeFilter
    )
  })
}
