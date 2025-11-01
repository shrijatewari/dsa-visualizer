import { useGraphVisualizerStore } from '../store/graphVisualizerStore'
import type { GraphAlgorithmType } from '../store/graphVisualizerStore'
import { dijkstraHeap } from '../algorithms/graph/dijkstraHeap'
import { dijkstraArray } from '../algorithms/graph/dijkstraArray'
import { useEffect } from 'react'

const algorithms = {
  dijkstraHeap: { name: 'Dijkstra (Heap)', function: dijkstraHeap },
  dijkstraArray: { name: 'Dijkstra (Array)', function: dijkstraArray }
} as const

export default function GraphControls() {
  const {
    algorithm,
    setAlgorithm,
    setSteps,
    setGraphSize,
    setGraphDensity,
    setSpeed,
    nextStep,
    prevStep,
    play,
    pause,
    reset,
    isPlaying,
    speed,
    graphSize,
    graphDensity,
    currentStep,
    steps,
    generateRandomGraph,
    nodes,
    sourceNode,
    targetNode,
    isAddingNode,
    isAddingEdge,
    isSettingTarget,
    edgeFrom,
    setSourceNode,
    setTargetNode,
    setIsAddingNode,
    setIsAddingEdge,
    setIsSettingTarget,
    setEdgeFrom,
    toggleAlgorithmInfo
  } = useGraphVisualizerStore()

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

  // Run algorithm when we have a graph and source node but no steps
  useEffect(() => {
    if (nodes.length > 0 && sourceNode && steps.length === 0 && algorithm !== 'both') {
      runAlgorithm()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, sourceNode, algorithm])

  const handleAlgorithmChange = (newAlgorithm: GraphAlgorithmType) => {
    setAlgorithm(newAlgorithm)
    runAlgorithm(newAlgorithm)
  }

  const runAlgorithm = (algo: GraphAlgorithmType = algorithm) => {
    if (algo === 'both') return // Handle comparison mode separately later
    
    if (nodes.length === 0) {
      const { nodes: newNodes } = generateRandomGraph()
      if (newNodes.length > 0) {
        setSourceNode(newNodes[0].id)
        runAlgorithm(algo)
        return
      }
    }

    if (!sourceNode && nodes.length > 0) {
      setSourceNode(nodes[0].id)
    }

    if (!sourceNode) return

    console.log(`Running algorithm: ${algo}`)
    const algorithmFunction = algorithms[algo]?.function
    if (!algorithmFunction) return
    
    const edges = useGraphVisualizerStore.getState().edges
    const newSteps = algorithmFunction(nodes, edges, sourceNode)
    console.log(`Generated ${newSteps.length} steps for ${algo}`)
    setSteps(newSteps)
  }

  const handleGraphSizeChange = (newSize: number) => {
    setGraphSize(newSize)
    generateRandomGraph()
  }

  const handleGraphDensityChange = (newDensity: number) => {
    setGraphDensity(newDensity)
    generateRandomGraph()
  }

  return (
    <div className="w-full bg-gradient-to-br from-neon-bg-light to-neon-background rounded-xl p-6 space-y-6 border border-neon-primary/30 shadow-2xl neon-glow-blue">
      {/* Algorithm Selection */}
      <div>
        <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Algorithm Selection</h3>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(algorithms).map(([key, algo]) => (
            <button
              key={key}
              onClick={() => handleAlgorithmChange(key as GraphAlgorithmType)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 font-mono text-center ${
                algorithm === key
                  ? 'bg-neon-primary text-neon-background border-2 border-neon-primary-light shadow-lg neon-glow-blue transform scale-105'
                  : 'bg-neon-background text-neon-text/80 hover:bg-neon-primary/20 border border-neon-primary/50 hover:border-neon-primary hover:scale-105 neon-glow-blue'
              }`}
            >
              {algo.name}
            </button>
          ))}
          <button
            onClick={toggleAlgorithmInfo}
            className="mt-2 px-4 py-2 bg-neon-secondary text-neon-text rounded-lg hover:bg-neon-secondary-light transition-all duration-300 text-sm font-mono border border-neon-secondary-light/50 neon-glow-pink"
          >
            ℹ️ Learn about Dijkstra's Algorithm
          </button>
        </div>
      </div>

      {/* Graph Configuration */}
      <div>
        <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Graph Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neon-text/80 mb-2 font-mono">
              Graph Size: {graphSize} nodes
            </label>
            <input
              type="range"
              min="5"
              max="15"
              value={graphSize}
              onChange={(e) => handleGraphSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-neon-background rounded-lg appearance-none cursor-pointer slider-neon"
            />
          </div>
          <div>
            <label className="block text-sm text-neon-text/80 mb-2 font-mono">
              Graph Density: {graphDensity}%
            </label>
            <input
              type="range"
              min="20"
              max="80"
              value={graphDensity}
              onChange={(e) => handleGraphDensityChange(Number(e.target.value))}
              className="w-full h-2 bg-neon-background rounded-lg appearance-none cursor-pointer slider-neon"
            />
          </div>
        </div>
        <button
          onClick={() => {
            generateRandomGraph()
            runAlgorithm()
          }}
          className="mt-3 px-4 py-2 bg-neon-highlight text-neon-background rounded-lg hover:bg-neon-highlight-light transition-all duration-300 font-mono font-semibold border border-neon-highlight-light/50 neon-glow-gold w-full"
        >
          Generate New Graph
        </button>
      </div>

      {/* Instructions */}
      <div>
        <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">How to Use</h3>
        <div className="bg-neon-background/60 p-4 rounded-lg border border-neon-primary/30 space-y-3 text-xs font-mono">
          <div className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">1.</span>
            <span className="text-neon-text/80">
              <strong className="text-neon-primary">Click any node</strong> to set it as the source (cyan)
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">2.</span>
            <span className="text-neon-text/80">
              <strong className="text-purple-400">Click "Set Target"</strong> then click a node to set target (purple)
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 font-bold">3.</span>
            <span className="text-neon-text/80">
              Click <strong className="text-neon-highlight">Generate New Graph</strong> or select an algorithm to run
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold">4.</span>
            <span className="text-neon-text/80">
              View <strong className="text-cyan-400">Shortest Path</strong> in Metrics panel after completion
            </span>
          </div>
          <div className="flex items-start gap-2 mt-3 pt-3 border-t border-neon-primary/20">
            <span className="text-neon-secondary font-bold">+</span>
            <span className="text-neon-text/80">
              Use <strong>Add Node/Edge</strong> buttons to build custom graphs
            </span>
          </div>
        </div>
      </div>

      {/* Graph Editing Controls */}
      <div>
        <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Graph Tools</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => setIsAddingNode(true)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all text-center ${
                isAddingNode 
                  ? 'bg-neon-highlight text-neon-background' 
                  : 'bg-neon-background text-neon-text hover:bg-neon-primary/20 border border-neon-primary/50'
              }`}
            >
              ➕ Add Node
            </button>
            <button
              onClick={() => setIsAddingEdge(true)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all text-center ${
                isAddingEdge 
                  ? 'bg-neon-highlight text-neon-background' 
                  : 'bg-neon-background text-neon-text hover:bg-neon-primary/20 border border-neon-primary/50'
              }`}
            >
              🔗 Add Edge
            </button>
            <button
              onClick={() => setIsSettingTarget(true)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all text-center ${
                isSettingTarget 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-neon-background text-neon-text hover:bg-purple-500/20 border border-purple-500/50'
              }`}
            >
              🎯 Set Target
            </button>
          </div>
          {(isAddingNode || isAddingEdge || isSettingTarget) && (
            <button
              onClick={() => {
                setIsAddingNode(false)
                setIsAddingEdge(false)
                setIsSettingTarget(false)
                setEdgeFrom(null)
              }}
              className="w-full px-4 py-2 bg-neon-secondary text-neon-text rounded-lg font-mono text-sm hover:bg-neon-secondary-light transition-all"
            >
              Cancel
            </button>
          )}
          <div className="bg-neon-bg-light/60 p-2 rounded-lg border border-neon-primary/20 text-xs font-mono text-neon-text/70 text-center">
            {isAddingNode && '→ Click on graph to add node'}
            {isAddingEdge && '→ Click two nodes to connect'}
            {isSettingTarget && '→ Click a node to set as target'}
            {!isAddingNode && !isAddingEdge && !isSettingTarget && 'Click node to set as source'}
          </div>
          {(sourceNode || targetNode) && (
            <div className="space-y-1 text-xs font-mono">
              {sourceNode && (
                <div className="bg-cyan-500/20 px-2 py-1 rounded border border-cyan-500/30 text-cyan-400">
                  Source: {sourceNode}
                </div>
              )}
              {targetNode && (
                <div className="bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30 text-purple-400">
                  Target: {targetNode}
                </div>
              )}
            </div>
          )}
        </div>
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
            style={{ width: `${steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0}%` }}
          ></div>
        </div>
        <p className="text-sm text-neon-text/80 mt-2 font-mono">
          {currentStep + 1} / {steps.length} steps
        </p>
      </div>
    </div>
  )
}

