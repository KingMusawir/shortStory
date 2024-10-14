let counter = 0

export const fetchNextItem = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = counter.toString()
      const item = {
        id,
        image: `https://picsum.photos/id/${counter % 1000}/100/100`,
      }
      counter++
      resolve(item)
    }, 100) // Simulating network delay
  })
}

export const fetchMultipleItems = (count) => {
  return Promise.all(
    Array(count)
      .fill()
      .map(() => fetchNextItem()),
  )
}
