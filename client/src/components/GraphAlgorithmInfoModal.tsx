import { useGraphVisualizerStore } from '../store/graphVisualizerStore'

const algorithmInfo = {
  dijkstraHeap: {
    name: 'Dijkstra\'s Algorithm (Heap Implementation)',
    description: 'Dijkstra\'s Algorithm is a greedy algorithm that finds the shortest paths from a source vertex to all other vertices in a weighted graph. The heap-based implementation uses a priority queue (min-heap) to efficiently extract the minimum distance node.',
    complexity: {
      time: 'O(E log V)',
      space: 'O(V + E)'
    },
    applications: [
      'Network routing protocols',
      'GPS navigation systems',
      'Social network shortest path',
      'Traffic optimization',
      'Game pathfinding'
    ],
    characteristics: [
      'Greedy algorithm approach',
      'Only works with non-negative weights',
      'Finds shortest paths to all vertices',
      'Optimal for sparse graphs',
      'Uses priority queue for efficiency'
    ],
    heapSpecific: {
      advantage: 'Much faster for sparse graphs (E << V²)',
      operations: 'Each extract-min is O(log V)',
      bestFor: 'Real-world sparse networks'
    }
  },
  dijkstraArray: {
    name: 'Dijkstra\'s Algorithm (Array Implementation)',
    description: 'The array-based implementation of Dijkstra\'s Algorithm uses a simple array to store distances and performs linear search to find the minimum distance unvisited node. This is simpler to implement but less efficient than the heap version.',
    complexity: {
      time: 'O(V²)',
      space: 'O(V + E)'
    },
    applications: [
      'Small dense graphs',
      'Educational purposes',
      'Prototyping',
      'When V² < E log V',
      'Memory-constrained systems'
    ],
    characteristics: [
      'Simpler implementation',
      'No priority queue needed',
      'Linear extract-min operation',
      'Better for dense graphs',
      'Easier to understand'
    ],
    arraySpecific: {
      advantage: 'Simpler code, no heap overhead',
      operations: 'Each extract-min is O(V)',
      bestFor: 'Dense graphs or small networks'
    }
  }
}

export default function GraphAlgorithmInfoModal() {
  const { algorithm, showAlgorithmInfo, toggleAlgorithmInfo } = useGraphVisualizerStore()
  
  if (!showAlgorithmInfo) return null

  const info = algorithm === 'both' ? algorithmInfo.dijkstraHeap : algorithmInfo[algorithm] || algorithmInfo.dijkstraHeap

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-neon-bg-light to-neon-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-neon-primary/30 shadow-2xl neon-glow-blue">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neon-text font-mono">{info.name}</h2>
            <button
              onClick={toggleAlgorithmInfo}
              className="text-neon-text/60 hover:text-neon-text text-3xl font-mono transition-colors"
            >
              ×
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neon-text mb-2 font-mono">Description</h3>
            <p className="text-neon-text/90 font-mono leading-relaxed">{info.description}</p>
          </div>

          {/* Complexity */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Time & Space Complexity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neon-background p-4 rounded-lg border border-neon-primary/20">
                <h4 className="text-sm text-neon-text/80 mb-3 font-mono">Time Complexity</h4>
                <div className="text-2xl font-bold text-neon-primary font-mono">{info.complexity.time}</div>
              </div>
              <div className="bg-neon-background p-4 rounded-lg border border-neon-primary/20">
                <h4 className="text-sm text-neon-text/80 mb-3 font-mono">Space Complexity</h4>
                <div className="text-2xl font-bold text-neon-secondary font-mono">{info.complexity.space}</div>
              </div>
            </div>
          </div>

          {/* Implementation-specific info */}
          {'heapSpecific' in info || 'arraySpecific' in info ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Implementation Details</h3>
              <div className="bg-neon-background p-4 rounded-lg border border-neon-primary/20 space-y-2">
                {'heapSpecific' in info ? (
                  <>
                    <div className="text-neon-text/90 font-mono">
                      <span className="font-bold text-neon-primary">Advantage:</span> {info.heapSpecific.advantage}
                    </div>
                    <div className="text-neon-text/90 font-mono">
                      <span className="font-bold text-neon-primary">Operations:</span> {info.heapSpecific.operations}
                    </div>
                    <div className="text-neon-text/90 font-mono">
                      <span className="font-bold text-neon-primary">Best For:</span> {info.heapSpecific.bestFor}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-neon-text/90 font-mono">
                      <span className="font-bold text-neon-secondary">Advantage:</span> {info.arraySpecific.advantage}
                    </div>
                    <div className="text-neon-text/90 font-mono">
                      <span className="font-bold text-neon-secondary">Operations:</span> {info.arraySpecific.operations}
                    </div>
                    <div className="text-neon-text/90 font-mono">
                      <span className="font-bold text-neon-secondary">Best For:</span> {info.arraySpecific.bestFor}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : null}

          {/* Applications */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Applications</h3>
            <ul className="list-disc list-inside space-y-2">
              {info.applications.map((app: string, index: number) => (
                <li key={index} className="text-neon-text/90 font-mono">{app}</li>
              ))}
            </ul>
          </div>

          {/* Characteristics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neon-text mb-3 font-mono">Key Characteristics</h3>
            <ul className="list-disc list-inside space-y-2">
              {info.characteristics.map((char: string, index: number) => (
                <li key={index} className="text-neon-text/90 font-mono">{char}</li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              onClick={toggleAlgorithmInfo}
              className="px-6 py-2 bg-neon-primary text-neon-background rounded-lg hover:bg-neon-primary-light transition-all duration-300 font-mono font-semibold border border-neon-primary-light/50 neon-glow-blue"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

