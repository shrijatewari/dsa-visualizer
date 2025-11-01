import type { Step } from '../../store/visualizerStore'

export const bucketSort = (arr: number[]): Step[] => {
  const steps: Step[] = []
  const array = [...arr]
  let comparisons = 0
  let swaps = 0

  // Add initial step
  steps.push({
    data: [...array],
    description: 'Starting Bucket Sort',
    activeLine: 1,
    comparisons: 0,
    swaps: 0,
    assignments: 0
  })

  const n = array.length
  const max = Math.max(...array)
  const min = Math.min(...array)
  const bucketSize = Math.ceil((max - min + 1) / Math.ceil(Math.sqrt(n)))

  steps.push({
    data: [...array],
    description: `Creating ${Math.ceil((max - min + 1) / bucketSize)} buckets with size ${bucketSize}`,
    highlightIndices: [],
    activeLine: 2,
    comparisons,
    swaps,
    assignments: 0
  })

  // Create buckets
  const bucketCount = Math.ceil((max - min + 1) / bucketSize)
  const buckets: number[][] = Array(bucketCount).fill(null).map(() => [])

  steps.push({
    data: [...array],
    description: 'Distributing elements into buckets',
    highlightIndices: [],
    activeLine: 3,
    comparisons,
    swaps,
    assignments: 0
  })

  // Distribute elements into buckets
  for (let i = 0; i < n; i++) {
    const bucketIndex = Math.floor((array[i] - min) / bucketSize)
    
    steps.push({
      data: [...array],
      description: `Placing ${array[i]} in bucket ${bucketIndex}`,
      highlightIndices: [i],
      bucketIndices: [Array.from({ length: bucketCount }, (_, j) => j === bucketIndex ? i : null).filter(Boolean) as number[]],
      activeLine: 4,
      comparisons,
      swaps,
      assignments: 1
    })

    buckets[bucketIndex].push(array[i])
  }

  // Show all buckets
  steps.push({
    data: [...array],
    description: 'All elements distributed into buckets',
    highlightIndices: [],
    bucketIndices: buckets.map(bucket => bucket.map(val => array.indexOf(val))),
    activeLine: 5,
    comparisons,
    swaps,
    assignments: 0
  })

  // Sort individual buckets (using insertion sort for simplicity)
  steps.push({
    data: [...array],
    description: 'Sorting individual buckets',
    highlightIndices: [],
    activeLine: 6,
    comparisons,
    swaps,
    assignments: 0
  })

  for (let i = 0; i < bucketCount; i++) {
    if (buckets[i].length > 0) {
      steps.push({
        data: [...array],
        description: `Sorting bucket ${i} containing ${buckets[i].length} elements`,
        highlightIndices: [],
        bucketIndices: [buckets[i].map(val => array.indexOf(val))],
        activeLine: 7,
        comparisons,
        swaps,
        assignments: 0
      })

      insertionSortBucket(buckets[i])
    }
  }

  // Concatenate all buckets back into array
  steps.push({
    data: [...array],
    description: 'Concatenating sorted buckets back into array',
    highlightIndices: [],
    activeLine: 8,
    comparisons,
    swaps,
    assignments: 0
  })

  let index = 0
  for (let i = 0; i < bucketCount; i++) {
    if (buckets[i].length > 0) {
      steps.push({
        data: [...array],
        description: `Copying elements from bucket ${i} to final array`,
        highlightIndices: Array.from({ length: buckets[i].length }, (_, j) => index + j),
        activeLine: 9,
        comparisons,
        swaps,
        assignments: buckets[i].length
      })

      for (let j = 0; j < buckets[i].length; j++) {
        array[index++] = buckets[i][j]
      }
    }
  }

  // Final sorted array
  steps.push({
    data: [...array],
    description: 'Array is now sorted!',
    activeLine: 10,
    comparisons,
    swaps,
    assignments: 0
  })

  return steps
}

const insertionSortBucket = (bucket: number[]) => {
  for (let i = 1; i < bucket.length; i++) {
    const key = bucket[i]
    let j = i - 1

    while (j >= 0 && bucket[j] > key) {
      bucket[j + 1] = bucket[j]
      j--
    }

    bucket[j + 1] = key
  }
}

export const bucketSortPseudocode = [
  'procedure bucketSort(arr)',
  '  n = arr.length',
  '  max = max(arr), min = min(arr)',
  '  bucketSize = (max - min + 1) / sqrt(n)',
  '  buckets = array of buckets',
  '  for i = 0 to n-1 do',
  '    bucketIndex = (arr[i] - min) / bucketSize',
  '    buckets[bucketIndex].append(arr[i])',
  '  end for',
  '  for each bucket do',
  '    sort(bucket)',
  '  end for',
  '  concatenate all buckets',
  'end procedure'
]
