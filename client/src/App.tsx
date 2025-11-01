import { useState, useEffect } from 'react'
import { useVisualizerStore } from './store/visualizerStore'
import Controls from './components/Controls'
import ArrayVisualizer from './components/ArrayVisualizer'
import PseudocodePanel from './components/PseudocodePanel'
import MetricsPanel from './components/MetricsPanel'
import AlgorithmInfoModal from './components/AlgorithmInfoModal'
import DijkstraVisualizer from './pages/DijkstraVisualizer'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { bubbleSort } from './algorithms/sorting/bubbleSort'

type TabType = 'sorting' | 'dijkstra'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('sorting')
  const { setSteps, setAlgorithm } = useVisualizerStore()

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  // Initialize with bubble sort on first load
  const initializeApp = () => {
    setAlgorithm('bubbleSort')
    const initialArray = [64, 34, 25, 12, 22, 11, 90]
    const steps = bubbleSort(initialArray)
    setSteps(steps)
  }

  // Initialize on mount
  useEffect(() => {
    if (activeTab === 'sorting') {
      initializeApp()
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-neon-background text-neon-text">
      {/* Header with Tabs */}
      <header className="bg-gradient-to-r from-neon-bg-light to-neon-background border-b border-neon-primary/30 shadow-lg neon-glow-blue">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-neon-primary mb-2 font-mono neon-glow-blue">
              🚀 DSA Visualizer
            </h1>
            <p className="text-neon-text/80 font-mono">
              Interactive visualization of algorithms with step-by-step analysis
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('sorting')}
              className={`px-6 py-3 rounded-lg font-mono font-semibold transition-all duration-300 ${
                activeTab === 'sorting'
                  ? 'bg-neon-primary text-neon-background shadow-lg neon-glow-blue transform scale-105'
                  : 'bg-neon-background text-neon-text/80 hover:bg-neon-primary/20 border border-neon-primary/50 hover:border-neon-primary'
              }`}
            >
              📊 Sorting Algorithms
            </button>
            <button
              onClick={() => setActiveTab('dijkstra')}
              className={`px-6 py-3 rounded-lg font-mono font-semibold transition-all duration-300 ${
                activeTab === 'dijkstra'
                  ? 'bg-neon-primary text-neon-background shadow-lg neon-glow-blue transform scale-105'
                  : 'bg-neon-background text-neon-text/80 hover:bg-neon-primary/20 border border-neon-primary/50 hover:border-neon-primary'
              }`}
            >
              🗺️ Dijkstra's Algorithm
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'sorting' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Controls */}
            <div className="xl:col-span-1">
              <Controls />
            </div>

            {/* Center Column - Visualization */}
            <div className="xl:col-span-2">
              <div className="space-y-6">
                <ArrayVisualizer />
                
                {/* Bottom panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PseudocodePanel />
                  <MetricsPanel />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DijkstraVisualizer />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-neon-bg-light to-neon-background border-t border-neon-primary/30 mt-12 shadow-lg neon-glow-blue">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-neon-text/60 font-mono">
            <p>
              Built with React, TypeScript, Vite, TailwindCSS, and Zustand
            </p>
            <p className="mt-2 text-sm">
              Interactive educational tool for understanding algorithms
            </p>
          </div>
        </div>
      </footer>

      {/* Algorithm Info Modals */}
      {activeTab === 'sorting' && <AlgorithmInfoModal />}
    </div>
  )
}

export default App