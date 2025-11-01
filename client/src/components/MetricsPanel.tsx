import { useVisualizerStore } from '../store/visualizerStore'

export default function MetricsPanel() {
  const { 
    metrics, 
    showMetrics, 
    toggleMetrics,
    steps,
    currentStep,
    algorithm 
  } = useVisualizerStore()

  if (!showMetrics) {
    return (
      <div className="w-full bg-celestial-bg-light rounded-lg p-6 border border-celestial-primary/20">
        <button
          onClick={toggleMetrics}
          className="w-full py-4 text-celestial-text/60 hover:text-celestial-text transition-all duration-300 font-mono"
        >
          Show Metrics
        </button>
      </div>
    )
  }

  const getAlgorithmInfo = () => {
    const info = {
      bubbleSort: { name: 'Bubble Sort', best: 'O(n)', worst: 'O(n²)', space: 'O(1)' },
      selectionSort: { name: 'Selection Sort', best: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
      insertionSort: { name: 'Insertion Sort', best: 'O(n)', worst: 'O(n²)', space: 'O(1)' },
      quickSort: { name: 'Quick Sort', best: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
      mergeSort: { name: 'Merge Sort', best: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
      heapSort: { name: 'Heap Sort', best: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
      countingSort: { name: 'Counting Sort', best: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)' },
      radixSort: { name: 'Radix Sort', best: 'O(d(n+k))', worst: 'O(d(n+k))', space: 'O(n+k)' },
      bucketSort: { name: 'Bucket Sort', best: 'O(n+k)', worst: 'O(n²)', space: 'O(n)' }
    }
    return info[algorithm] || info.bubbleSort
  }

  const algorithmInfo = getAlgorithmInfo()

  return (
    <div className="w-full bg-celestial-bg-light rounded-lg p-6 border border-celestial-primary/20 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-celestial-text font-mono">Metrics & Analysis</h3>
        <button
          onClick={toggleMetrics}
          className="text-celestial-text/60 hover:text-celestial-text transition-all duration-300 font-mono"
        >
          Hide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Runtime Metrics */}
        <div>
          <h4 className="text-md font-semibold text-celestial-text mb-3 font-mono">Runtime Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-celestial-bg rounded-lg border border-celestial-primary/20">
              <span className="text-celestial-text/80 font-mono">Comparisons:</span>
              <span className="text-celestial-highlight font-mono font-bold">{metrics.comparisons}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-celestial-bg rounded-lg border border-celestial-primary/20">
              <span className="text-celestial-text/80 font-mono">Swaps:</span>
              <span className="text-celestial-secondary font-mono font-bold">{metrics.swaps}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-celestial-bg rounded-lg border border-celestial-primary/20">
              <span className="text-celestial-text/80 font-mono">Assignments:</span>
              <span className="text-celestial-primary font-mono font-bold">{metrics.assignments}</span>
            </div>
          </div>
        </div>

        {/* Algorithm Complexity */}
        <div>
          <h4 className="text-md font-semibold text-celestial-text mb-3 font-mono">Algorithm Complexity</h4>
          <div className="space-y-3">
            <div className="p-3 bg-celestial-bg rounded-lg border border-celestial-primary/20">
              <div className="text-sm text-celestial-text/60 mb-1 font-mono">Algorithm:</div>
              <div className="text-celestial-text font-semibold font-mono">{algorithmInfo.name}</div>
            </div>
            <div className="p-3 bg-celestial-bg rounded-lg border border-celestial-primary/20">
              <div className="text-sm text-celestial-text/60 mb-1 font-mono">Best Case:</div>
              <div className="text-celestial-highlight font-mono">{algorithmInfo.best}</div>
            </div>
            <div className="p-3 bg-celestial-bg rounded-lg border border-celestial-primary/20">
              <div className="text-sm text-celestial-text/60 mb-1 font-mono">Worst Case:</div>
              <div className="text-celestial-secondary font-mono">{algorithmInfo.worst}</div>
            </div>
            <div className="p-3 bg-celestial-bg rounded-lg border border-celestial-primary/20">
              <div className="text-sm text-celestial-text/60 mb-1 font-mono">Space Complexity:</div>
              <div className="text-celestial-primary font-mono">{algorithmInfo.space}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-celestial-bg rounded-lg border border-celestial-primary/20">
        <h4 className="text-md font-semibold text-celestial-text mb-2 font-mono">Progress Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-celestial-primary">{currentStep + 1}</div>
            <div className="text-sm text-celestial-text/60 font-mono">Current Step</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-celestial-highlight">{steps.length}</div>
            <div className="text-sm text-celestial-text/60 font-mono">Total Steps</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-celestial-secondary">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </div>
            <div className="text-sm text-celestial-text/60 font-mono">Complete</div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-4 p-4 bg-celestial-bg rounded-lg border border-celestial-primary/20">
        <h4 className="text-md font-semibold text-celestial-text mb-2 font-mono">Performance Insights</h4>
        <div className="text-sm text-celestial-text/80 space-y-1 font-mono">
          {metrics.comparisons > 0 && (
            <div>• Average comparisons per step: {(metrics.comparisons / (currentStep + 1)).toFixed(1)}</div>
          )}
          {metrics.swaps > 0 && (
            <div>• Average swaps per step: {(metrics.swaps / (currentStep + 1)).toFixed(1)}</div>
          )}
          {currentStep > 0 && (
            <div>• Efficiency: {((steps.length - currentStep) / steps.length * 100).toFixed(1)}% remaining</div>
          )}
        </div>
      </div>
    </div>
  )
}
