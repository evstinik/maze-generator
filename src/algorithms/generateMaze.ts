export interface Node {
  building: 'A' | 'B'
  floor: number
  room: number
  portal: 'L' | 'B' | 'R'

  connectedTo: Node[]

  specialConnection: 'withStart' | 'withFinish' | null
}

export interface Graph {
  nodes: Node[]

  nodesPerId: Map<string, Node>

  buildings: number
  floorsPerBuilding: number
  roomsPerFloor: number
}

export function nodeId(n: Node): string {
  return [n.building, n.floor, n.room, n.portal].map(String).join('')
}

export function generateMaze(): Graph {
  const BUILDINGS_COUNT = 2
  const FLOORS_COUNT = 5
  const ROOMS_PER_FLOOR_COUNT = 3

  // generate graph
  const graph = ((): Graph => {
    const nodes: Node[] = []
    const nodesPerId = new Map<string, Node>()

    for (
      let buildingCharCode = 'A'.charCodeAt(0);
      buildingCharCode < 'A'.charCodeAt(0) + BUILDINGS_COUNT;
      buildingCharCode += 1
    ) {
      const building = String.fromCharCode(buildingCharCode) as Node['building']
      for (let floor = 1; floor <= FLOORS_COUNT; floor += 1) {
        for (let room = 1; room <= ROOMS_PER_FLOOR_COUNT; room += 1) {
          for (const portal of ['L', 'B', 'R'] as Node['portal'][]) {
            const node: Node = {
              building,
              floor,
              room,
              portal,
              connectedTo: [],
              specialConnection: null,
            }
            nodes.push(node)
            nodesPerId.set(nodeId(node), node)
          }
        }
      }
    }

    return {
      nodes,
      buildings: BUILDINGS_COUNT,
      floorsPerBuilding: FLOORS_COUNT,
      roomsPerFloor: ROOMS_PER_FLOOR_COUNT,
      nodesPerId,
    }
  })()

  const startNode = (() => {
    const bottomNodes = graph.nodes.filter((n) => n.floor == 1)
    const start = bottomNodes[Math.round(Math.random() * (bottomNodes.length - 1))]
    start.specialConnection = 'withStart'
    return start
  })()

  const finishNode = (() => {
    const topNodes = graph.nodes.filter((n) => n.floor == graph.floorsPerBuilding)
    const start = topNodes[Math.round(Math.random() * (topNodes.length - 1))]
    start.specialConnection = 'withFinish'
    return start
  })()

  // Test connection A11L -> B23B
  const a11L = graph.nodesPerId.get('A11L')!
  const b23B = graph.nodesPerId.get('B23B')!
  a11L.connectedTo = [b23B]
  b23B.connectedTo = [a11L]

  return graph
}
