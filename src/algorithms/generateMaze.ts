import { selectRandomElement } from '../utils'
import { isInSameRoom, roomId } from './solver'

export interface Node {
  id: string

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

  start: Node
  finish: Node

  buildings: number
  floorsPerBuilding: number
  roomsPerFloor: number
}

export function nodeId(n: Node): string {
  return [n.building, n.floor, n.room, n.portal].map(String).join('')
}

export function generateMaze(successPathLength = 10, buildings = 2, floorsPerBuilding = 5, roomsPerFloor = 3): Graph {
  // generate graph
  const graph = ((): Graph => {
    const nodes: Node[] = []
    const nodesPerId = new Map<string, Node>()

    for (
      let buildingCharCode = 'A'.charCodeAt(0);
      buildingCharCode < 'A'.charCodeAt(0) + buildings;
      buildingCharCode += 1
    ) {
      const building = String.fromCharCode(buildingCharCode) as Node['building']
      for (let floor = 1; floor <= floorsPerBuilding; floor += 1) {
        for (let room = 1; room <= roomsPerFloor; room += 1) {
          for (const portal of ['L', 'B', 'R'] as Node['portal'][]) {
            const node: Node = {
              id: '',
              building,
              floor,
              room,
              portal,
              connectedTo: [],
              specialConnection: null
            }
            node.id = nodeId(node)
            nodes.push(node)
            nodesPerId.set(nodeId(node), node)
          }
        }
      }
    }

    const start = (() => {
      const bottomNodes = nodes.filter((n) => n.floor == 1)
      const start = selectRandomElement(bottomNodes)
      start.specialConnection = 'withStart'
      return start
    })()

    const finish = (() => {
      const topNodes = nodes.filter(
        (n) =>
          n.floor == floorsPerBuilding &&
          (successPathLength % 2 == 0 ? start.building == n.building : start.building != n.building)
      )
      const finish = selectRandomElement(topNodes)
      finish.specialConnection = 'withFinish'
      return finish
    })()

    return {
      nodes,
      buildings,
      floorsPerBuilding,
      roomsPerFloor,
      nodesPerId,
      start,
      finish
    }
  })()

  const unpairedNodes = new Set(graph.nodes.filter((n) => n !== graph.start && n !== graph.finish))
  const distancesToFinish: { [roomId: string]: number } = {
    [roomId(graph.finish)]: 1 // it takes 1 portal (the finish one) to finish
  }

  // Winning path
  ;(() => {
    let currentPortal = graph.finish
    let distanceToFinish = 1 // you need to take 1 portal to finish
    let p: Node

    function nodeIsInRoomWhereAllIsUnpaired(node: Node) {
      const sameRoomNodes = graph.nodes.filter((n) => isInSameRoom(n, node))
      return sameRoomNodes.every((n) => unpairedNodes.has(n))
    }

    for (let step = 1; step < successPathLength; step += 1) {
      // find unpaired portal from the same room as current portal
      const unpairedInSameRoom = Array.from(unpairedNodes).filter((n) => isInSameRoom(n, currentPortal))
      p = selectRandomElement(unpairedInSameRoom)
      unpairedNodes.delete(p)
      currentPortal = p

      // find appropriate destination for p / currentPortal
      const appropriateDestinations = Array.from(unpairedNodes).filter((n) => {
        return (
          n.building != currentPortal.building && // different building
          nodeIsInRoomWhereAllIsUnpaired(n)
        )
      })
      p = selectRandomElement(appropriateDestinations)
      unpairedNodes.delete(p)

      // pair currentPortal & p
      p.connectedTo = [currentPortal]
      currentPortal.connectedTo = [p]
      distanceToFinish += 1
      distancesToFinish[roomId(p)] = distanceToFinish

      currentPortal = p
    }

    // connect with start
    let unpairedInSameRoom = Array.from(unpairedNodes).filter((n) => isInSameRoom(n, currentPortal))
    p = selectRandomElement(unpairedInSameRoom)
    unpairedNodes.delete(p)
    currentPortal = p

    unpairedInSameRoom = Array.from(unpairedNodes).filter((n) => isInSameRoom(n, graph.start))
    p = selectRandomElement(unpairedInSameRoom)
    p.connectedTo = [currentPortal]
    currentPortal.connectedTo = [p]
    distanceToFinish += 1
    distancesToFinish[roomId(p)] = distanceToFinish
  })()

  return graph
}
