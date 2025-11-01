import type { Step } from '../../store/visualizerStore'

interface MergeTreeNode {
  data: number[]
  left?: MergeTreeNode
  right?: MergeTreeNode
  level: number
  range: { left: number; right: number }
  isLeaf: boolean
  isMerged: boolean
}

export const mergeSort = (arr: number[]): Step[] => {
  const steps: Step[] = []
  const array = [...arr]
  let comparisons = 0
  let swaps = 0

  // Add initial step showing the unsorted array
  steps.push({
    data: [...array],
    description: '🚀 Starting Merge Sort - Unsorted Array',
    activeLine: 1,
    comparisons: 0,
    swaps: 0,
    assignments: 0,
    mergeSortPhase: 'initial',
    mergeSortLevel: 0,
    mergeSortRange: { left: 0, right: array.length - 1 },
    mergeTree: null
  })

  // Build the merge tree structure
  const buildMergeTree = (arr: number[], left: number, right: number, level: number = 0): MergeTreeNode => {
    const node: MergeTreeNode = {
      data: arr.slice(left, right + 1),
      level,
      range: { left, right },
      isLeaf: left === right,
      isMerged: false
    }

    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      node.left = buildMergeTree(arr, left, mid, level + 1)
      node.right = buildMergeTree(arr, mid + 1, right, level + 1)
    }

    return node
  }

  // Create the initial tree
  const mergeTree = buildMergeTree(array, 0, array.length - 1)

  // Show the initial tree structure
  steps.push({
    data: [...array],
    description: '🌳 Merge Sort Tree Structure Created',
    activeLine: 2,
    comparisons,
    swaps,
    assignments: 0,
    mergeSortPhase: 'divide',
    mergeSortLevel: 0,
    mergeSortRange: { left: 0, right: array.length - 1 },
    mergeTree: JSON.parse(JSON.stringify(mergeTree))
  })

  // Perform the actual merge sort with tree visualization
  const mergeSortHelper = (arr: number[], left: number, right: number, level: number = 0, treeNode?: MergeTreeNode) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      
      // Show dividing step
      if (treeNode) {
        treeNode.isActive = true
        steps.push({
          data: [...arr],
          description: `📊 Level ${level}: Dividing [${left}:${right}] → [${left}:${mid}] + [${mid + 1}:${right}]`,
          highlightIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
          activeLine: 3,
          comparisons,
          swaps,
          assignments: 0,
          mergeSortPhase: 'divide',
          mergeSortLevel: level,
          mergeSortRange: { left, right, mid },
          mergeTree: JSON.parse(JSON.stringify(mergeTree))
        })
      }

      // Recursively sort left half
      mergeSortHelper(arr, left, mid, level + 1, treeNode?.left)

      // Recursively sort right half  
      mergeSortHelper(arr, mid + 1, right, level + 1, treeNode?.right)

      // Show merging step
      if (treeNode) {
        treeNode.isActive = true
        treeNode.isComparing = true
        steps.push({
          data: [...arr],
          description: `🔗 Level ${level}: Merging sorted halves [${left}:${mid}] + [${mid + 1}:${right}]`,
          highlightIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
          activeLine: 4,
          comparisons,
          swaps,
          assignments: 0,
          mergeSortPhase: 'merge',
          mergeSortLevel: level,
          mergeSortRange: { left, right, mid },
          mergeTree: JSON.parse(JSON.stringify(mergeTree))
        })
      }

      merge(arr, left, mid, right, level, treeNode)
    } else {
      // Base case - single element
      if (treeNode) {
        treeNode.isActive = true
        treeNode.isMerged = true
        steps.push({
          data: [...arr],
          description: `✅ Base case: Single element [${left}] is sorted`,
          highlightIndices: [left],
          activeLine: 5,
          comparisons,
          swaps,
          assignments: 0,
          mergeSortPhase: 'complete',
          mergeSortLevel: level,
          mergeSortRange: { left, right, mid: left },
          mergeTree: JSON.parse(JSON.stringify(mergeTree))
        })
      }
    }
  }

  const merge = (arr: number[], left: number, mid: number, right: number, level: number, treeNode?: MergeTreeNode) => {
    const leftArray = arr.slice(left, mid + 1)
    const rightArray = arr.slice(mid + 1, right + 1)

    let i = 0 // Index for left array
    let j = 0 // Index for right array
    let k = left // Index for merged array

    // Show merging process
    while (i < leftArray.length && j < rightArray.length) {
      // Show comparison
      steps.push({
        data: [...arr],
        description: `⚖️ Comparing ${leftArray[i]} (left) vs ${rightArray[j]} (right)`,
        highlightIndices: [left + i, mid + 1 + j],
        activeLine: 6,
        comparisons: ++comparisons,
        swaps,
        assignments: 0,
        mergeSortPhase: 'merge',
        mergeSortLevel: level,
        mergeSortRange: { left, right, mid },
        mergeTree: JSON.parse(JSON.stringify(mergeTree))
      })

      if (leftArray[i] <= rightArray[j]) {
        // Take from left array
        steps.push({
          data: [...arr],
          description: `⬅️ Taking ${leftArray[i]} from left array`,
          highlightIndices: [k],
          activeLine: 7,
          comparisons,
          swaps: ++swaps,
          assignments: 1,
          mergeSortPhase: 'merge',
          mergeSortLevel: level,
          mergeSortRange: { left, right, mid },
          mergeTree: JSON.parse(JSON.stringify(mergeTree))
        })

        arr[k] = leftArray[i]
        i++
      } else {
        // Take from right array
        steps.push({
          data: [...arr],
          description: `➡️ Taking ${rightArray[j]} from right array`,
          highlightIndices: [k],
          activeLine: 8,
          comparisons,
          swaps: ++swaps,
          assignments: 1,
          mergeSortPhase: 'merge',
          mergeSortLevel: level,
          mergeSortRange: { left, right, mid },
          mergeTree: JSON.parse(JSON.stringify(mergeTree))
        })

        arr[k] = rightArray[j]
        j++
      }
      k++
    }

    // Copy remaining elements
    while (i < leftArray.length) {
      arr[k] = leftArray[i]
      i++
      k++
    }

    while (j < rightArray.length) {
      arr[k] = rightArray[j]
      j++
      k++
    }

    // Show merged result
    if (treeNode) {
      treeNode.isMerged = true
      treeNode.isActive = false
      treeNode.isComparing = false
    }
    
    steps.push({
      data: [...arr],
      description: `✅ Level ${level}: Merged [${left}:${right}] - now sorted!`,
      highlightIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      activeLine: 9,
      comparisons,
      swaps,
      assignments: 0,
      mergeSortPhase: 'complete',
      mergeSortLevel: level,
      mergeSortRange: { left, right, mid },
      mergeTree: JSON.parse(JSON.stringify(mergeTree))
    })
  }

  mergeSortHelper(array, 0, array.length - 1, 0, mergeTree)

  // Final sorted array
  steps.push({
    data: [...array],
    description: '🎉 Merge Sort Complete! Array is now fully sorted!',
    activeLine: 10,
    comparisons,
    swaps,
    assignments: 0,
    mergeSortPhase: 'complete',
    mergeSortLevel: 0,
    mergeSortRange: { left: 0, right: array.length - 1, mid: Math.floor(array.length / 2) },
    mergeTree: JSON.parse(JSON.stringify(mergeTree))
  })

  return steps
}

export const mergeSortPseudocode = [
  '🚀 procedure mergeSort(arr, left, right)',
  '  if left < right then',
  '    mid = (left + right) / 2',
  '    📊 Divide: Split array at midpoint',
  '    mergeSort(arr, left, mid)',
  '    mergeSort(arr, mid+1, right)',
  '    🔗 Merge: Combine sorted halves',
  '  else',
  '    ✅ Base case: Single element',
  '  end if',
  'end procedure',
  '',
  '🔗 procedure merge(arr, left, mid, right)',
  '  leftArray = arr[left..mid]',
  '  rightArray = arr[mid+1..right]',
  '  i = j = 0, k = left',
  '  while i < leftArray.length and j < rightArray.length do',
  '    ⚖️ Compare leftArray[i] with rightArray[j]',
  '    if leftArray[i] <= rightArray[j] then',
  '      ⬅️ Take from left array',
  '      arr[k] = leftArray[i], i++',
  '    else',
  '      ➡️ Take from right array',
  '      arr[k] = rightArray[j], j++',
  '    end if',
  '    k++',
  '  end while',
  '  📋 Copy remaining elements',
  'end procedure'
]
