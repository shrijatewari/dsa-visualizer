import type { GraphNode, GraphEdge, GraphStep } from '../../store/graphVisualizerStore'

function buildAdjacencyList(nodes: GraphNode[], edges: GraphEdge[]): Map<string, { to: string; weight: number; edgeId: string }[]> {
  const adj = new Map()
  
  for (const node of nodes) {
    adj.set(node.id, [])
  }

  for (const edge of edges) {
    if (!adj.has(edge.from)) {
      adj.set(edge.from, [])
    }
    adj.get(edge.from).push({ to: edge.to, weight: edge.weight, edgeId: edge.id })
  }

  return adj
}

export const dijkstraArray = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: string
): GraphStep[] => {
  const steps: GraphStep[] = []
  const dist = new Map<string, number>()
  const prev = new Map<string, string | undefined>()
  const visited = new Set<string>()
  
  let comparisons = 0
  let relaxations = 0
  let visitedNodes = 0

  // Build adjacency list
  const adj = buildAdjacencyList(nodes, edges)

  // Initialize distances
  for (const node of nodes) {
    dist.set(node.id, Infinity)
    prev.set(node.id, undefined)
  }
  dist.set(startId, 0)

  // Create initial snapshot
  const createSnapshot = (): { nodes: GraphNode[]; edges: GraphEdge[] } => {
    const snapshotNodes = nodes.map(node => ({
      ...node,
      dist: dist.get(node.id),
      state: node.id === startId ? 'source' as const
        : visited.has(node.id) ? 'visited' as const
        : 'unvisited' as const
    }))
    return { nodes: snapshotNodes, edges }
  }

  // Initial step
  steps.push({
    description: 'Initialize distances: set all to infinity, source to 0',
    snapshot: createSnapshot(),
    highlightNodes: [startId],
    activeLine: 1,
    metrics: { comparisons: 0, relaxations: 0, visitedNodes: 0 }
  })

  for (let i = 0; i < nodes.length; i++) {
    // Find minimum unvisited node
    let minDist = Infinity
    let u: string | null = null
    steps.push({
      description: `Iteration ${i + 1}: scanning for minimum unvisited node`,
      snapshot: createSnapshot(),
      highlightNodes: visited.has(startId) ? [] : [startId],
      activeLine: 2,
      metrics: { comparisons, relaxations, visitedNodes }
    })

    for (let j = 0; j < nodes.length; j++) {
      const nodeId = nodes[j].id
      if (!visited.has(nodeId)) {
        comparisons++
        steps.push({
          description: `Compare: ${nodeId} has distance ${dist.get(nodeId)} (min so far: ${minDist})`,
          snapshot: createSnapshot(),
          highlightNodes: [nodeId, ...(u ? [u] : [])],
          activeLine: 3,
          metrics: { comparisons, relaxations, visitedNodes }
        })

        if (dist.get(nodeId)! < minDist) {
          minDist = dist.get(nodeId)!
          u = nodeId
          
          steps.push({
            description: `New minimum found: ${u} with distance ${minDist}`,
            snapshot: createSnapshot(),
            highlightNodes: [u],
            activeLine: 3,
            metrics: { comparisons, relaxations, visitedNodes }
          })
        }
      }
    }

    if (!u || minDist === Infinity) {
      steps.push({
        description: 'No unvisited nodes reachable',
        snapshot: createSnapshot(),
        activeLine: 4,
        metrics: { comparisons, relaxations, visitedNodes }
      })
      break
    }

    visited.add(u)
    visitedNodes++
    
    steps.push({
      description: `Select ${u} with minimum distance ${minDist}`,
      snapshot: createSnapshot(),
      highlightNodes: [u],
      activeLine: 4,
      metrics: { comparisons, relaxations, visitedNodes }
    })

    // Relax neighbors
    const neighbors = adj.get(u) || []
    for (const neighbor of neighbors) {
      const v = neighbor.to
      const edgeWeight = neighbor.weight
      
      steps.push({
        description: `Check edge ${u} → ${v} (weight: ${edgeWeight})`,
        snapshot: createSnapshot(),
        highlightNodes: [u, v],
        highlightEdges: [neighbor.edgeId],
        activeLine: 5,
        metrics: { comparisons, relaxations, visitedNodes }
      })

      const alt = dist.get(u)! + edgeWeight
      if (alt < dist.get(v)!) {
        relaxations++
        dist.set(v, alt)
        prev.set(v, u)
        
        steps.push({
          description: `Relax ${v}: update distance from ${dist.get(v)} to ${alt}`,
          snapshot: createSnapshot(),
          highlightNodes: [u, v],
          highlightEdges: [neighbor.edgeId],
          activeLine: 6,
          metrics: { comparisons, relaxations, visitedNodes }
        })
      } else {
        steps.push({
          description: `No relaxation: current distance ${dist.get(v)} ≤ new distance ${alt}`,
          snapshot: createSnapshot(),
          highlightNodes: [u, v],
          highlightEdges: [neighbor.edgeId],
          activeLine: 7,
          metrics: { comparisons, relaxations, visitedNodes }
        })
      }
    }
  }

  // Final step
  steps.push({
    description: 'Dijkstra complete! All shortest paths calculated',
    snapshot: createSnapshot(),
    activeLine: 8,
    metrics: { comparisons, relaxations, visitedNodes }
  })

  return steps
}

export const dijkstraArrayPseudocode = [
  'procedure dijkstraArray(G, start)',
  '  dist[start] = 0',
  '  for i = 1 to |V|',
  '    u = extractMinViaScan(dist, visited)',
  '    visited[u] = true',
  '    for each neighbor v of u',
  '      if dist[u] + weight(u,v) < dist[v]',
  '        dist[v] = dist[u] + weight(u,v)',
  'end procedure'
]

