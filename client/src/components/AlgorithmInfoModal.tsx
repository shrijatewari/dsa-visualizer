import { useVisualizerStore } from '../store/visualizerStore'

const algorithmInfo = {
  bubbleSort: {
    name: 'Bubble Sort',
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    complexity: {
      time: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      space: 'O(1)'
    },
    applications: [
      'Educational purposes',
      'Small datasets',
      'Simple implementation'
    ],
    characteristics: [
      'Stable sorting algorithm',
      'In-place sorting',
      'Easy to understand and implement'
    ]
  },
  selectionSort: {
    name: 'Selection Sort',
    description: 'Selection Sort finds the minimum element in the unsorted portion and swaps it with the first element of the unsorted portion.',
    complexity: {
      time: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      space: 'O(1)'
    },
    applications: [
      'Small datasets',
      'Memory-constrained environments',
      'When auxiliary memory is limited'
    ],
    characteristics: [
      'Not stable',
      'In-place sorting',
      'Minimum number of swaps'
    ]
  },
  insertionSort: {
    name: 'Insertion Sort',
    description: 'Insertion Sort builds the final sorted array one element at a time by taking elements from the input and inserting them into their correct position.',
    complexity: {
      time: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      space: 'O(1)'
    },
    applications: [
      'Small datasets',
      'Nearly sorted data',
      'Hybrid sorting algorithms'
    ],
    characteristics: [
      'Stable sorting algorithm',
      'In-place sorting',
      'Efficient for small datasets'
    ]
  },
  quickSort: {
    name: 'Quick Sort',
    description: 'Quick Sort uses a divide-and-conquer approach by selecting a pivot element and partitioning the array around the pivot.',
    complexity: {
      time: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)'
      },
      space: 'O(log n)'
    },
    applications: [
      'General-purpose sorting',
      'Large datasets',
      'Built-in sorting in many languages'
    ],
    characteristics: [
      'Not stable',
      'In-place sorting',
      'Efficient average-case performance'
    ]
  },
  mergeSort: {
    name: 'Merge Sort',
    description: 'Merge Sort uses a divide-and-conquer approach by recursively dividing the array into halves, sorting them, and then merging them back.',
    complexity: {
      time: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      space: 'O(n)'
    },
    applications: [
      'Large datasets',
      'External sorting',
      'Stable sorting requirements'
    ],
    characteristics: [
      'Stable sorting algorithm',
      'Consistent performance',
      'Requires additional memory'
    ]
  },
  heapSort: {
    name: 'Heap Sort',
    description: 'Heap Sort uses a binary heap data structure to sort elements by repeatedly extracting the maximum element and placing it at the end.',
    complexity: {
      time: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      space: 'O(1)'
    },
    applications: [
      'Memory-constrained environments',
      'Real-time systems',
      'Priority queues'
    ],
    characteristics: [
      'Not stable',
      'In-place sorting',
      'Guaranteed O(n log n) performance'
    ]
  },
  countingSort: {
    name: 'Counting Sort',
    description: 'Counting Sort counts the number of occurrences of each element and uses this information to place elements in their correct position.',
    complexity: {
      time: {
        best: 'O(n + k)',
        average: 'O(n + k)',
        worst: 'O(n + k)'
      },
      space: 'O(k)'
    },
    applications: [
      'Integer sorting',
      'Small range of values',
      'Frequency counting'
    ],
    characteristics: [
      'Stable sorting algorithm',
      'Non-comparison based',
      'Efficient for small ranges'
    ]
  },
  radixSort: {
    name: 'Radix Sort',
    description: 'Radix Sort processes individual digits of numbers, sorting them digit by digit from least significant to most significant.',
    complexity: {
      time: {
        best: 'O(d(n + k))',
        average: 'O(d(n + k))',
        worst: 'O(d(n + k))'
      },
      space: 'O(n + k)'
    },
    applications: [
      'Integer sorting',
      'String sorting',
      'Large datasets with limited digits'
    ],
    characteristics: [
      'Stable sorting algorithm',
      'Non-comparison based',
      'Efficient for fixed-width data'
    ]
  },
  bucketSort: {
    name: 'Bucket Sort',
    description: 'Bucket Sort distributes elements into buckets, sorts each bucket individually, and then concatenates the sorted buckets.',
    complexity: {
      time: {
        best: 'O(n + k)',
        average: 'O(n + k)',
        worst: 'O(n²)'
      },
      space: 'O(n)'
    },
    applications: [
      'Uniformly distributed data',
      'Floating-point numbers',
      'External sorting'
    ],
    characteristics: [
      'Stable sorting algorithm',
      'Distribution-based',
      'Efficient for uniform distributions'
    ]
  }
}

export default function AlgorithmInfoModal() {
  const { algorithm, showAlgorithmInfo, toggleAlgorithmInfo } = useVisualizerStore()
  
  if (!showAlgorithmInfo) return null

  const info = algorithmInfo[algorithm]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{info.name}</h2>
            <button
              onClick={toggleAlgorithmInfo}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <p className="text-gray-300">{info.description}</p>
          </div>

          {/* Complexity */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Time & Space Complexity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm text-gray-400 mb-2">Time Complexity</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Best:</span>
                    <span className="text-green-400 font-mono">{info.complexity.time.best}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average:</span>
                    <span className="text-yellow-400 font-mono">{info.complexity.time.average}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Worst:</span>
                    <span className="text-red-400 font-mono">{info.complexity.time.worst}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm text-gray-400 mb-2">Space Complexity</h4>
                <div className="text-center">
                  <span className="text-purple-400 font-mono text-lg">{info.complexity.space}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Applications</h3>
            <ul className="list-disc list-inside space-y-1">
              {info.applications.map((app, index) => (
                <li key={index} className="text-gray-300">{app}</li>
              ))}
            </ul>
          </div>

          {/* Characteristics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Key Characteristics</h3>
            <ul className="list-disc list-inside space-y-1">
              {info.characteristics.map((char, index) => (
                <li key={index} className="text-gray-300">{char}</li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              onClick={toggleAlgorithmInfo}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
