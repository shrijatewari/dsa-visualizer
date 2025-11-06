import { useGraphVisualizerStore } from '../store/graphVisualizerStore'

export default function GraphCanvas() {
  const { 
    steps, 
    currentStep, 
    nodes, 
    edges, 
    sourceNode,
    targetNode,
    isAddingNode,
    isAddingEdge,
    isSettingTarget,
    edgeFrom,
    hoveredNode,
    setSourceNode,
    setTargetNode,
    setIsAddingNode,
    setIsAddingEdge,
    setIsSettingTarget,
    setEdgeFrom,
    setHoveredNode,
    setNodes, 
    setEdges 
  } = useGraphVisualizerStore()
  
  const currentStepData = steps[currentStep]

  const handleNodeClick = (nodeId: string) => {
    if (isAddingEdge) {
      if (!edgeFrom) {
        setEdgeFrom(nodeId)
      } else {
        const weight = prompt('Enter edge weight:', '1')
        if (weight && !isNaN(Number(weight))) {
          const newEdge = {
            id: `edge-${edgeFrom}-${nodeId}`,
            from: edgeFrom,
            to: nodeId,
            weight: Number(weight)
          }
          setEdges([...edges, newEdge])
        }
        setIsAddingEdge(false)
        setEdgeFrom(null)
      }
    } else if (isSettingTarget) {
      if (targetNode === nodeId) {
        setTargetNode(null)
      } else {
        setTargetNode(nodeId)
      }
      setIsSettingTarget(false)
    } else {
      // Clear steps when changing source node so we can see the base graph
      const { setSteps } = useGraphVisualizerStore.getState()
      setSteps([])
      
      // Toggle source node (store handles updating node states)
      if (sourceNode === nodeId) {
        // Reset all nodes to unvisited when clearing source
        const updatedNodes = nodes.map(node => ({
          ...node,
          dist: undefined,
          state: node.state === 'target' ? 'target' as const : 'unvisited' as const,
          visited: false
        }))
        setNodes(updatedNodes)
        setSourceNode(null)
      } else {
        setSourceNode(nodeId)
      }
    }
  }

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isAddingNode && e.target === e.currentTarget) {
      const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const newNodeId = `node-${nodes.length}`
      const newNode = {
        id: newNodeId,
        x,
        y,
        state: 'unvisited' as const
      }
      setNodes([...nodes, newNode])
      setIsAddingNode(false)
    }
  }

  const displayNodes = currentStepData ? currentStepData.snapshot.nodes : nodes
  const displayEdges = currentStepData ? currentStepData.snapshot.edges : edges

  const getNodeColor = (node: typeof nodes[0]) => {
    const isHighlighted = currentStepData?.highlightNodes?.includes(node.id)
    
    if (node.state === 'source') {
      return isHighlighted
        ? 'fill-cyan-400 stroke-cyan-300 stroke-2'
        : 'fill-cyan-500 stroke-cyan-400 stroke-2'
    }
    if (node.state === 'target') {
      return 'fill-purple-500 stroke-purple-400 stroke-2'
    }
    if (node.state === 'visited') {
      return isHighlighted
        ? 'fill-green-400 stroke-green-300 stroke-2'
        : 'fill-green-600 stroke-green-500'
    }
    if (node.state === 'frontier') {
      return isHighlighted
        ? 'fill-yellow-400 stroke-yellow-300 stroke-2'
        : 'fill-yellow-600 stroke-yellow-500'
    }
    if (isHighlighted) {
      return 'fill-blue-400 stroke-blue-300 stroke-2'
    }
    if (edgeFrom === node.id) {
      return 'fill-orange-500 stroke-orange-400 stroke-2'
    }
    return 'fill-gray-500 stroke-gray-400'
  }

  const getEdgeColor = (edgeId: string) => {
    const isHighlighted = currentStepData?.highlightEdges?.includes(edgeId)
    return isHighlighted
      ? 'stroke-blue-400 stroke-width-3'
      : 'stroke-gray-600'
  }

  if (!currentStepData && displayNodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-neon-bg-light rounded-lg border border-neon-primary/20">
        <p className="text-neon-text/60 mb-4">No graph to visualize</p>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingNode(true)}
            className="px-4 py-2 bg-neon-primary text-neon-background rounded-lg hover:bg-neon-primary-light transition-all font-mono"
          >
            Add Node
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gradient-to-br from-neon-bg-light to-neon-background rounded-xl p-6 border border-neon-primary/30 shadow-2xl neon-glow-blue">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-neon-text mb-2 font-mono">
          Dijkstra's Algorithm Visualization
        </h3>
        <div className="flex items-center gap-4 text-sm text-neon-text/80 mb-3">
          {currentStepData && (
            <span className="bg-neon-primary/20 px-3 py-1 rounded-full font-mono font-semibold border border-neon-primary/30 neon-glow-blue">
              Step {currentStep + 1} of {steps.length}
            </span>
          )}
          {!currentStepData && (
            <div className="flex gap-2">
              {sourceNode && (
                <span className="bg-cyan-500/20 px-3 py-1 rounded-full font-mono font-semibold border border-cyan-500/30">
                  Source: {sourceNode}
                </span>
              )}
              {targetNode && (
                <span className="bg-purple-500/20 px-3 py-1 rounded-full font-mono font-semibold border border-purple-500/30">
                  Target: {targetNode}
                </span>
              )}
            </div>
          )}
        </div>
        {currentStepData && (
          <p className="text-sm text-neon-text/80 italic p-3 bg-neon-background/80 rounded-xl border-l-4 border-neon-primary backdrop-blur-sm shadow-lg neon-glow-blue">
            {currentStepData.description}
          </p>
        )}
      </div>


      {/* SVG Canvas - Bigger! */}
      <div className="relative w-full h-[600px] bg-gradient-to-br from-neon-background to-neon-bg-light rounded-xl border border-neon-primary/20 shadow-2xl neon-glow-blue overflow-hidden">
        <svg 
          viewBox="0 0 800 600" 
          className="w-full h-full cursor-crosshair"
          onClick={handleSvgClick}
        >
          {/* Draw edges */}
          {displayEdges.map(edge => {
            const fromNode = displayNodes.find(n => n.id === edge.from)
            const toNode = displayNodes.find(n => n.id === edge.to)
            
            if (!fromNode || !toNode) return null

            return (
              <g key={edge.id}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  strokeWidth={3}
                  className={`${getEdgeColor(edge.id)} transition-all duration-300`}
                  style={{ opacity: 0.7 }}
                />
                {(fromNode.x !== toNode.x || fromNode.y !== toNode.y) && (
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 - 8}
                    className="fill-neon-text font-mono text-sm font-bold pointer-events-none"
                    style={{
                      textShadow: '0 0 8px rgba(0, 212, 255, 0.8)'
                    }}
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            )
          })}

          {/* Draw nodes */}
          {displayNodes.map(node => {
            const isHovered = hoveredNode === node.id
            const isHighlighted = currentStepData?.highlightNodes?.includes(node.id)
            return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={isHighlighted ? 30 : isHovered ? 28 : 25}
                className={`${getNodeColor(node)} transition-all duration-300 cursor-pointer`}
                style={{
                  filter: isHovered 
                    ? 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.8))' 
                    : 'drop-shadow(0 0 12px currentColor)',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleNodeClick(node.id)
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />
              
              <text
                x={node.x}
                y={node.y + 7}
                className="fill-neon-text font-mono text-sm font-bold pointer-events-none"
                textAnchor="middle"
              >
                {node.id.split('-')[1] || node.id.slice(0, 2)}
              </text>

              {node.dist !== undefined && (
                <text
                  x={node.x}
                  y={node.y - 35}
                  className={`font-mono text-xs font-bold pointer-events-none ${
                    node.dist === Infinity ? 'fill-red-400' : 'fill-cyan-300'
                  }`}
                  textAnchor="middle"
                  style={{
                    textShadow: node.dist === Infinity
                      ? '0 0 8px rgba(239, 68, 68, 0.8)'
                      : '0 0 8px rgba(0, 212, 255, 0.8)'
                  }}
                >
                  {node.dist === Infinity ? '∞' : node.dist}
                </text>
              )}
            </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-blue">
          <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
          <span className="text-neon-text font-mono font-semibold">Source</span>
        </div>
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-purple-500/30 backdrop-blur-sm shadow-lg neon-glow-purple">
          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          <span className="text-neon-text font-mono font-semibold">Target</span>
        </div>
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-yellow">
          <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
          <span className="text-neon-text font-mono font-semibold">Frontier</span>
        </div>
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-green">
          <div className="w-4 h-4 bg-green-600 rounded-full"></div>
          <span className="text-neon-text font-mono font-semibold">Visited</span>
        </div>
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-blue">
          <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
          <span className="text-neon-text font-mono font-semibold">Unvisited</span>
        </div>
      </div>
    </div>
  )
}
