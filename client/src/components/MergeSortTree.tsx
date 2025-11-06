import React from 'react'
import type { MergeTreeNode } from '../store/visualizerStore'

interface MergeSortTreeProps {
  tree: MergeTreeNode | null
  currentLevel?: number
  currentPhase?: string
}

const MergeSortTree: React.FC<MergeSortTreeProps> = ({ tree, currentLevel = 0, currentPhase = 'initial' }) => {
  if (!tree) return null

  const getNodeColor = (node: MergeTreeNode) => {
    if (node.isMerged) {
      return 'bg-gradient-to-br from-neon-success to-neon-success border-neon-success neon-glow-green'
    }
    if (node.isComparing) {
      return 'bg-gradient-to-br from-neon-secondary to-neon-secondary-dark border-neon-secondary-light neon-glow-pink'
    }
    if (node.isActive) {
      return 'bg-gradient-to-br from-neon-highlight to-neon-highlight-dark border-neon-highlight-light neon-glow-gold'
    }
    return 'bg-gradient-to-br from-neon-primary to-neon-primary-dark border-neon-primary-light neon-glow-blue'
  }

  const getArrowColor = (node: MergeTreeNode) => {
    if (node.isActive || node.isComparing) {
      return 'text-neon-highlight'
    }
    return 'text-neon-primary/60'
  }

  const renderNode = (node: MergeTreeNode, level: number = 0): React.ReactNode => {
    const hasChildren = node.left || node.right
    const isCurrentLevel = level === currentLevel

    return (
      <div key={`${node.range.left}-${node.range.right}`} className="flex flex-col items-center">
        {/* Node Box */}
        <div className={`relative ${getNodeColor(node)} rounded-xl border-2 p-3 min-w-[120px] transition-all duration-500 ${
          isCurrentLevel ? 'scale-110 shadow-2xl' : 'shadow-lg'
        }`}>
          {/* Level indicator */}
          <div className="absolute -top-2 -left-2 bg-neon-accent text-neon-background text-xs font-mono font-bold px-2 py-1 rounded-full">
            L{level}
          </div>
          
          {/* Array elements */}
          <div className="flex gap-1 justify-center">
            {node.data.map((value, idx) => (
              <div key={idx} className="w-6 h-6 bg-neon-background/90 text-neon-text text-xs font-mono font-bold rounded flex items-center justify-center border border-neon-primary/30">
                {value}
              </div>
            ))}
          </div>
          
          {/* Range info */}
          <div className="text-xs text-neon-text/70 font-mono mt-1 text-center">
            [{node.range.left}:{node.range.right}]
          </div>
          
          {/* Status indicator */}
          {node.isLeaf && (
            <div className="absolute -top-1 -right-1 text-xs">🍃</div>
          )}
          {node.isMerged && (
            <div className="absolute -top-1 -right-1 text-xs">✅</div>
          )}
          {node.isComparing && (
            <div className="absolute -top-1 -right-1 text-xs">⚖️</div>
          )}
        </div>

        {/* Children */}
        {hasChildren && (
          <div className="flex items-start mt-4 relative">
            {/* Left child */}
            {node.left && (
              <div className="flex flex-col items-center">
                {/* Left arrow */}
                <div className={`text-lg font-bold mb-2 ${getArrowColor(node)}`}>
                  ⬅️
                </div>
                {renderNode(node.left, level + 1)}
              </div>
            )}

            {/* Spacer */}
            {node.left && node.right && (
              <div className="w-8"></div>
            )}

            {/* Right child */}
            {node.right && (
              <div className="flex flex-col items-center">
                {/* Right arrow */}
                <div className={`text-lg font-bold mb-2 ${getArrowColor(node)}`}>
                  ➡️
                </div>
                {renderNode(node.right, level + 1)}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full bg-gradient-to-br from-neon-bg-light to-neon-background rounded-xl p-6 border border-neon-accent/30 shadow-2xl neon-glow-purple">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-neon-text mb-2 font-mono">
          🌳 Merge Sort Tree Visualization
        </h3>
        <div className="flex items-center gap-4 text-sm text-neon-text/80">
          <span className="bg-neon-accent/20 px-3 py-1 rounded-full font-mono font-semibold border border-neon-accent/30 neon-glow-purple">
            Level: {currentLevel}
          </span>
          <span className="bg-neon-highlight/20 px-3 py-1 rounded-full font-mono font-semibold border border-neon-highlight/30 neon-glow-gold">
            Phase: {currentPhase?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tree visualization */}
      <div className="overflow-x-auto">
        <div className="flex justify-center min-w-max">
          {renderNode(tree)}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-blue">
          <div className="w-4 h-4 bg-gradient-to-br from-neon-primary to-neon-primary-dark border border-neon-primary-light rounded-lg shadow-lg flex-shrink-0"></div>
          <span className="text-neon-text font-mono font-semibold text-xs">Normal</span>
        </div>
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-gold">
          <div className="w-4 h-4 bg-gradient-to-br from-neon-highlight to-neon-highlight-dark border border-neon-highlight-light rounded-lg shadow-lg flex-shrink-0"></div>
          <span className="text-neon-text font-mono font-semibold text-xs">Active</span>
        </div>
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-pink">
          <div className="w-4 h-4 bg-gradient-to-br from-neon-secondary to-neon-secondary-dark border border-neon-secondary-light rounded-lg shadow-lg flex-shrink-0"></div>
          <span className="text-neon-text font-mono font-semibold text-xs">Comparing</span>
        </div>
        <div className="flex items-center gap-2 bg-neon-bg-light/80 p-2 rounded-xl border border-neon-primary/30 backdrop-blur-sm shadow-lg neon-glow-green">
          <div className="w-4 h-4 bg-gradient-to-br from-neon-success to-neon-success border border-neon-success rounded-lg shadow-lg flex-shrink-0"></div>
          <span className="text-neon-text font-mono font-semibold text-xs">Merged</span>
        </div>
      </div>
    </div>
  )
}

export default MergeSortTree











