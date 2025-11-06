import type { Step } from '../../store/visualizerStore'

export const insertionSort = (arr: number[]): Step[] => {
  const steps: Step[] = []
  const array = [...arr]
  let comparisons = 0
  let swaps = 0

  // Add initial step
  steps.push({
    data: [...array],
    description: 'Starting Insertion Sort',
    activeLine: 1,
    comparisons: 0,
    swaps: 0,
    assignments: 0
  })

  const n = array.length

  for (let i = 1; i < n; i++) {
    // Show current element being inserted
    steps.push({
      data: [...array],
      description: `Inserting element ${array[i]} into its correct position in sorted portion`,
      highlightIndices: [i],
      activeLine: 2,
      comparisons,
      swaps,
      assignments: 0
    })

    const key = array[i]
    let j = i - 1

    // Show comparing with previous elements
    steps.push({
      data: [...array],
      description: `Comparing ${key} with sorted elements from right to left`,
      highlightIndices: [i, j],
      activeLine: 3,
      comparisons: ++comparisons,
      swaps,
      assignments: 0
    })

    // Move elements greater than key
    while (j >= 0 && array[j] > key) {
      // Show shift operation
      steps.push({
        data: [...array],
        description: `Shifting ${array[j]} to the right to make room for ${key}`,
        highlightIndices: [j, j + 1],
        activeLine: 4,
        comparisons: ++comparisons,
        swaps: ++swaps,
        assignments: 1
      })

      array[j + 1] = array[j]
      j--

      // Show result after shift
      if (j >= 0) {
        steps.push({
          data: [...array],
          description: `Continue comparing with next element`,
          highlightIndices: [i, j],
          activeLine: 3,
          comparisons,
          swaps,
          assignments: 0
        })
      }
    }

    // Insert key in correct position
    steps.push({
      data: [...array],
      description: `Inserting ${key} in its correct position`,
      highlightIndices: [j + 1],
      activeLine: 5,
      comparisons,
      swaps,
      assignments: 1
    })

    array[j + 1] = key

    // Show result after insertion
    steps.push({
      data: [...array],
      description: `Element ${key} is now in its correct position in the sorted portion`,
      highlightIndices: [j + 1],
      activeLine: 6,
      comparisons,
      swaps,
      assignments: 0
    })
  }

  // Final sorted array
  steps.push({
    data: [...array],
    description: 'Array is now sorted!',
    activeLine: 7,
    comparisons,
    swaps,
    assignments: 0
  })

  return steps
}

export const insertionSortPseudocode = [
  'procedure insertionSort(arr)',
  '  for i = 1 to n-1 do',
  '    key = arr[i]',
  '    j = i - 1',
  '    while j >= 0 and arr[j] > key do',
  '      arr[j+1] = arr[j]',
  '      j = j - 1',
  '    end while',
  '    arr[j+1] = key',
  '  end for',
  'end procedure'
]
