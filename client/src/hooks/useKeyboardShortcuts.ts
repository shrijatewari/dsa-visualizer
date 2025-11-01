import { useEffect } from 'react'
import { useVisualizerStore } from '../store/visualizerStore'

export const useKeyboardShortcuts = () => {
  const {
    nextStep,
    prevStep,
    play,
    pause,
    undo,
    redo,
    reset,
    isPlaying
  } = useVisualizerStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      // Ctrl/Cmd + Y for Redo
      if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault()
        redo()
        return
      }

      // Ctrl/Cmd + Z for Undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault()
        undo()
        return
      }

      // Space for Play/Pause
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault()
        if (isPlaying) {
          pause()
        } else {
          play()
        }
        return
      }

      // Arrow keys for navigation
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        nextStep()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prevStep()
        return
      }

      // R for Reset
      if (event.key.toLowerCase() === 'r') {
        event.preventDefault()
        reset()
        return
      }

      // N for Next
      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        nextStep()
        return
      }

      // P for Previous
      if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        prevStep()
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [nextStep, prevStep, play, pause, undo, redo, reset, isPlaying])
}
