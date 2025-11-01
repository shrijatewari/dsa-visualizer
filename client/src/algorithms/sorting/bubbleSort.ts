import type { Step } from '../../store/visualizerStore'

export const bubbleSort = (arr: number[]): Step[] => {
  console.log('BUBBLE SORT FUNCTION CALLED with array:', arr)
  const steps: Step[] = []
  const array = [...arr]
  let comparisons = 0
  let swaps = 0

  // Add initial step
  steps.push({
    data: [...array],
    description: 'Starting Bubble Sort',
    activeLine: 1,
    comparisons: 0,
    swaps: 0,
    assignments: 0
  })

  const n = array.length
  
  for (let i = 0; i < n - 1; i++) {
    // Show outer loop start
    steps.push({
      data: [...array],
      description: `Outer loop iteration ${i + 1}: comparing adjacent elements`,
      highlightIndices: [],
      activeLine: 2,
      comparisons,
      swaps,
      assignments: 0
    })

    for (let j = 0; j < n - i - 1; j++) {
      // Highlight elements being compared
      steps.push({
        data: [...array],
        description: `Comparing ${array[j]} and ${array[j + 1]}`,
        highlightIndices: [j, j + 1],
        activeLine: 3,
        comparisons: ++comparisons,
        swaps,
        assignments: 0
      })

      if (array[j] > array[j + 1]) {
        // Show swap
        steps.push({
          data: [...array],
          description: `Swapping ${array[j]} and ${array[j + 1]} - ${array[j]} > ${array[j + 1]}`,
          highlightIndices: [j, j + 1],
          activeLine: 4,
          comparisons,
          swaps: ++swaps,
          assignments: 2
        })

        // Perform swap
        ;[array[j], array[j + 1]] = [array[j + 1], array[j]]

        // Show result after swap
        steps.push({
          data: [...array],
          description: `After swap: ${array[j]} and ${array[j + 1]} are now in correct order`,
          highlightIndices: [j, j + 1],
          activeLine: 5,
          comparisons,
          swaps,
          assignments: 0
        })
      } else {
        // Show no swap needed
        steps.push({
          data: [...array],
          description: `No swap needed - ${array[j]} ≤ ${array[j + 1]}`,
          highlightIndices: [j, j + 1],
          activeLine: 6,
          comparisons,
          swaps,
          assignments: 0
        })
      }
    }

    // Highlight that this element is now in its final position
    steps.push({
      data: [...array],
      description: `Element at position ${n - i - 1} is now in its final position`,
      highlightIndices: [n - i - 1],
      activeLine: 7,
      comparisons,
      swaps,
      assignments: 0
    })
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

export const bubbleSortPseudocode = [
  'procedure bubbleSort(arr)',
  '  for i = 0 to n-2 do',
  '    for j = 0 to n-i-2 do',
  '      if arr[j] > arr[j+1] then',
  '        swap(arr[j], arr[j+1])',
  '      end if',
  '    end for',
  '  end for',
  'end procedure'
]
