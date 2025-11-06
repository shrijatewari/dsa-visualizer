import { create } from 'zustand'

export type LinkedListType = 'singly' | 'doubly' | 'circular'

export type LinkedListOperation =
  | 'insertAtBeginning'
  | 'insertAtEnd'
  | 'insertAtPosition'
  | 'deleteAtBeginning'
  | 'deleteAtEnd'
  | 'deleteAtPosition'
  | 'search'
  | 'reverseIterative'
  | 'reverseRecursive'
  | 'detectCycle'
  | 'removeCycle'
  | 'clear'

export type LLNodeId = string

export type LLNode = {
  id: LLNodeId
  value: number
  prev?: LLNodeId | null
  next?: LLNodeId | null
  role?: 'head' | 'tail' | 'current' | 'next' | 'none'
}

export type LLStep = {
  description: string
  activeLine?: number
}

type LinkedListState = {
  // Core state
  listType: LinkedListType
  operation: LinkedListOperation
  steps: LLStep[]
  currentStep: number
  isPlaying: boolean
  speed: number

  // Data
  nodes: LLNode[]

  // UI
  showPseudocode: boolean

  // Actions
  setListType: (t: LinkedListType) => void
  setOperation: (op: LinkedListOperation) => void
  setSteps: (steps: LLStep[]) => void
  nextStep: () => void
  prevStep: () => void
  jumpToStep: (i: number) => void
  play: () => void
  pause: () => void
  reset: () => void
  setSpeed: (ms: number) => void
  togglePseudocode: () => void
  initializeDemoList: (count?: number) => void
}

export const useLinkedListStore = create<LinkedListState>((set, get) => ({
  listType: 'singly',
  operation: 'insertAtBeginning',
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 500,
  nodes: [],
  showPseudocode: true,

  setListType: (t) => set({ listType: t }),
  setOperation: (op) => set({ operation: op, currentStep: 0 }),

  setSteps: (steps) => set({ steps, currentStep: 0, isPlaying: false }),

  nextStep: () => {
    const { currentStep, steps } = get()
    if (currentStep < steps.length - 1) set({ currentStep: currentStep + 1 })
  },
  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 0) set({ currentStep: currentStep - 1 })
  },
  jumpToStep: (i) => {
    const { steps } = get()
    if (i >= 0 && i < steps.length) set({ currentStep: i })
  },
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  reset: () => set({ currentStep: 0, isPlaying: false }),
  setSpeed: (ms) => set({ speed: ms }),
  togglePseudocode: () => set((s) => ({ showPseudocode: !s.showPseudocode })),

  initializeDemoList: (count = 5) => {
    const nodes: LLNode[] = Array.from({ length: count }).map((_, i) => ({
      id: `n${i}`,
      value: i + 1,
      prev: i === 0 ? null : `n${i - 1}`,
      next: i === count - 1 ? null : `n${i + 1}`,
      role: i === 0 ? 'head' : i === count - 1 ? 'tail' : 'none'
    }))
    set({ nodes })
  }
}))


