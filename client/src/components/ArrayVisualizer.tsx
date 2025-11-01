import { useVisualizerStore } from '../store/visualizerStore'
import MergeSortTree from './MergeSortTree'

export default function ArrayVisualizer() {
  const { steps, currentStep, algorithm } = useVisualizerStore()
  const currentStepData = steps[currentStep]

  if (!currentStepData) {
    return (
      <div className="flex items-center justify-center h-64 bg-celestial-bg-light rounded-lg border border-celestial-primary/20">
        <p className="text-celestial-text/60">No data to visualize</p>
      </div>
    )
  }

  const getBoxColor = (index: number) => {
    // Merge Sort specific coloring
    if (algorithm === 'mergeSort' && currentStepData.mergeSortRange) {
      const { left, right, mid } = currentStepData.mergeSortRange
      
      if (currentStepData.mergeSortPhase === 'divide') {
        // Show the range being divided
        if (index >= left && index <= right) {
          return 'bg-gradient-to-br from-neon-accent to-neon-accent-dark border-neon-accent-light neon-glow-purple'
        }
      } else if (currentStepData.mergeSortPhase === 'conquer') {
        // Show which subarray is being processed
        if (index >= left && index <= right) {
          return 'bg-gradient-to-br from-neon-highlight to-neon-highlight-dark border-neon-highlight-light neon-glow-gold'
        }
      } else if (currentStepData.mergeSortPhase === 'merge') {
        // Show merging process
        if (currentStepData.highlightIndices?.includes(index)) {
          return 'bg-gradient-to-br from-neon-secondary to-neon-secondary-dark border-neon-secondary-light neon-glow-pink'
        }
        if (index >= left && index <= right) {
          return 'bg-gradient-to-br from-neon-primary to-neon-primary-dark border-neon-primary-light neon-glow-blue'
        }
      } else if (currentStepData.mergeSortPhase === 'complete') {
        // Show completed merged section
        if (index >= left && index <= right) {
          return 'bg-gradient-to-br from-neon-success to-neon-success border-neon-success neon-glow-green'
        }
      }
    }
    
    // Default algorithm coloring
    if (currentStepData.pivotIndex === index) {
      return 'bg-gradient-to-br from-neon-secondary to-neon-secondary-dark border-neon-secondary-light neon-glow-pink' // Pivot - hot pink
    }
    if (currentStepData.highlightIndices?.includes(index)) {
      return 'bg-gradient-to-br from-neon-highlight to-neon-highlight-dark border-neon-highlight-light neon-glow-gold' // Comparing/swapping - gold
    }
    if (currentStepData.bucketIndices) {
      // Check if this element is in a bucket
      for (let bucketIndex = 0; bucketIndex < currentStepData.bucketIndices.length; bucketIndex++) {
        if (currentStepData.bucketIndices[bucketIndex]?.includes(index)) {
          const gradients = [
            'bg-gradient-to-br from-neon-primary to-neon-primary-dark border-neon-primary-light neon-glow-blue',
            'bg-gradient-to-br from-neon-secondary to-neon-secondary-dark border-neon-secondary-light neon-glow-pink',
            'bg-gradient-to-br from-neon-highlight to-neon-highlight-dark border-neon-highlight-light neon-glow-gold',
            'bg-gradient-to-br from-neon-accent to-neon-accent-dark border-neon-accent-light neon-glow-purple',
            'bg-gradient-to-br from-neon-success to-neon-success border-neon-success neon-glow-green'
          ]
          return gradients[bucketIndex % gradients.length]
        }
      }
    }
    if (currentStepData.heapIndices?.includes(index)) {
      return 'bg-gradient-to-br from-neon-accent to-neon-accent-dark border-neon-accent-light neon-glow-purple' // Heap operations - purple
    }
    return 'bg-gradient-to-br from-neon-primary to-neon-primary-dark border-neon-primary-light neon-glow-blue' // Default - cyan
  }

  const getBoxHeight = (value: number) => {
    const maxValue = Math.max(...currentStepData.data)
    const minValue = Math.min(...currentStepData.data)
    const range = maxValue - minValue
    if (range === 0) return 'h-16' // Minimum height for same values
    const percentage = ((value - minValue) / range) * 100
    const height = Math.max(16, (percentage / 100) * 200) // Min 16px, max 200px
    return `h-[${height}px]`
  }

  return (
    <div className="w-full bg-gradient-to-br from-neon-bg-light to-neon-background rounded-xl p-6 border border-neon-primary/30 shadow-2xl neon-glow-blue">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-neon-text mb-3 font-mono">
          {algorithm.charAt(0).toUpperCase() + algorithm.slice(1).replace(/([A-Z])/g, ' $1')} Visualization
        </h3>
        <div className="flex items-center gap-4 text-sm text-neon-text/80 mb-4">
          <span className="bg-neon-primary/20 px-3 py-1 rounded-full font-mono font-semibold border border-neon-primary/30 neon-glow-blue">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="bg-neon-secondary/20 px-3 py-1 rounded-full font-mono font-semibold border border-neon-secondary/30 neon-glow-pink">
            {algorithm}
          </span>
        </div>
        <p className="text-sm text-neon-text/80 italic p-3 bg-neon-background/80 rounded-xl border-l-4 border-neon-primary backdrop-blur-sm shadow-lg neon-glow-blue">
          {currentStepData.description}
        </p>
      </div>

      {/* Merge Sort Tree Visualization */}
      {algorithm === 'mergeSort' && currentStepData.mergeTree && (
        <div className="mb-6">
          <MergeSortTree 
            tree={currentStepData.mergeTree} 
            currentLevel={currentStepData.mergeSortLevel || 0}
            currentPhase={currentStepData.mergeSortPhase || 'initial'}
          />
        </div>
      )}

      <div className="flex items-end justify-center gap-2 h-96 bg-gradient-to-br from-neon-background to-neon-bg-light rounded-xl p-6 border border-neon-primary/20 shadow-2xl neon-glow-blue overflow-hidden">
        {currentStepData.data.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center group relative transition-all duration-700 ease-out flex-shrink-0"
            style={{ 
              width: `${Math.max(60, Math.min(80, 100 / currentStepData.data.length))}px`,
              maxWidth: '80px'
            }}
          >
            {/* Enhanced Value Label */}
            <div className="text-xs text-neon-text mb-2 font-mono font-bold bg-neon-bg-light px-2 py-1 rounded-lg border border-neon-primary/40 shadow-lg backdrop-blur-sm neon-glow-blue text-center w-full">
              <span className="truncate block">{value}</span>
            </div>
            
            {/* Redesigned Box with Neon Styling */}
            <div
              className={`w-full rounded-xl border-2 transition-all duration-700 ease-out hover:scale-105 cursor-pointer shadow-2xl backdrop-blur-sm ${getBoxColor(index)}`}
              style={{ 
                minHeight: '20px',
                maxHeight: '200px',
                height: `${Math.max(20, Math.min(200, ((value - Math.min(...currentStepData.data)) / (Math.max(...currentStepData.data) - Math.min(...currentStepData.data))) * 180 + 20))}px`,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              title={`Index: ${index}, Value: ${value}`}
            >
              {/* Inner glow effect */}
              <div className="w-full h-full rounded-lg bg-gradient-to-t from-transparent to-white/20"></div>
            </div>

            {/* Enhanced Index Label */}
            <div className="text-xs text-neon-text/70 mt-2 font-mono bg-neon-bg-light px-2 py-1 rounded-md border border-neon-primary/30 backdrop-blur-sm neon-glow-blue text-center w-full">
              <span className="truncate block">{index}</span>
            </div>

            {/* Premium Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-3 py-2 bg-neon-bg-light/95 text-neon-text text-xs rounded-xl border border-neon-primary/40 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 shadow-2xl backdrop-blur-md neon-glow-blue whitespace-nowrap">
              <div className="font-mono font-bold text-neon-primary">Index: {index}</div>
              <div className="font-mono font-bold text-neon-highlight">Value: {value}</div>
              {currentStepData.pivotIndex === index && (
                <div className="text-neon-secondary-light font-bold">🎯 Pivot</div>
              )}
              {currentStepData.highlightIndices?.includes(index) && (
                <div className="text-neon-highlight-light font-bold">⚡ Active</div>
              )}
              {currentStepData.heapIndices?.includes(index) && (
                <div className="text-neon-accent-light font-bold">🌳 Heap</div>
              )}
              {currentStepData.bucketIndices && currentStepData.bucketIndices.some(bucket => bucket?.includes(index)) && (
                <div className="text-neon-secondary-light font-bold">🪣 Bucket</div>
              )}
              {/* Merge Sort specific tooltip info */}
              {algorithm === 'mergeSort' && currentStepData.mergeSortRange && (
                <>
                  <div className="text-neon-accent-light font-bold">📊 Level: {currentStepData.mergeSortLevel}</div>
                  <div className="text-neon-accent-light font-bold">Phase: {currentStepData.mergeSortPhase}</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Premium Legend */}
      <div className={`mt-6 grid gap-3 text-xs ${algorithm === 'mergeSort' ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4'}`}>
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-blue">
          <div className="w-4 h-4 bg-gradient-to-br from-neon-primary to-neon-primary-dark border border-neon-primary-light rounded-lg shadow-lg flex-shrink-0"></div>
          <span className="text-neon-text font-mono font-semibold text-xs">Normal</span>
        </div>
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-gold">
          <div className="w-4 h-4 bg-gradient-to-br from-neon-highlight to-neon-highlight-dark border border-neon-highlight-light rounded-lg shadow-lg flex-shrink-0"></div>
          <span className="text-neon-text font-mono font-semibold text-xs">Comparing/Swapping</span>
        </div>
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-pink">
          <div className="w-4 h-4 bg-gradient-to-br from-neon-secondary to-neon-secondary-dark border border-neon-secondary-light rounded-lg shadow-lg flex-shrink-0"></div>
          <span className="text-neon-text font-mono font-semibold text-xs">Pivot</span>
        </div>
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-purple">
          <div className="w-4 h-4 bg-gradient-to-br from-neon-accent to-neon-accent-dark border border-neon-accent-light rounded-lg shadow-lg flex-shrink-0"></div>
          <span className="text-neon-text font-mono font-semibold text-xs">Heap/Bucket</span>
        </div>
        {algorithm === 'mergeSort' && (
          <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-green">
            <div className="w-4 h-4 bg-gradient-to-br from-neon-success to-neon-success border border-neon-success rounded-lg shadow-lg flex-shrink-0"></div>
            <span className="text-neon-text font-mono font-semibold text-xs">Merged</span>
          </div>
        )}
      </div>
    </div>
  )
}
