import type { GraphNode, GraphEdge, GraphStep } from '../../store/graphVisualizerStore'

// Simple min heap implementation for visualization
class MinHeap {
  private heap: Array<{ id: string; key: number }> = []
  private idToIndex: Map<string, number> = new Map()

  push(item: { id: string; key: number }) {
    const existingIndex = this.idToIndex.get(item.id)
    if (existingIndex !== undefined) {
      // Update existing entry if new key is smaller
      if (item.key < this.heap[existingIndex].key) {
        this.heap[existingIndex].key = item.key
        this.bubbleUp(existingIndex)
      }
    } else {
      this.heap.push(item)
      this.bubbleUp(this.heap.length - 1)
    }
  }

  pop(): { id: string; key: number } | undefined {
    if (this.heap.length === 0) return undefined
    if (this.heap.length === 1) {
      const item = this.heap.pop()!
      this.idToIndex.delete(item.id)
      return item
    }

    const min = this.heap[0]
    this.heap[0] = this.heap.pop()!
    this.idToIndex.set(this.heap[0].id, 0)
    this.idToIndex.delete(min.id)
    this.bubbleDown(0)

    return min
  }

  empty(): boolean {
    return this.heap.length === 0
  }

  peek(): { id: string; key: number } | undefined {
    return this.heap[0]
  }

  toArray(): Array<{ id: string; key: number }> {
    return [...this.heap]
  }

  private bubbleUp(index: number) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (this.heap[index].key >= this.heap[parentIndex].key) break
      
      this.swap(index, parentIndex)
      index = parentIndex
    }
  }

  private bubbleDown(index: number) {
    while (true) {
      let smallest = index
      const leftChild = 2 * index + 1
      const rightChild = 2 * index + 2

      if (leftChild < this.heap.length && this.heap[leftChild].key < this.heap[smallest].key) {
        smallest = leftChild
      }
      if (rightChild < this.heap.length && this.heap[rightChild].key < this.heap[smallest].key) {
        smallest = rightChild
      }

      if (smallest === index) break
      this.swap(index, smallest)
      index = smallest
    }
  }

  private swap(i: number, j: number) {
    const temp = this.heap[i]
    this.heap[i] = this.heap[j]
    this.heap[j] = temp
    
    this.idToIndex.set(this.heap[i].id, i)
    this.idToIndex.set(this.heap[j].id, j)
  }
}

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

export const dijkstraHeap = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: string
): GraphStep[] => {
  const steps: GraphStep[] = []
  const dist = new Map<string, number>()
  const prev = new Map<string, string | undefined>()
  const visited = new Set<string>()
  const pq = new MinHeap()
  
  let comparisons = 0
  let relaxations = 0
  let heapOps = 0
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
        : pq.toArray().some(pqItem => pqItem.id === node.id) ? 'frontier' as const
        : 'unvisited' as const
    }))
    return { nodes: snapshotNodes, edges }
  }

  // Initial step
  steps.push({
    description: 'Initialize distances: set all to infinity, source to 0',
    snapshot: createSnapshot(),
    highlightNodes: [startId],
    pqState: [],
    activeLine: 1,
    metrics: { comparisons: 0, relaxations: 0, heapOps: 0, visitedNodes: 0 }
  })

  // Push start node
  pq.push({ id: startId, key: 0 })
  heapOps++
  steps.push({
    description: `Push source node (${startId}) to priority queue`,
    snapshot: createSnapshot(),
    highlightNodes: [startId],
    pqState: pq.toArray(),
    activeLine: 2,
    metrics: { comparisons, relaxations, heapOps, visitedNodes }
  })

  while (!pq.empty()) {
    const { id: u, key: d } = pq.pop()!
    heapOps++
    
    // Duplicate check
    if (d !== dist.get(u)) {
      steps.push({
        description: `Skip ${u} - outdated entry in PQ (${d} vs ${dist.get(u)})`,
        snapshot: createSnapshot(),
        pqState: pq.toArray(),
        activeLine: 4,
        metrics: { comparisons, relaxations, heapOps, visitedNodes }
      })
      continue
    }

    visited.add(u)
    visitedNodes++
    
    steps.push({
      description: `Extract min: visit node ${u} with distance ${d}`,
      snapshot: createSnapshot(),
      highlightNodes: [u],
      pqState: pq.toArray(),
      activeLine: 3,
      metrics: { comparisons, relaxations, heapOps, visitedNodes }
    })

    // Relax neighbors
    const neighbors = adj.get(u) || []
    for (const neighbor of neighbors) {
      const v = neighbor.to
      const edgeWeight = neighbor.weight
      
      comparisons++
      steps.push({
        description: `Check edge ${u} → ${v} (weight: ${edgeWeight})`,
        snapshot: createSnapshot(),
        highlightNodes: [u, v],
        highlightEdges: [neighbor.edgeId],
        pqState: pq.toArray(),
        activeLine: 5,
        metrics: { comparisons, relaxations, heapOps, visitedNodes }
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
          pqState: pq.toArray(),
          activeLine: 6,
          metrics: { comparisons, relaxations, heapOps, visitedNodes }
        })

        // Push or update in PQ
        pq.push({ id: v, key: alt })
        heapOps++
        steps.push({
          description: `Push/update ${v} in PQ with distance ${alt}`,
          snapshot: createSnapshot(),
          highlightNodes: [v],
          pqState: pq.toArray(),
          activeLine: 7,
          metrics: { comparisons, relaxations, heapOps, visitedNodes }
        })
      } else {
        steps.push({
          description: `No relaxation: current distance ${dist.get(v)} ≤ new distance ${alt}`,
          snapshot: createSnapshot(),
          highlightNodes: [u, v],
          highlightEdges: [neighbor.edgeId],
          pqState: pq.toArray(),
          activeLine: 7,
          metrics: { comparisons, relaxations, heapOps, visitedNodes }
        })
      }
    }
  }

  // Final step
  steps.push({
    description: 'Dijkstra complete! All shortest paths calculated',
    snapshot: createSnapshot(),
    pqState: [],
    activeLine: 8,
    metrics: { comparisons, relaxations, heapOps, visitedNodes }
  })

  return steps
}

export const dijkstraHeapPseudocode = [
  'procedure dijkstraHeap(G, start)',
  '  dist[start] = 0',
  '  pq.push(start, 0)',
  '  while pq not empty',
  '    (d, u) = pq.pop()',
  '    if d > dist[u] then continue',
  '    for each neighbor v of u',
  '      if dist[u] + weight(u,v) < dist[v]',
  '        dist[v] = dist[u] + weight(u,v)',
  '        pq.push(v, dist[v])',
  'end procedure'
]


