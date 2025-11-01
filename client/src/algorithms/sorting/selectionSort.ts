import type { Step } from '../../store/visualizerStore'

export const selectionSort = (arr: number[]): Step[] => {
  const steps: Step[] = []
  const array = [...arr]
  let comparisons = 0
  let swaps = 0

  // Add initial step
  steps.push({
    data: [...array],
    description: 'Starting Selection Sort',
    activeLine: 1,
    comparisons: 0,
    swaps: 0,
    assignments: 0
  })

  const n = array.length

  for (let i = 0; i < n - 1; i++) {
    // Show finding minimum
    steps.push({
      data: [...array],
      description: `Finding minimum element in unsorted portion starting at index ${i}`,
      highlightIndices: [i],
      activeLine: 2,
      comparisons,
      swaps,
      assignments: 0
    })

    let minIndex = i

    for (let j = i + 1; j < n; j++) {
      // Highlight current comparison
      steps.push({
        data: [...array],
        description: `Comparing ${array[j]} with current minimum ${array[minIndex]}`,
        highlightIndices: [j, minIndex],
        activeLine: 3,
        comparisons: ++comparisons,
        swaps,
        assignments: 0
      })

      if (array[j] < array[minIndex]) {
        // New minimum found
        steps.push({
          data: [...array],
          description: `New minimum found: ${array[j]} at index ${j}`,
          highlightIndices: [j],
          activeLine: 4,
          comparisons,
          swaps,
          assignments: 1
        })
        minIndex = j
      } else {
        // No new minimum
        steps.push({
          data: [...array],
          description: `${array[j]} is not smaller than current minimum ${array[minIndex]}`,
          highlightIndices: [j, minIndex],
          activeLine: 5,
          comparisons,
          swaps,
          assignments: 0
        })
      }
    }

    // Show swap if needed
    if (minIndex !== i) {
      steps.push({
        data: [...array],
        description: `Swapping minimum element ${array[minIndex]} with element at position ${i}`,
        highlightIndices: [i, minIndex],
        activeLine: 6,
        comparisons,
        swaps: ++swaps,
        assignments: 2
      })

      // Perform swap
      ;[array[i], array[minIndex]] = [array[minIndex], array[i]]

      // Show result after swap
      steps.push({
        data: [...array],
        description: `After swap: element ${array[i]} is now in its correct position`,
        highlightIndices: [i],
        activeLine: 7,
        comparisons,
        swaps,
        assignments: 0
      })
    } else {
      // No swap needed
      steps.push({
        data: [...array],
        description: `Element at position ${i} is already the minimum`,
        highlightIndices: [i],
        activeLine: 8,
        comparisons,
        swaps,
        assignments: 0
      })
    }
  }

  // Final sorted array
  steps.push({
    data: [...array],
    description: 'Array is now sorted!',
    activeLine: 9,
    comparisons,
    swaps,
    assignments: 0
  })

  return steps
}

export const selectionSortPseudocode = [
  'procedure selectionSort(arr)',
  '  for i = 0 to n-2 do',
  '    minIndex = i',
  '    for j = i+1 to n-1 do',
  '      if arr[j] < arr[minIndex] then',
  '        minIndex = j',
  '      end if',
  '    end for',
  '    if minIndex != i then',
  '      swap(arr[i], arr[minIndex])',
  '    end if',
  '  end for',
  'end procedure'
]
