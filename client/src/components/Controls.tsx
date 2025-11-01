import { useVisualizerStore } from '../store/visualizerStore'
import type { AlgorithmType } from '../store/visualizerStore'
import { bubbleSort } from '../algorithms/sorting/bubbleSort'
import { selectionSort } from '../algorithms/sorting/selectionSort'
import { insertionSort } from '../algorithms/sorting/insertionSort'
import { quickSort } from '../algorithms/sorting/quickSort'
import { mergeSort } from '../algorithms/sorting/mergeSort'
import { heapSort } from '../algorithms/sorting/heapSort'
import { countingSort } from '../algorithms/sorting/countingSort'
import { radixSort } from '../algorithms/sorting/radixSort'
import { bucketSort } from '../algorithms/sorting/bucketSort'
import { useEffect } from 'react'

const algorithms = {
  bubbleSort: { name: 'Bubble Sort', function: bubbleSort },
  selectionSort: { name: 'Selection Sort', function: selectionSort },
  insertionSort: { name: 'Insertion Sort', function: insertionSort },
  quickSort: { name: 'Quick Sort', function: quickSort },
  mergeSort: { name: 'Merge Sort', function: mergeSort },
  heapSort: { name: 'Heap Sort', function: heapSort },
  countingSort: { name: 'Counting Sort', function: countingSort },
  radixSort: { name: 'Radix Sort', function: radixSort },
  bucketSort: { name: 'Bucket Sort', function: bucketSort }
} as const

export default function Controls() {
  const {
    algorithm,
    setAlgorithm,
    setSteps,
    setArraySize,
    setValueRange,
    setSpeed,
    nextStep,
    prevStep,
    play,
    pause,
    reset,
    undo,
    redo,
    isPlaying,
    speed,
    arraySize,
    valueRange,
    currentStep,
    steps,
    generateRandomArray,
    toggleAlgorithmInfo
  } = useVisualizerStore()

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        nextStep()
      }, speed)
      return () => clearTimeout(timer)
    } else if (isPlaying && currentStep >= steps.length - 1) {
      pause()
    }
  }, [isPlaying, currentStep, steps.length, speed, nextStep, pause])

  const handleAlgorithmChange = (newAlgorithm: AlgorithmType) => {
    setAlgorithm(newAlgorithm)
    runAlgorithm(newAlgorithm)
  }

  const runAlgorithm = (algo: AlgorithmType = algorithm) => {
    console.log(`Running algorithm: ${algo}`)
    const randomArray = generateRandomArray()
    console.log(`Generated array: ${randomArray}`)
    const algorithmFunction = algorithms[algo].function
    const newSteps = algorithmFunction(randomArray)
    console.log(`Generated ${newSteps.length} steps for ${algo}`)
    setSteps(newSteps)
  }

  const handleArraySizeChange = (newSize: number) => {
    setArraySize(newSize)
    runAlgorithm()
  }

  const handleValueRangeChange = (newRange: number) => {
    setValueRange(newRange)
    runAlgorithm()
  }

  return (
    <div className="w-full bg-gradient-to-br from-neon-bg-light to-neon-background rounded-xl p-6 space-y-6 border border-neon-primary/30 shadow-2xl neon-glow-blue">
      {/* Algorithm Selection */}
      <div>
        <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Algorithm Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(algorithms).map(([key, algo]) => (
            <button
              key={key}
              onClick={() => handleAlgorithmChange(key as AlgorithmType)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 font-mono text-center min-h-[48px] flex items-center justify-center ${
                algorithm === key
                  ? 'bg-neon-primary text-neon-background border-2 border-neon-primary-light shadow-lg neon-glow-blue transform scale-105'
                  : 'bg-neon-background text-neon-text/80 hover:bg-neon-primary/20 border border-neon-primary/50 hover:border-neon-primary hover:scale-105 neon-glow-blue'
              }`}
            >
              <span className="truncate">{algo.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={toggleAlgorithmInfo}
          className="mt-3 px-4 py-2 bg-neon-secondary text-neon-text rounded-lg hover:bg-neon-secondary-light transition-all duration-300 text-sm font-mono border border-neon-secondary-light/50 neon-glow-pink"
        >
          ℹ️ Learn about {algorithms[algorithm]?.name}
        </button>
      </div>

      {/* Array Configuration */}
      <div>
        <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Array Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-neon-text/80 mb-2 font-mono">
              Array Size: {arraySize}
            </label>
            <input
              type="range"
              min="5"
              max="25"
              value={arraySize}
              onChange={(e) => handleArraySizeChange(Number(e.target.value))}
              className="w-full h-2 bg-neon-background rounded-lg appearance-none cursor-pointer slider-neon"
            />
          </div>
          <div>
            <label className="block text-sm text-neon-text/80 mb-2 font-mono">
              Value Range: 1-{valueRange}
            </label>
            <input
              type="range"
              min="20"
              max="200"
              value={valueRange}
              onChange={(e) => handleValueRangeChange(Number(e.target.value))}
              className="w-full h-2 bg-neon-background rounded-lg appearance-none cursor-pointer slider-neon"
            />
          </div>
        </div>
        <button
          onClick={() => runAlgorithm()}
          className="mt-3 px-4 py-2 bg-neon-highlight text-neon-background rounded-lg hover:bg-neon-highlight-light transition-all duration-300 font-mono font-semibold border border-neon-highlight-light/50 neon-glow-gold"
        >
          Generate New Array
        </button>
      </div>

      {/* Navigation Controls */}
      <div>
        <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Navigation Controls</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-neon-background text-neon-text rounded-lg hover:bg-neon-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-mono border border-neon-primary/50 neon-glow-blue"
          >
            Previous
          </button>
          <button
            onClick={isPlaying ? pause : play}
            disabled={currentStep >= steps.length - 1}
            className="px-4 py-2 bg-neon-primary text-neon-background rounded-lg hover:bg-neon-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-mono border border-neon-primary-light/50 neon-glow-blue"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep >= steps.length - 1}
            className="px-4 py-2 bg-neon-background text-neon-text rounded-lg hover:bg-neon-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-mono border border-neon-primary/50 neon-glow-blue"
          >
            Next
          </button>
          <button
            onClick={undo}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-neon-highlight text-neon-background rounded-lg hover:bg-neon-highlight-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-mono border border-neon-highlight-light/50 neon-glow-gold"
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={currentStep >= steps.length - 1}
            className="px-4 py-2 bg-neon-highlight text-neon-background rounded-lg hover:bg-neon-highlight-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-mono border border-neon-highlight-light/50 neon-glow-gold"
          >
            Redo
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-neon-secondary text-neon-text rounded-lg hover:bg-neon-secondary-light transition-all duration-300 font-mono border border-neon-secondary-light/50 neon-glow-pink"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Speed Control */}
      <div>
        <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Speed Control</h3>
        <div>
          <label className="block text-sm text-neon-text/80 mb-2 font-mono">
            Animation Speed: {speed}ms
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-2 bg-neon-background rounded-lg appearance-none cursor-pointer slider-neon"
          />
        </div>
      </div>

      {/* Progress */}
      <div>
        <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Progress</h3>
        <div className="w-full bg-neon-background rounded-full h-3 border border-neon-primary/30">
          <div
            className="bg-gradient-to-r from-neon-primary to-neon-secondary h-3 rounded-full transition-all duration-500 shadow-lg neon-glow-blue"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-neon-text/80 mt-2 font-mono">
          {currentStep + 1} / {steps.length} steps
        </p>
      </div>

      {/* Keyboard Shortcuts */}
      <div>
        <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-neon-background p-3 rounded-lg border border-neon-primary/30 neon-glow-blue">
            <span className="text-neon-text/60 font-mono">Space:</span>
            <span className="text-neon-text ml-1 font-mono">Play/Pause</span>
          </div>
          <div className="bg-neon-background p-3 rounded-lg border border-neon-primary/30 neon-glow-blue">
            <span className="text-neon-text/60 font-mono">←/→:</span>
            <span className="text-neon-text ml-1 font-mono">Previous/Next</span>
          </div>
          <div className="bg-neon-background p-3 rounded-lg border border-neon-primary/30 neon-glow-blue">
            <span className="text-neon-text/60 font-mono">Ctrl+Z:</span>
            <span className="text-neon-text ml-1 font-mono">Undo</span>
          </div>
          <div className="bg-neon-background p-3 rounded-lg border border-neon-primary/30 neon-glow-blue">
            <span className="text-neon-text/60 font-mono">Ctrl+Y:</span>
            <span className="text-neon-text ml-1 font-mono">Redo</span>
          </div>
          <div className="bg-neon-background p-3 rounded-lg border border-neon-primary/30 neon-glow-blue">
            <span className="text-neon-text/60 font-mono">R:</span>
            <span className="text-neon-text ml-1 font-mono">Reset</span>
          </div>
          <div className="bg-neon-background p-3 rounded-lg border border-neon-primary/30 neon-glow-blue">
            <span className="text-neon-text/60 font-mono">N/P:</span>
            <span className="text-neon-text ml-1 font-mono">Next/Previous</span>
          </div>
        </div>
      </div>
    </div>
  )
}