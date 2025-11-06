import { useEffect } from 'react'
import { useGraphVisualizerStore } from '../store/graphVisualizerStore'
import GraphControls from '../components/GraphControls'
import GraphCanvas from '../components/GraphCanvas'
import GraphPseudocodePanel from '../components/GraphPseudocodePanel'
import GraphMetricsPanel from '../components/GraphMetricsPanel'
import GraphAlgorithmInfoModal from '../components/GraphAlgorithmInfoModal'
import AdjacencyListPanel from '../components/AdjacencyListPanel'

function DijkstraVisualizer() {
  const { 
    generateRandomGraph, 
    nodes, 
    setSourceNode,
    setAlgorithm 
  } = useGraphVisualizerStore()

  // Initialize with a random graph on first load
  useEffect(() => {
    if (nodes.length === 0) {
      const { nodes: newNodes } = generateRandomGraph()
      if (newNodes.length > 0) {
        setSourceNode(newNodes[0].id)
        setAlgorithm('dijkstraHeap')
      }
    }
  }, [generateRandomGraph, setSourceNode, setAlgorithm, nodes.length])

  return (
    <div>
      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Controls and Adjacency List */}
        <div className="xl:col-span-1 space-y-6">
          <GraphControls />
          <AdjacencyListPanel />
        </div>

        {/* Center Column - Visualization */}
        <div className="xl:col-span-2">
          <div className="space-y-6">
            <GraphCanvas />
            
            {/* Bottom panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GraphPseudocodePanel />
              <GraphMetricsPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Info Modal */}
      <GraphAlgorithmInfoModal />
    </div>
  )
}

export default DijkstraVisualizer

