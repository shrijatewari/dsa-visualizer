import { create } from 'zustand'

export type GraphAlgorithmType = 'dijkstraArray' | 'dijkstraHeap' | 'both'

export type NodeId = string

export type GraphNode = {
  id: NodeId
  x: number
  y: number
  dist?: number
  visited?: boolean
  prev?: NodeId
  state?: 'unvisited' | 'frontier' | 'visiting' | 'visited' | 'source' | 'target'
}

export type GraphEdge = {
  id: string
  from: NodeId
  to: NodeId
  weight: number
}

export type GraphSnapshot = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export type GraphStep = {
  description: string
  snapshot: GraphSnapshot
  highlightNodes?: NodeId[]
  highlightEdges?: string[]
  pqState?: Array<{ id: NodeId; key: number }>
  activeLine?: number
  metrics?: {
    comparisons?: number
    relaxations?: number
    heapOps?: number
    visitedNodes?: number
  }
}

type ComparisonState = {
  arraySteps: GraphStep[]
  heapSteps: GraphStep[]
  arrayMetrics: {
    comparisons: number
    relaxations: number
    visitedNodes: number
  }
  heapMetrics: {
    comparisons: number
    relaxations: number
    heapOps: number
    visitedNodes: number
  }
}

type GraphVisualizerState = {
  // Core state
  algorithm: GraphAlgorithmType
  steps: GraphStep[]
  currentStep: number
  isPlaying: boolean
  speed: number
  graphSize: number
  graphDensity: number

  // Graph data
  nodes: GraphNode[]
  edges: GraphEdge[]
  sourceNode: NodeId | null
  targetNode: NodeId | null

  // Comparison mode
  comparisonMode: boolean
  comparison: ComparisonState

  // Navigation
  history: GraphStep[]
  future: GraphStep[]

  // Metrics
  metrics: {
    comparisons: number
    relaxations: number
    heapOps: number
    visitedNodes: number
  }

  // UI state
  showPseudocode: boolean
  showMetrics: boolean
  showAlgorithmInfo: boolean
  
  // Interactive editing state
  isAddingNode: boolean
  isAddingEdge: boolean
  isSettingTarget: boolean
  edgeFrom: string | null
  hoveredNode: NodeId | null

  // Core actions
  setAlgorithm: (algo: GraphAlgorithmType) => void
  setSteps: (steps: GraphStep[]) => void
  nextStep: () => void
  prevStep: () => void
  jumpToStep: (index: number) => void
  play: () => void
  pause: () => void
  reset: () => void
  undo: () => void
  redo: () => void
  setSpeed: (speed: number) => void
  setGraphSize: (size: number) => void
  setGraphDensity: (density: number) => void

  // Graph actions
  setNodes: (nodes: GraphNode[]) => void
  setEdges: (edges: GraphEdge[]) => void
  setSourceNode: (nodeId: NodeId | null) => void
  setTargetNode: (nodeId: NodeId | null) => void
  generateRandomGraph: () => { nodes: GraphNode[]; edges: GraphEdge[] }

  // Comparison actions
  setComparisonMode: (enabled: boolean) => void
  setComparisonSteps: (arraySteps: GraphStep[], heapSteps: GraphStep[]) => void

  // UI actions
  togglePseudocode: () => void
  toggleMetrics: () => void
  toggleAlgorithmInfo: () => void
  
  // Interactive editing actions
  setIsAddingNode: (value: boolean) => void
  setIsAddingEdge: (value: boolean) => void
  setIsSettingTarget: (value: boolean) => void
  setEdgeFrom: (nodeId: string | null) => void
  setHoveredNode: (nodeId: NodeId | null) => void

  // Utility actions
  updateMetrics: (step: GraphStep) => void
}

export const useGraphVisualizerStore = create<GraphVisualizerState>((set, get) => ({
  // Initial state
  algorithm: 'dijkstraHeap',
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 500,
  graphSize: 8,
  graphDensity: 40,
  nodes: [],
  edges: [],
  sourceNode: null,
  targetNode: null,
  comparisonMode: false,
  comparison: {
    arraySteps: [],
    heapSteps: [],
    arrayMetrics: { comparisons: 0, relaxations: 0, visitedNodes: 0 },
    heapMetrics: { comparisons: 0, relaxations: 0, heapOps: 0, visitedNodes: 0 }
  },
  history: [],
  future: [],
  metrics: {
    comparisons: 0,
    relaxations: 0,
    heapOps: 0,
    visitedNodes: 0
  },
  showPseudocode: true,
  showMetrics: true,
  showAlgorithmInfo: false,
  
  // Interactive editing state
  isAddingNode: false,
  isAddingEdge: false,
  isSettingTarget: false,
  edgeFrom: null,
  hoveredNode: null,

  // Core actions
  setAlgorithm: (algo) => {
    set({ algorithm: algo })
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
        relaxations: 0,
        heapOps: 0,
        visitedNodes: 0
      }
    })
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
        relaxations: 0,
        heapOps: 0,
        visitedNodes: 0
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
  setGraphSize: (size) => set({ graphSize: size }),
  setGraphDensity: (density) => set({ graphDensity: density }),

  // Graph actions
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSourceNode: (nodeId) => {
    const { nodes, setNodes } = get()
    if (nodeId && nodes.length > 0) {
      const updatedNodes = nodes.map(node => ({
        ...node,
        dist: node.id === nodeId ? 0 : Infinity,
        state: node.id === nodeId ? 'source' as const : (node.state === 'target' ? node.state : 'unvisited' as const),
        visited: false
      }))
      setNodes(updatedNodes)
    }
    set({ sourceNode: nodeId })
  },
  setTargetNode: (nodeId) => {
    const { nodes, setNodes } = get()
    if (nodeId && nodes.length > 0) {
      const updatedNodes = nodes.map(node =>
        node.id === nodeId ? { ...node, state: 'target' as const } : node
      )
      setNodes(updatedNodes)
    }
    if (!nodeId && nodes.length > 0) {
      const updatedNodes = nodes.map(node =>
        node.state === 'target' ? { ...node, state: 'unvisited' as const } : node
      )
      setNodes(updatedNodes)
    }
    set({ targetNode: nodeId })
  },

  generateRandomGraph: () => {
    const { graphSize, graphDensity } = get()
    const nodes: GraphNode[] = []
    const edges: GraphEdge[] = []

    // Generate nodes in a circular layout
    const centerX = 400
    const centerY = 300
    const radius = 120
    
    for (let i = 0; i < graphSize; i++) {
      const angle = (2 * Math.PI * i) / graphSize
      nodes.push({
        id: `node-${i}`,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        state: 'unvisited'
      })
    }

    // Generate edges based on density
    for (let i = 0; i < graphSize; i++) {
      for (let j = i + 1; j < graphSize; j++) {
        if (Math.random() * 100 < graphDensity) {
          const weight = Math.floor(Math.random() * 20) + 1
          // Add bidirectional edge
          edges.push({
            id: `edge-${i}-${j}`,
            from: `node-${i}`,
            to: `node-${j}`,
            weight
          })
          edges.push({
            id: `edge-${j}-${i}`,
            from: `node-${j}`,
            to: `node-${i}`,
            weight
          })
        }
      }
    }

    set({ nodes, edges })
    return { nodes, edges }
  },

  // Comparison actions
  setComparisonMode: (enabled) => set({ comparisonMode: enabled }),

  setComparisonSteps: (arraySteps, heapSteps) => {
    set({
      comparison: {
        arraySteps,
        heapSteps,
        arrayMetrics: { comparisons: 0, relaxations: 0, visitedNodes: 0 },
        heapMetrics: { comparisons: 0, relaxations: 0, heapOps: 0, visitedNodes: 0 }
      }
    })
  },

  // UI actions
  togglePseudocode: () => set((state) => ({ showPseudocode: !state.showPseudocode })),
  toggleMetrics: () => set((state) => ({ showMetrics: !state.showMetrics })),
  toggleAlgorithmInfo: () => set((state) => ({ showAlgorithmInfo: !state.showAlgorithmInfo })),
  
  // Interactive editing actions
  setIsAddingNode: (value) => set({ isAddingNode: value }),
  setIsAddingEdge: (value) => set({ isAddingEdge: value }),
  setIsSettingTarget: (value) => set({ isSettingTarget: value }),
  setEdgeFrom: (nodeId) => set({ edgeFrom: nodeId }),
  setHoveredNode: (nodeId) => set({ hoveredNode: nodeId }),

  // Utility actions
  updateMetrics: (step) => {
    set({
      metrics: {
        comparisons: step.metrics?.comparisons || 0,
        relaxations: step.metrics?.relaxations || 0,
        heapOps: step.metrics?.heapOps || 0,
        visitedNodes: step.metrics?.visitedNodes || 0
      }
    })
  }
}))


