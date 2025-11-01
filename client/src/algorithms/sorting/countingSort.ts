import type { Step } from '../../store/visualizerStore'

export const countingSort = (arr: number[]): Step[] => {
  const steps: Step[] = []
  const array = [...arr]
  let comparisons = 0
  let swaps = 0

  // Add initial step
  steps.push({
    data: [...array],
    description: 'Starting Counting Sort',
    activeLine: 1,
    comparisons: 0,
    swaps: 0,
    assignments: 0
  })

  const n = array.length
  const max = Math.max(...array)
  const min = Math.min(...array)
  const range = max - min + 1

  steps.push({
    data: [...array],
    description: `Range of values: ${min} to ${max} (range: ${range})`,
    highlightIndices: [],
    activeLine: 2,
    comparisons,
    swaps,
    assignments: 0
  })

  // Create count array
  const count = new Array(range).fill(0)
  const output = new Array(n)

  steps.push({
    data: [...array],
    description: `Creating count array of size ${range}`,
    highlightIndices: [],
    activeLine: 3,
    comparisons,
    swaps,
    assignments: range
  })

  // Store count of each element
  for (let i = 0; i < n; i++) {
    steps.push({
      data: [...array],
      description: `Counting occurrence of ${array[i]}`,
      highlightIndices: [i],
      activeLine: 4,
      comparisons,
      swaps,
      assignments: 1
    })

    count[array[i] - min]++
  }

  steps.push({
    data: [...array],
    description: 'Count array built. Now computing cumulative counts',
    highlightIndices: [],
    activeLine: 5,
    comparisons,
    swaps,
    assignments: 0
  })

  // Modify count array to store cumulative counts
  for (let i = 1; i < range; i++) {
    steps.push({
      data: [...array],
      description: `Updating cumulative count for position ${i}`,
      highlightIndices: [],
      activeLine: 6,
      comparisons,
      swaps,
      assignments: 1
    })

    count[i] += count[i - 1]
  }

  steps.push({
    data: [...array],
    description: 'Building output array using cumulative counts',
    highlightIndices: [],
    activeLine: 7,
    comparisons,
    swaps,
    assignments: 0
  })

  // Build output array
  for (let i = n - 1; i >= 0; i--) {
    steps.push({
      data: [...array],
      description: `Placing ${array[i]} in output array at position ${count[array[i] - min] - 1}`,
      highlightIndices: [i],
      activeLine: 8,
      comparisons,
      swaps,
      assignments: 1
    })

    output[count[array[i] - min] - 1] = array[i]
    count[array[i] - min]--

    // Update the visualization with current output state
    steps.push({
      data: [...output.slice(0, n - i).concat(array.slice(n - i))],
      description: `Output array after placing ${array[i]}`,
      highlightIndices: [n - i - 1],
      activeLine: 9,
      comparisons,
      swaps,
      assignments: 0
    })
  }

  // Copy output array back to original array
  steps.push({
    data: [...array],
    description: 'Copying sorted elements back to original array',
    highlightIndices: [],
    activeLine: 10,
    comparisons,
    swaps,
    assignments: n
  })

  for (let i = 0; i < n; i++) {
    steps.push({
      data: [...output],
      description: `Copying ${output[i]} to position ${i} in original array`,
      highlightIndices: [i],
      activeLine: 11,
      comparisons,
      swaps,
      assignments: 1
    })

    array[i] = output[i]
  }

  // Final sorted array
  steps.push({
    data: [...array],
    description: 'Array is now sorted!',
    activeLine: 12,
    comparisons,
    swaps,
    assignments: 0
  })

  return steps
}

export const countingSortPseudocode = [
  'procedure countingSort(arr)',
  '  max = max(arr), min = min(arr)',
  '  range = max - min + 1',
  '  count = array of size range, initialized to 0',
  '  for i = 0 to n-1 do',
  '    count[arr[i] - min]++',
  '  end for',
  '  for i = 1 to range-1 do',
  '    count[i] += count[i-1]',
  '  end for',
  '  for i = n-1 down to 0 do',
  '    output[count[arr[i] - min] - 1] = arr[i]',
  '    count[arr[i] - min]--',
  '  end for',
  '  copy output to arr',
  'end procedure'
]
