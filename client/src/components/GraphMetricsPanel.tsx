import { useGraphVisualizerStore } from '../store/graphVisualizerStore'

export default function GraphMetricsPanel() {
  const { 
    metrics, 
    showMetrics, 
    toggleMetrics,
    steps,
    currentStep, 
    algorithm,
    sourceNode,
    targetNode
  } = useGraphVisualizerStore()

  if (!showMetrics) {
    return (
      <div className="w-full bg-neon-bg-light rounded-lg p-6 border border-neon-primary/20">
        <button
          onClick={toggleMetrics}
          className="w-full py-4 text-neon-text/60 hover:text-neon-text transition-all duration-300 font-mono"
        >
          Show Metrics
        </button>
      </div>
    )
  }

  const getAlgorithmInfo = () => {
    const info = {
      dijkstraHeap: { 
        name: 'Dijkstra (Heap)', 
        time: 'O(E log V)', 
        space: 'O(V + E)',
        description: 'Heap-based implementation using priority queue'
      },
      dijkstraArray: { 
        name: 'Dijkstra (Array)', 
        time: 'O(V²)', 
        space: 'O(V + E)',
        description: 'Array-based implementation with linear minimum search'
      }
    }
    return algorithm === 'both' ? info.dijkstraHeap : info[algorithm] || info.dijkstraHeap
  }

  const algorithmInfo = getAlgorithmInfo()

  // Calculate shortest path info from final step
  const getShortestPathInfo = () => {
    if (steps.length === 0 || !sourceNode) return null
    
    const finalStep = steps[steps.length - 1]
    const finalNodes = finalStep.snapshot.nodes
    
    // Find shortest distances to all nodes
    const distances = finalNodes.map(node => ({
      id: node.id,
      dist: node.dist || Infinity
    }))
    
    // If target node is set, get shortest distance to it
    if (targetNode) {
      const targetDist = finalNodes.find(n => n.id === targetNode)?.dist
      return {
        from: sourceNode,
        to: targetNode,
        distance: targetDist || Infinity
      }
    }
    
    // Otherwise, show shortest distance among all nodes (excluding source)
    const nonInfiniteDistances = distances.filter(d => d.id !== sourceNode && d.dist !== Infinity)
    const shortestDistance = nonInfiniteDistances.length > 0
      ? Math.min(...nonInfiniteDistances.map(d => d.dist))
      : null
    
    return {
      from: sourceNode,
      to: nonInfiniteDistances.find(d => d.dist === shortestDistance)?.id || 'N/A',
      distance: shortestDistance
    }
  }

  const pathInfo = getShortestPathInfo()

  return (
    <div className="w-full bg-neon-bg-light rounded-lg p-6 border border-neon-primary/20 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neon-text font-mono">Metrics & Analysis</h3>
        <button
          onClick={toggleMetrics}
          className="text-neon-text/60 hover:text-neon-text transition-all duration-300 font-mono"
        >
          Hide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Runtime Metrics */}
        <div>
          <h4 className="text-md font-semibold text-neon-text mb-3 font-mono">Runtime Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-neon-background rounded-lg border border-neon-primary/20">
              <span className="text-neon-text/80 font-mono">Comparisons:</span>
              <span className="text-neon-primary font-mono font-bold">{metrics.comparisons}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neon-background rounded-lg border border-neon-primary/20">
              <span className="text-neon-text/80 font-mono">Relaxations:</span>
              <span className="text-neon-secondary font-mono font-bold">{metrics.relaxations}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neon-background rounded-lg border border-neon-primary/20">
              <span className="text-neon-text/80 font-mono">Heap Ops:</span>
              <span className="text-neon-accent font-mono font-bold">{metrics.heapOps}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neon-background rounded-lg border border-neon-primary/20">
              <span className="text-neon-text/80 font-mono">Visited Nodes:</span>
              <span className="text-neon-highlight font-mono font-bold">{metrics.visitedNodes}</span>
            </div>
          </div>
        </div>

        {/* Algorithm Complexity */}
        <div>
          <h4 className="text-md font-semibold text-neon-text mb-3 font-mono">Algorithm Complexity</h4>
          <div className="space-y-3">
            <div className="p-3 bg-neon-background rounded-lg border border-neon-primary/20">
              <div className="text-sm text-neon-text/60 mb-1 font-mono">Algorithm:</div>
              <div className="text-neon-text font-semibold font-mono">{algorithmInfo.name}</div>
            </div>
            <div className="p-3 bg-neon-background rounded-lg border border-neon-primary/20">
              <div className="text-sm text-neon-text/60 mb-1 font-mono">Time Complexity:</div>
              <div className="text-neon-primary font-mono">{algorithmInfo.time}</div>
            </div>
            <div className="p-3 bg-neon-background rounded-lg border border-neon-primary/20">
              <div className="text-sm text-neon-text/60 mb-1 font-mono">Space Complexity:</div>
              <div className="text-neon-secondary font-mono">{algorithmInfo.space}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Shortest Path Info */}
      {pathInfo && (
        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-500/30">
          <h4 className="text-md font-semibold text-neon-text mb-3 font-mono">Shortest Path</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-neon-background/60 rounded-lg border border-neon-primary/20">
              <div className="text-sm text-neon-text/60 mb-1 font-mono">From:</div>
              <div className="text-cyan-400 font-bold font-mono">{pathInfo.from}</div>
            </div>
            <div className="p-3 bg-neon-background/60 rounded-lg border border-neon-primary/20">
              <div className="text-sm text-neon-text/60 mb-1 font-mono">To:</div>
              <div className="text-cyan-400 font-bold font-mono">{pathInfo.to}</div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-neon-background/60 rounded-lg border border-cyan-500/30">
            <div className="text-sm text-neon-text/60 mb-1 font-mono">Shortest Distance:</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">
              {pathInfo.distance === Infinity ? '∞' : pathInfo.distance}
            </div>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-neon-background rounded-lg border border-neon-primary/20">
        <h4 className="text-md font-semibold text-neon-text mb-2 font-mono">Progress Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-neon-primary">{currentStep + 1}</div>
            <div className="text-sm text-neon-text/60 font-mono">Current Step</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-highlight">{steps.length}</div>
            <div className="text-sm text-neon-text/60 font-mono">Total Steps</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-secondary">
              {steps.length > 0 ? Math.round(((currentStep + 1) / steps.length) * 100) : 0}%
            </div>
            <div className="text-sm text-neon-text/60 font-mono">Complete</div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-4 p-4 bg-neon-background rounded-lg border border-neon-primary/20">
        <h4 className="text-md font-semibold text-neon-text mb-2 font-mono">Performance Insights</h4>
        <div className="text-sm text-neon-text/80 space-y-1 font-mono">
          {metrics.comparisons > 0 && currentStep > 0 && (
            <div>• Average comparisons per step: {(metrics.comparisons / (currentStep + 1)).toFixed(1)}</div>
          )}
          {metrics.relaxations > 0 && currentStep > 0 && (
            <div>• Average relaxations per step: {(metrics.relaxations / (currentStep + 1)).toFixed(1)}</div>
          )}
          {metrics.heapOps > 0 && currentStep > 0 && (
            <div>• Heap operations per visited node: {(metrics.heapOps / Math.max(1, metrics.visitedNodes)).toFixed(1)}</div>
          )}
          {steps.length > 0 && currentStep > 0 && (
            <div>• Efficiency: {((steps.length - currentStep) / steps.length * 100).toFixed(1)}% remaining</div>
          )}
        </div>
      </div>
    </div>
  )
}

