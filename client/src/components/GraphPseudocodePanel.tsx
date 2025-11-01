import { useGraphVisualizerStore } from '../store/graphVisualizerStore'
import { dijkstraHeapPseudocode } from '../algorithms/graph/dijkstraHeap'
import { dijkstraArrayPseudocode } from '../algorithms/graph/dijkstraArray'

const pseudocodeMap = {
  dijkstraHeap: dijkstraHeapPseudocode,
  dijkstraArray: dijkstraArrayPseudocode
}

export default function GraphPseudocodePanel() {
  const { algorithm, steps, currentStep, jumpToStep, showPseudocode, togglePseudocode } = useGraphVisualizerStore()
  
  if (!showPseudocode) {
    return (
      <div className="w-full bg-neon-bg-light rounded-lg p-6 border border-neon-primary/20">
        <button
          onClick={togglePseudocode}
          className="w-full py-4 text-neon-text/60 hover:text-neon-text transition-all duration-300 font-mono"
        >
          Show Pseudocode
        </button>
      </div>
    )
  }

  const currentStepData = steps[currentStep]
  const pseudocode = algorithm === 'both' ? [] : pseudocodeMap[algorithm] || []

  return (
    <div className="w-full bg-neon-bg-light rounded-lg p-6 border border-neon-primary/20 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neon-text font-mono">Pseudocode</h3>
        <button
          onClick={togglePseudocode}
          className="text-neon-text/60 hover:text-neon-text transition-all duration-300 font-mono"
        >
          Hide
        </button>
      </div>
      
      <div className="bg-neon-background rounded-lg p-4 font-mono text-sm border border-neon-primary/20">
        {pseudocode.map((line: string, index: number) => {
          const lineNumber = index + 1
          const isActiveLine = currentStepData?.activeLine === lineNumber
          
          return (
            <div
              key={index}
              className={`flex items-start py-2 px-3 rounded-lg cursor-pointer transition-all duration-300 ${
                isActiveLine
                  ? 'bg-neon-primary text-neon-background border border-neon-primary-light shadow-lg'
                  : 'text-neon-text/80 hover:bg-neon-primary/10 border border-transparent hover:border-neon-primary/20'
              }`}
              onClick={() => {
                // Find step with this active line
                const targetStep = steps.findIndex(step => step.activeLine === lineNumber)
                if (targetStep !== -1) {
                  jumpToStep(targetStep)
                }
              }}
            >
              <span className="text-neon-text/50 mr-4 select-none min-w-[2rem] font-semibold">
                {lineNumber.toString().padStart(2, ' ')}
              </span>
              <span className="flex-1">
                {line}
              </span>
              {isActiveLine && (
                <span className="ml-2 text-neon-highlight font-bold">←</span>
              )}
            </div>
          )
        })}
      </div>
      
      {currentStepData?.description && (
        <div className="mt-4 p-3 bg-neon-primary/10 rounded-lg border border-neon-primary/30">
          <p className="text-sm text-neon-text/90 font-mono">
            <strong className="text-neon-primary">Current Step:</strong> {currentStepData.description}
          </p>
        </div>
      )}
    </div>
  )
}

