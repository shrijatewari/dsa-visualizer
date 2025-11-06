import { create } from 'zustand'

export type AlgorithmType = 
  | 'bubbleSort'
  | 'selectionSort'
  | 'insertionSort'
  | 'quickSort'
  | 'mergeSort'
  | 'heapSort'
  | 'countingSort'
  | 'radixSort'
  | 'bucketSort'

export interface MergeTreeNode {
  data: number[]
  left?: MergeTreeNode
  right?: MergeTreeNode
  level: number
  range: { left: number; right: number }
  isLeaf: boolean
  isMerged: boolean
  isActive?: boolean
  isComparing?: boolean
}

export type Step = {
  data: number[]
  description: string
  highlightIndices?: number[]
  activeLine?: number
  comparisons?: number
  swaps?: number
  assignments?: number
  pivotIndex?: number
  bucketIndices?: number[][]
  heapIndices?: number[]
  // Merge Sort specific properties
  mergeSortPhase?: 'initial' | 'divide' | 'conquer' | 'merge' | 'complete'
  mergeSortLevel?: number
  mergeSortRange?: { left: number; right: number; mid?: number }
  leftSubarray?: number[]
  rightSubarray?: number[]
  mergeIndices?: { left: number; right: number; mid: number }
  mergeTree?: MergeTreeNode | null
}

type VisualizerState = {
  // Core state
  algorithm: AlgorithmType
  steps: Step[]
  currentStep: number
  isPlaying: boolean
  speed: number
  arraySize: number
  valueRange: number
  
  // Navigation
  history: Step[]
  future: Step[]
  
  // Metrics
  metrics: {
    comparisons: number
    swaps: number
    assignments: number
    timeComplexity: string
    spaceComplexity: string
  }
  
  // UI state
  showPseudocode: boolean
  showMetrics: boolean
  autoExplain: boolean
  showAlgorithmInfo: boolean
  
  // Core actions
  setAlgorithm: (algo: AlgorithmType) => void
  setSteps: (steps: Step[]) => void
  nextStep: () => void
  prevStep: () => void
  jumpToStep: (index: number) => void
  play: () => void
  pause: () => void
  reset: () => void
  undo: () => void
  redo: () => void
  setSpeed: (speed: number) => void
  setArraySize: (size: number) => void
  setValueRange: (range: number) => void
  
  // UI actions
  togglePseudocode: () => void
  toggleMetrics: () => void
  toggleAutoExplain: () => void
  toggleAlgorithmInfo: () => void
  
  // Utility actions
  generateRandomArray: () => number[]
  updateMetrics: (step: Step) => void
}

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  // Initial state
  algorithm: 'bubbleSort',
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 500,
  arraySize: 10,
  valueRange: 100,
  
  history: [],
  future: [],
  
  metrics: {
    comparisons: 0,
    swaps: 0,
    assignments: 0,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  
  showPseudocode: true,
  showMetrics: true,
  autoExplain: false,
  showAlgorithmInfo: false,
  
  // Core actions
  setAlgorithm: (algo) => {
    const complexities = {
      bubbleSort: { time: 'O(n²)', space: 'O(1)' },
      selectionSort: { time: 'O(n²)', space: 'O(1)' },
      insertionSort: { time: 'O(n²)', space: 'O(1)' },
      quickSort: { time: 'O(n log n)', space: 'O(log n)' },
      mergeSort: { time: 'O(n log n)', space: 'O(n)' },
      heapSort: { time: 'O(n log n)', space: 'O(1)' },
      countingSort: { time: 'O(n+k)', space: 'O(k)' },
      radixSort: { time: 'O(d(n+k))', space: 'O(n+k)' },
      bucketSort: { time: 'O(n+k)', space: 'O(n)' }
    }
    
    const complexity = complexities[algo] || complexities.bubbleSort
    set({ 
      algorithm: algo,
      metrics: {
        ...get().metrics,
        timeComplexity: complexity.time,
        spaceComplexity: complexity.space
      }
    })
  },

  setSteps: (steps) => {
    set({ 
      steps, 
      currentStep: 0, 
      history: [], 
      future: [],
      isPlaying: false,
      metrics: {
        comparisons: 0,
        swaps: 0,
        assignments: 0,
        timeComplexity: get().metrics.timeComplexity,
        spaceComplexity: get().metrics.spaceComplexity
      }
    })
    // Reset metrics when new steps are set
    if (steps.length > 0) {
      get().updateMetrics(steps[0])
    }
  },

  nextStep: () => {
    const { currentStep, steps, history } = get()
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1
      set({ 
        currentStep: newStep, 
        history: [...history, steps[currentStep]]
      })
      const step = steps[newStep]
      if (step) {
        get().updateMetrics(step)
      }
    }
  },
  
  prevStep: () => {
    const { currentStep, history } = get()
    if (currentStep > 0) {
      const newStep = currentStep - 1
      set({ 
        currentStep: newStep, 
        history: history.slice(0, history.length - 1) 
      })
      const step = get().steps[newStep]
      if (step) {
        get().updateMetrics(step)
      }
    }
  },

  jumpToStep: (index) => {
    const { steps } = get()
    if (index >= 0 && index < steps.length) {
      set({ currentStep: index })
      const step = steps[index]
      if (step) {
        get().updateMetrics(step)
      }
    }
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  reset: () => {
    const { steps } = get()
    set({ 
      currentStep: 0, 
      history: [], 
      future: [], 
      isPlaying: false,
      metrics: {
        comparisons: 0,
        swaps: 0,
        assignments: 0,
        timeComplexity: get().metrics.timeComplexity,
        spaceComplexity: get().metrics.spaceComplexity
      }
    })
    if (steps.length > 0) {
      get().updateMetrics(steps[0])
    }
  },

  undo: () => {
    const { history, currentStep, steps } = get()
    if (history.length > 0 && currentStep > 0) {
      const newStep = currentStep - 1
      set({
        currentStep: newStep,
        history: history.slice(0, history.length - 1)
      })
      const step = steps[newStep]
      if (step) {
        get().updateMetrics(step)
      }
    }
  },

  redo: () => {
    const { future, currentStep, steps } = get()
    if (future.length > 0 && currentStep < steps.length - 1) {
      const newStep = currentStep + 1
      set({
        currentStep: newStep,
        future: future.slice(1)
      })
      const step = steps[newStep]
      if (step) {
        get().updateMetrics(step)
      }
    }
  },

  setSpeed: (speed) => set({ speed }),
  setArraySize: (size) => set({ arraySize: size }),
  setValueRange: (range) => set({ valueRange: range }),

  // UI actions
  togglePseudocode: () => set((state) => ({ 
    showPseudocode: !state.showPseudocode 
  })),
  
  toggleMetrics: () => set((state) => ({ 
    showMetrics: !state.showMetrics 
  })),
  
  toggleAutoExplain: () => set((state) => ({ 
    autoExplain: !state.autoExplain 
  })),

  toggleAlgorithmInfo: () => set((state) => ({ 
    showAlgorithmInfo: !state.showAlgorithmInfo 
  })),

  // Utility actions
  generateRandomArray: () => {
    const { arraySize, valueRange } = get()
    return Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * valueRange) + 1
    )
  },
  
  updateMetrics: (step) => {
    set({
      metrics: {
        ...get().metrics,
        comparisons: step.comparisons || 0,
        swaps: step.swaps || 0,
        assignments: step.assignments || 0
      }
    })
  }
}))