import { Step } from '../../store/visualizerStore'

export const quickSort = (arr: number[]): Step[] => {
  console.log('QUICK SORT FUNCTION CALLED with array:', arr)
  const steps: Step[] = []
  const array = [...arr]
  let comparisons = 0
  let swaps = 0

  // Add initial step
  steps.push({
    data: [...array],
    description: 'Starting Quick Sort',
    activeLine: 1,
    comparisons: 0,
    swaps: 0,
    assignments: 0
  })

  const quickSortHelper = (arr: number[], low: number, high: number, stepCounter: { count: number }) => {
    if (low < high) {
      // Show partition operation
      steps.push({
        data: [...arr],
        description: `Partitioning array from index ${low} to ${high}`,
        highlightIndices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        activeLine: 2,
        comparisons,
        swaps,
        assignments: 0
      })

      const pivotIndex = partition(arr, low, high)
      
      // Show pivot in correct position
      steps.push({
        data: [...arr],
        description: `Pivot ${arr[pivotIndex]} is now in its correct position at index ${pivotIndex}`,
        highlightIndices: [pivotIndex],
        pivotIndex,
        activeLine: 3,
        comparisons,
        swaps,
        assignments: 0
      })

      // Recursively sort left and right subarrays
      steps.push({
        data: [...arr],
        description: `Recursively sorting left subarray (${low} to ${pivotIndex - 1})`,
        highlightIndices: Array.from({ length: Math.max(0, pivotIndex - low) }, (_, i) => low + i),
        activeLine: 4,
        comparisons,
        swaps,
        assignments: 0
      })

      quickSortHelper(arr, low, pivotIndex - 1, stepCounter)

      steps.push({
        data: [...arr],
        description: `Recursively sorting right subarray (${pivotIndex + 1} to ${high})`,
        highlightIndices: Array.from({ length: Math.max(0, high - pivotIndex) }, (_, i) => pivotIndex + 1 + i),
        activeLine: 5,
        comparisons,
        swaps,
        assignments: 0
      })

      quickSortHelper(arr, pivotIndex + 1, high, stepCounter)
    }
  }

  const partition = (arr: number[], low: number, high: number): number => {
    // Choose rightmost element as pivot
    const pivot = arr[high]
    
    steps.push({
      data: [...arr],
      description: `Choosing pivot: ${pivot} (rightmost element)`,
      highlightIndices: [high],
      pivotIndex: high,
      activeLine: 6,
      comparisons,
      swaps,
      assignments: 0
    })

    let i = low - 1 // Index of smaller element

    for (let j = low; j < high; j++) {
      // Show comparison with pivot
      steps.push({
        data: [...arr],
        description: `Comparing ${arr[j]} with pivot ${pivot}`,
        highlightIndices: [j, high],
        pivotIndex: high,
        activeLine: 7,
        comparisons: ++comparisons,
        swaps,
        assignments: 0
      })

      if (arr[j] <= pivot) {
        i++
        
        if (i !== j) {
          // Show swap
          steps.push({
            data: [...arr],
            description: `Swapping ${arr[i]} and ${arr[j]} - ${arr[j]} <= pivot`,
            highlightIndices: [i, j],
            pivotIndex: high,
            activeLine: 8,
            comparisons,
            swaps: ++swaps,
            assignments: 2
          })

          ;[arr[i], arr[j]] = [arr[j], arr[i]]
        } else {
          // No swap needed
          steps.push({
            data: [...arr],
            description: `No swap needed - ${arr[j]} <= pivot`,
            highlightIndices: [j],
            pivotIndex: high,
            activeLine: 9,
            comparisons,
            swaps,
            assignments: 0
          })
        }
      } else {
        // Element greater than pivot
        steps.push({
          data: [...arr],
          description: `${arr[j]} > pivot, keeping it on the right side`,
          highlightIndices: [j, high],
          pivotIndex: high,
          activeLine: 10,
          comparisons,
          swaps,
          assignments: 0
        })
      }
    }

    // Place pivot in correct position
    steps.push({
      data: [...arr],
      description: `Placing pivot ${pivot} in its final position`,
      highlightIndices: [i + 1, high],
      pivotIndex: high,
      activeLine: 11,
      comparisons,
      swaps: ++swaps,
      assignments: 2
    })

    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    
    return i + 1
  }

  quickSortHelper(array, 0, array.length - 1, { count: 0 })

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

export const quickSortPseudocode = [
  'procedure quickSort(arr, low, high)',
  '  if low < high then',
  '    pivotIndex = partition(arr, low, high)',
  '    quickSort(arr, low, pivotIndex-1)',
  '    quickSort(arr, pivotIndex+1, high)',
  '  end if',
  'end procedure',
  'procedure partition(arr, low, high)',
  '  pivot = arr[high]',
  '  i = low - 1',
  '  for j = low to high-1 do',
  '    if arr[j] <= pivot then',
  '      i = i + 1',
  '      swap(arr[i], arr[j])',
  '    end if',
  '  end for',
  '  swap(arr[i+1], arr[high])',
  '  return i + 1',
  'end procedure'
]
