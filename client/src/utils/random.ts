export const generateRandomArray = (size: number, min: number = 1, max: number = 100): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

export const generateSortedArray = (size: number, min: number = 1, max: number = 100): number[] => {
  const arr = generateRandomArray(size, min, max)
  return arr.sort((a, b) => a - b)
}

export const generateReverseSortedArray = (size: number, min: number = 1, max: number = 100): number[] => {
  const arr = generateRandomArray(size, min, max)
  return arr.sort((a, b) => b - a)
}

export const generateNearlySortedArray = (size: number, min: number = 1, max: number = 100, swaps: number = 3): number[] => {
  const arr = generateSortedArray(size, min, max)
  
  // Randomly swap some elements to make it nearly sorted
  for (let i = 0; i < swaps; i++) {
    const idx1 = Math.floor(Math.random() * size)
    const idx2 = Math.floor(Math.random() * size)
    ;[arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]]
  }
  
  return arr
}

export const generateArrayWithDuplicates = (size: number, uniqueValues: number, min: number = 1): number[] => {
  const values = Array.from({ length: uniqueValues }, (_, i) => min + i)
  return Array.from({ length: size }, () => values[Math.floor(Math.random() * values.length)])
}

export const shuffleArray = (arr: number[]): number[] => {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
