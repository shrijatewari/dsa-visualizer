import type { Step } from '../../store/visualizerStore'

export const radixSort = (arr: number[]): Step[] => {
  const steps: Step[] = []
  const array = [...arr]
  let comparisons = 0
  let swaps = 0

  // Add initial step
  steps.push({
    data: [...array],
    description: 'Starting Radix Sort',
    activeLine: 1,
    comparisons: 0,
    swaps: 0,
    assignments: 0
  })

  const max = Math.max(...array)

  steps.push({
    data: [...array],
    description: `Maximum value is ${max}, so we need ${max.toString().length} passes`,
    highlightIndices: [],
    activeLine: 2,
    comparisons,
    swaps,
    assignments: 0
  })

  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    steps.push({
      data: [...array],
      description: `Processing digit at position ${exp} (${exp === 1 ? 'ones' : exp === 10 ? 'tens' : exp === 100 ? 'hundreds' : 'higher'})`,
      highlightIndices: [],
      activeLine: 3,
      comparisons,
      swaps,
      assignments: 0
    })

    countingSortForDigit(array, exp, steps, comparisons, swaps)
  }

  // Final sorted array
  steps.push({
    data: [...array],
    description: 'Array is now sorted!',
    activeLine: 4,
    comparisons,
    swaps,
    assignments: 0
  })

  return steps
}

const countingSortForDigit = (arr: number[], exp: number, steps: Step[], comparisons: number, swaps: number) => {
  const n = arr.length
  const output = new Array(n)
  const count = new Array(10).fill(0)

  steps.push({
    data: [...arr],
    description: `Creating count array for digit position ${exp}`,
    highlightIndices: [],
    activeLine: 5,
    comparisons,
    swaps,
    assignments: 10
  })

  // Store count of occurrences in count[]
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10
    
    steps.push({
      data: [...arr],
      description: `Counting digit ${digit} for element ${arr[i]} at position ${exp}`,
      highlightIndices: [i],
      activeLine: 6,
      comparisons,
      swaps,
      assignments: 1
    })

    count[digit]++
  }

  steps.push({
    data: [...arr],
    description: 'Computing cumulative counts',
    highlightIndices: [],
    activeLine: 7,
    comparisons,
    swaps,
    assignments: 0
  })

  // Change count[i] so that count[i] now contains actual position of this digit in output[]
  for (let i = 1; i < 10; i++) {
    steps.push({
      data: [...arr],
      description: `Updating cumulative count for digit ${i}`,
      highlightIndices: [],
      activeLine: 8,
      comparisons,
      swaps,
      assignments: 1
    })

    count[i] += count[i - 1]
  }

  steps.push({
    data: [...arr],
    description: 'Building output array using cumulative counts',
    highlightIndices: [],
    activeLine: 9,
    comparisons,
    swaps,
    assignments: 0
  })

  // Build the output array
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10
    
    steps.push({
      data: [...arr],
      description: `Placing element ${arr[i]} (digit ${digit}) in output array`,
      highlightIndices: [i],
      activeLine: 10,
      comparisons,
      swaps,
      assignments: 1
    })

    output[count[digit] - 1] = arr[i]
    count[digit]--

    // Show partial result
    steps.push({
      data: [...output.slice(0, n - i).concat(arr.slice(n - i))],
      description: `Partial result after processing element ${arr[i]}`,
      highlightIndices: [n - i - 1],
      activeLine: 11,
      comparisons,
      swaps,
      assignments: 0
    })
  }

  steps.push({
    data: [...arr],
    description: 'Copying sorted elements back to original array',
    highlightIndices: [],
    activeLine: 12,
    comparisons,
    swaps,
    assignments: n
  })

  // Copy the output array to arr[], so that arr[] now contains sorted numbers according to current digit
  for (let i = 0; i < n; i++) {
    steps.push({
      data: [...output],
      description: `Copying ${output[i]} to position ${i} in original array`,
      highlightIndices: [i],
      activeLine: 13,
      comparisons,
      swaps,
      assignments: 1
    })

    arr[i] = output[i]
  }

  steps.push({
    data: [...arr],
    description: `Array sorted by digit position ${exp}`,
    highlightIndices: [],
    activeLine: 14,
    comparisons,
    swaps,
    assignments: 0
  })
}

export const radixSortPseudocode = [
  'procedure radixSort(arr)',
  '  max = max(arr)',
  '  for exp = 1 to max do',
  '    countingSortForDigit(arr, exp)',
  '  end for',
  'end procedure',
  'procedure countingSortForDigit(arr, exp)',
  '  n = arr.length',
  '  output = array of size n',
  '  count = array of size 10, initialized to 0',
  '  for i = 0 to n-1 do',
  '    digit = (arr[i] / exp) % 10',
  '    count[digit]++',
  '  end for',
  '  for i = 1 to 9 do',
  '    count[i] += count[i-1]',
  '  end for',
  '  for i = n-1 down to 0 do',
  '    digit = (arr[i] / exp) % 10',
  '    output[count[digit]-1] = arr[i]',
  '    count[digit]--',
  '  end for',
  '  copy output to arr',
  'end procedure'
]
