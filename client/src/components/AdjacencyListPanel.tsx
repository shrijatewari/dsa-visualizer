import { useState, useMemo } from 'react'
import { useGraphVisualizerStore } from '../store/graphVisualizerStore'
import type { NodeId } from '../store/graphVisualizerStore'

type AdjacencyEntry = {
  nodeId: NodeId
  neighbors: Array<{ nodeId: NodeId; weight: number }>
}

export default function AdjacencyListPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const {
    nodes,
    edges,
    hoveredNode,
    setHoveredNode,
    steps,
    currentStep,
    sourceNode,
    targetNode
  } = useGraphVisualizerStore()

  // Build adjacency list from nodes and edges
  const adjacencyList = useMemo<AdjacencyEntry[]>(() => {
    if (nodes.length === 0) return []

    // Create a map of nodeId -> array of neighbors with weights
    const adjacencyMap = new Map<NodeId, Array<{ nodeId: NodeId; weight: number }>>()

    // Initialize map with all nodes
    nodes.forEach(node => {
      adjacencyMap.set(node.id, [])
    })

    // Add edges to adjacency map
    edges.forEach(edge => {
      const neighbors = adjacencyMap.get(edge.from) || []
      neighbors.push({ nodeId: edge.to, weight: edge.weight })
      adjacencyMap.set(edge.from, neighbors)
    })

    // Convert to array and sort by node ID for consistent display
    const entries: AdjacencyEntry[] = Array.from(adjacencyMap.entries())
      .map(([nodeId, neighbors]) => ({
        nodeId,
        neighbors: neighbors.sort((a, b) => a.nodeId.localeCompare(b.nodeId))
      }))
      .sort((a, b) => a.nodeId.localeCompare(b.nodeId))

    return entries
  }, [nodes, edges])

  // Get current node being processed in algorithm
  const currentStepData = steps[currentStep]
  const currentNodeId = currentStepData?.highlightNodes?.[0] || null

  // Get node display name (short version)
  const getNodeDisplayName = (nodeId: NodeId): string => {
    return nodeId.split('-')[1] || nodeId.slice(0, 2)
  }

  // Get node state styling
  const getNodeStateColor = (nodeId: NodeId): string => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return 'text-neon-text/60'

    if (node.state === 'source') return 'text-cyan-400'
    if (node.state === 'target') return 'text-purple-400'
    if (node.state === 'visited') return 'text-green-400'
    if (node.state === 'frontier') return 'text-yellow-400'
    return 'text-neon-text'
  }

  if (nodes.length === 0) {
    return (
      <div className="w-full bg-neon-bg-light rounded-lg p-6 border border-neon-primary/20 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neon-text font-mono">Adjacency List</h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-neon-text/60 hover:text-neon-text transition-all duration-300 font-mono"
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
        </div>
        {!isCollapsed && (
          <div className="text-neon-text/60 text-sm font-mono text-center py-4">
            No graph to display
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full bg-neon-bg-light rounded-lg border border-neon-primary/20 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-4 border-b border-neon-primary/20">
        <h3 className="text-lg font-semibold text-neon-text font-mono">Adjacency List</h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-neon-text/60 hover:text-neon-text transition-all duration-300 font-mono text-sm px-2 py-1 hover:bg-neon-primary/10 rounded"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="max-h-[500px] overflow-y-auto">
          <div className="p-4 space-y-3">
            {adjacencyList.map((entry) => {
              const isHovered = hoveredNode === entry.nodeId
              const isCurrentNode = currentNodeId === entry.nodeId
              const isSource = sourceNode === entry.nodeId
              const isTarget = targetNode === entry.nodeId

              return (
                <div
                  key={entry.nodeId}
                  onMouseEnter={() => setHoveredNode(entry.nodeId)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`
                    p-3 rounded-lg border transition-all duration-300 font-mono text-sm
                    ${
                      isCurrentNode
                        ? 'bg-neon-primary/30 border-neon-primary shadow-lg neon-glow-blue'
                        : isHovered
                        ? 'bg-neon-primary/20 border-neon-primary/50 shadow-md'
                        : 'bg-neon-background/50 border-neon-primary/20 hover:bg-neon-primary/10'
                    }
                  `}
                >
                  {/* Node header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`
                        font-bold text-base
                        ${getNodeStateColor(entry.nodeId)}
                        ${isCurrentNode ? 'neon-glow-blue' : ''}
                      `}
                    >
                      {getNodeDisplayName(entry.nodeId)}
                    </span>
                    {isSource && (
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
                        SOURCE
                      </span>
                    )}
                    {isTarget && (
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">
                        TARGET
                      </span>
                    )}
                    {isCurrentNode && (
                      <span className="text-xs bg-neon-primary/30 text-neon-primary px-2 py-0.5 rounded border border-neon-primary/50">
                        CURRENT
                      </span>
                    )}
                    <span className="text-neon-text/40">→</span>
                  </div>

                  {/* Neighbors list - Format: (B, 4), (C, 2) */}
                  <div className="ml-4 flex flex-wrap gap-1.5 items-center">
                    {entry.neighbors.length > 0 ? (
                      <>
                        {entry.neighbors.map((neighbor, index) => (
                          <span
                            key={neighbor.nodeId}
                            className={`
                              inline-flex items-center gap-1 px-2 py-1 rounded
                              ${
                                hoveredNode === neighbor.nodeId
                                  ? 'bg-neon-primary/30 text-neon-primary border border-neon-primary/50 shadow-md'
                                  : 'bg-neon-bg-light text-neon-text/80 border border-neon-primary/20'
                              }
                              transition-all duration-200 cursor-pointer
                            `}
                            onMouseEnter={() => setHoveredNode(neighbor.nodeId)}
                            onMouseLeave={() => setHoveredNode(entry.nodeId)}
                          >
                            <span className="text-neon-text/60">(</span>
                            <span className="font-semibold text-neon-text">
                              {getNodeDisplayName(neighbor.nodeId)}
                            </span>
                            <span className="text-neon-text/60">,</span>
                            <span className="text-neon-highlight font-bold">
                              {neighbor.weight}
                            </span>
                            <span className="text-neon-text/60">)</span>
                            {index < entry.neighbors.length - 1 && (
                              <span className="text-neon-text/40 ml-1">,</span>
                            )}
                          </span>
                        ))}
                      </>
                    ) : (
                      <span className="text-neon-text/40 italic">No connections</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

