import { useLinkedListStore } from '../store/linkedListStore'
import {
  insertAtBeginningPseudo,
  insertAtEndPseudo,
  insertAtPositionPseudo,
  deleteAtBeginningPseudo,
  deleteAtEndPseudo,
  deleteAtPositionPseudo,
  searchPseudo,
  reverseIterativePseudo,
  reverseRecursivePseudo,
  detectCyclePseudo,
  removeCyclePseudo,
  clearPseudo
} from '../data/pseudocode/linkedlists'

const map: Record<string, string[]> = {
  insertAtBeginning: insertAtBeginningPseudo,
  insertAtEnd: insertAtEndPseudo,
  insertAtPosition: insertAtPositionPseudo,
  deleteAtBeginning: deleteAtBeginningPseudo,
  deleteAtEnd: deleteAtEndPseudo,
  deleteAtPosition: deleteAtPositionPseudo,
  search: searchPseudo,
  reverseIterative: reverseIterativePseudo,
  reverseRecursive: reverseRecursivePseudo,
  detectCycle: detectCyclePseudo,
  removeCycle: removeCyclePseudo,
  clear: clearPseudo
}

export default function LinkedListPseudocodePanel() {
  const { operation, steps, currentStep, jumpToStep, showPseudocode, togglePseudocode } = useLinkedListStore()

  if (!showPseudocode) {
    return (
      <div className="w-full bg-celestial-bg-light rounded-lg p-6 border border-celestial-primary/20">
        <button
          onClick={togglePseudocode}
          className="w-full py-4 text-celestial-text/60 hover:text-celestial-text transition-all duration-300 font-mono"
        >
          Show Pseudocode
        </button>
      </div>
    )
  }

  const currentStepData = steps[currentStep]
  const pseudocode = map[operation] || []

  return (
    <div className="w-full bg-celestial-bg-light rounded-lg p-6 border border-celestial-primary/20 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-celestial-text font-mono">Pseudocode</h3>
        <button
          onClick={togglePseudocode}
          className="text-celestial-text/60 hover:text-celestial-text transition-all duration-300 font-mono"
        >
          Hide
        </button>
      </div>

      <div className="bg-celestial-bg rounded-lg p-4 font-mono text-sm border border-celestial-primary/20">
        {pseudocode.map((line, index) => {
          const lineNumber = index + 1
          const isActiveLine = currentStepData?.activeLine === lineNumber
          return (
            <div
              key={index}
              className={`flex items-start py-2 px-3 rounded-lg cursor-pointer transition-all duration-300 ${
                isActiveLine
                  ? 'bg-celestial-primary text-celestial-text border border-celestial-primary-light shadow-lg'
                  : 'text-celestial-text/80 hover:bg-celestial-primary/10 border border-transparent hover:border-celestial-primary/20'
              }`}
              onClick={() => {
                const targetStep = steps.findIndex(step => step.activeLine === lineNumber)
                if (targetStep !== -1) jumpToStep(targetStep)
              }}
            >
              <span className="text-celestial-text/50 mr-4 select-none min-w-[2rem] font-semibold">
                {lineNumber.toString().padStart(2, ' ')}
              </span>
              <span className="flex-1">{line}</span>
              {isActiveLine && <span className="ml-2 text-celestial-highlight font-bold">←</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}


