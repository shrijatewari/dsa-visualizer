import type { Step } from '../../store/visualizerStore'

export const heapSort = (arr: number[]): Step[] => {
  const steps: Step[] = []
  const array = [...arr]
  let comparisons = 0
  let swaps = 0

  // Add initial step
  steps.push({
    data: [...array],
    description: 'Starting Heap Sort',
    activeLine: 1,
    comparisons: 0,
    swaps: 0,
    assignments: 0
  })

  const n = array.length

  // Build max heap
  steps.push({
    data: [...array],
    description: 'Building max heap from the array',
    highlightIndices: [],
    activeLine: 2,
    comparisons,
    swaps,
    assignments: 0
  })

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      data: [...array],
      description: `Heapifying subtree rooted at index ${i}`,
      highlightIndices: [i],
      heapIndices: [i],
      activeLine: 3,
      comparisons,
      swaps,
      assignments: 0
    })

    heapify(array, n, i, steps, comparisons, swaps)
  }

  // Extract elements from heap one by one
  steps.push({
    data: [...array],
    description: 'Extracting elements from heap one by one',
    highlightIndices: [],
    activeLine: 4,
    comparisons,
    swaps,
    assignments: 0
  })

  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    steps.push({
      data: [...array],
      description: `Moving root ${array[0]} to position ${i}`,
      highlightIndices: [0, i],
      activeLine: 5,
      comparisons,
      swaps: ++swaps,
      assignments: 2
    })

    ;[array[0], array[i]] = [array[i], array[0]]

    // Show result after swap
    steps.push({
      data: [...array],
      description: `Element ${array[i]} is now in its correct position`,
      highlightIndices: [i],
      activeLine: 6,
      comparisons,
      swaps,
      assignments: 0
    })

    // Call max heapify on the reduced heap
    steps.push({
      data: [...array],
      description: `Heapifying the reduced heap (size ${i})`,
      highlightIndices: [0],
      heapIndices: [0],
      activeLine: 7,
      comparisons,
      swaps,
      assignments: 0
    })

    heapify(array, i, 0, steps, comparisons, swaps)
  }

  // Final sorted array
  steps.push({
    data: [...array],
    description: 'Array is now sorted!',
    activeLine: 8,
    comparisons,
    swaps,
    assignments: 0
  })

  return steps
}

const heapify = (arr: number[], n: number, i: number, steps: Step[], comparisons: number, swaps: number) => {
  let largest = i // Initialize largest as root
  let left = 2 * i + 1 // Left child
  let right = 2 * i + 2 // Right child

  // If left child is larger than root
  if (left < n) {
    steps.push({
      data: [...arr],
      description: `Comparing left child ${arr[left]} with root ${arr[i]}`,
      highlightIndices: [left, i],
      heapIndices: [i, left],
      activeLine: 9,
      comparisons: ++comparisons,
      swaps,
      assignments: 0
    })

    if (arr[left] > arr[largest]) {
      steps.push({
        data: [...arr],
        description: `Left child ${arr[left]} is larger than root ${arr[i]}`,
        highlightIndices: [left],
        heapIndices: [i, left],
        activeLine: 10,
        comparisons,
        swaps,
        assignments: 1
      })
      largest = left
    }
  }

  // If right child is larger than largest so far
  if (right < n) {
    steps.push({
      data: [...arr],
      description: `Comparing right child ${arr[right]} with largest ${arr[largest]}`,
      highlightIndices: [right, largest],
      heapIndices: [i, right],
      activeLine: 11,
      comparisons: ++comparisons,
      swaps,
      assignments: 0
    })

    if (arr[right] > arr[largest]) {
      steps.push({
        data: [...arr],
        description: `Right child ${arr[right]} is larger than largest ${arr[largest]}`,
        highlightIndices: [right],
        heapIndices: [i, right],
        activeLine: 12,
        comparisons,
        swaps,
        assignments: 1
      })
      largest = right
    }
  }

  // If largest is not root
  if (largest !== i) {
    steps.push({
      data: [...arr],
      description: `Swapping ${arr[i]} with ${arr[largest]} to maintain heap property`,
      highlightIndices: [i, largest],
      heapIndices: [i, largest],
      activeLine: 13,
      comparisons,
      swaps: ++swaps,
      assignments: 2
    })

    ;[arr[i], arr[largest]] = [arr[largest], arr[i]]

    // Recursively heapify the affected sub-tree
    steps.push({
      data: [...arr],
      description: `Recursively heapifying the affected subtree`,
      highlightIndices: [largest],
      heapIndices: [largest],
      activeLine: 14,
      comparisons,
      swaps,
      assignments: 0
    })

    heapify(arr, n, largest, steps, comparisons, swaps)
  } else {
    steps.push({
      data: [...arr],
      description: `Heap property is satisfied at index ${i}`,
      highlightIndices: [i],
      heapIndices: [i],
      activeLine: 15,
      comparisons,
      swaps,
      assignments: 0
    })
  }
}

export const heapSortPseudocode = [
  'procedure heapSort(arr)',
  '  buildMaxHeap(arr)',
  '  for i = n-1 down to 1 do',
  '    swap(arr[0], arr[i])',
  '    heapify(arr, i, 0)',
  '  end for',
  'end procedure',
  'procedure heapify(arr, n, i)',
  '  largest = i',
  '  left = 2*i + 1',
  '  right = 2*i + 2',
  '  if left < n and arr[left] > arr[largest] then',
  '    largest = left',
  '  end if',
  '  if right < n and arr[right] > arr[largest] then',
  '    largest = right',
  '  end if',
  '  if largest != i then',
  '    swap(arr[i], arr[largest])',
  '    heapify(arr, n, largest)',
  '  end if',
  'end procedure'
]
